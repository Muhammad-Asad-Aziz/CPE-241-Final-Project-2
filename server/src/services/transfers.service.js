// Transfer CRUD: list, get with line items, create/update/delete. Transactions for create/update.
import { pool } from "../db/pool.js";

export async function listTransfers({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "transfer_date",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "transfer_date", "player_username", "dimension"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "transfer_date";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total
      FROM "transfer" t
      LEFT JOIN player p ON p.id = t.player_id
      WHERE p.username ILIKE $1 OR t.id::text ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT t.id, t.transfer_date, t.source_chest_id, t.destination_chest_id,
             p.username as player_username,
             sc.dimension as source_dimension,
             dc.dimension as destination_dimension
      FROM "transfer" t
      LEFT JOIN player p ON p.id = t.player_id
      LEFT JOIN chest sc ON sc.id = t.source_chest_id
      LEFT JOIN chest dc ON dc.id = t.destination_chest_id
      WHERE p.username ILIKE $1 OR t.id::text ILIKE $1
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, t.id DESC
      LIMIT $2 OFFSET $3
    `,
    [searchParam, Number(limit), offset],
  );

  return {
    data: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

export async function getTransfer(id) {
  const header = await pool.query(
    `
      SELECT t.id, t.transfer_date, t.source_chest_id, t.destination_chest_id,
             p.username as player_username,
             sc.x_coordinates as src_x, sc.y_coordinates as src_y, sc.z_coordinates as src_z, sc.dimension as src_dim,
             dc.x_coordinates as dst_x, dc.y_coordinates as dst_y, dc.z_coordinates as dst_z, dc.dimension as dst_dim
      FROM "transfer" t
      LEFT JOIN player p ON p.id = t.player_id
      LEFT JOIN chest sc ON sc.id = t.source_chest_id
      LEFT JOIN chest dc ON dc.id = t.destination_chest_id
      WHERE t.id = $1
    `,
    [id],
  );

  if (header.rowCount === 0) return null;

  const lines = await pool.query(
    `
      SELECT li.id, li.transfer_line_number, li.quantity_transferred, li.destination_slot_number,
             i.id as item_id, i.item_name, i.item_type
      FROM transfer_line_item li
      LEFT JOIN item i ON i.id = li.item_id
      WHERE li.transfer_id = $1
      ORDER BY li.transfer_line_number ASC
    `,
    [id],
  );

  return { header: header.rows[0], line_items: lines.rows };
}

export async function createTransfer({ transfer_date, player_username, source_chest_id, destination_chest_id, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    const trans = await client.query(
      `
        INSERT INTO "transfer" (transfer_date, player_id, source_chest_id, destination_chest_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
      [transfer_date || new Date(), player_id, source_chest_id || null, destination_chest_id || null],
    );

    const transfer_id = trans.rows[0].id;

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [transfer_id, lineNum++, li.item_id, li.quantity_transferred, li.destination_slot_number],
      );
    }

    await client.query("commit");
    return { id: transfer_id };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteTransfer(id) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("DELETE FROM transfer_line_item WHERE transfer_id=$1", [id]);
    await client.query('DELETE FROM "transfer" WHERE id=$1', [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateTransfer(id, { transfer_date, player_username, source_chest_id, destination_chest_id, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    await client.query(
      `UPDATE "transfer" SET transfer_date=$1, player_id=$2, source_chest_id=$3, destination_chest_id=$4 WHERE id=$5`,
      [transfer_date, player_id, source_chest_id || null, destination_chest_id || null, id],
    );

    // Delete old lines, we will re-insert them fresh
    await client.query("DELETE FROM transfer_line_item WHERE transfer_id=$1", [id]);

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number)
          VALUES ($1, $2, $3, $4, $5)
        `,
        [id, lineNum++, li.item_id, li.quantity_transferred, li.destination_slot_number],
      );
    }

    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
