// Anvil CRUD: list, get with line items, create/update/delete. Transactions for create/update.
import { pool } from "../db/pool.js";

export async function listTransfers({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "id",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "anvil_date", "player_id", "total_xp_cost"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "id";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total
      FROM "anvil" a
      LEFT JOIN player p ON p.id = a.player_id
      WHERE p.username ILIKE $1 OR a.id::text ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT a.id, a.anvil_date, a.total_xp_cost, a.player_xp_before, a.player_xp_after,
             p.username as player_username
      FROM "anvil" a
      LEFT JOIN player p ON p.id = a.player_id
      WHERE p.username ILIKE $1 OR a.id::text ILIKE $1
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, a.id DESC
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

export async function getAnvil(id) {
  const header = await pool.query(
    `
      SELECT a.id, a.anvil_date, a.total_xp_cost, a.player_xp_before, a.player_xp_after,
             p.username as player_username
      FROM "anvil" a
      LEFT JOIN player p ON p.id = a.player_id
      WHERE a.id = $1
    `,
    [id],
  );

  if (header.rowCount === 0) return null;

  const lines = await pool.query(
    `
      SELECT li.id, li.anvil_line_number, li.target_tool_id, li.current_durability, 
             li.sacrifice_item_id, li.restored_durability, li.enchantment_id
      FROM anvil_line_item li
      WHERE li.anvil_id = $1
      ORDER BY li.anvil_line_number ASC
    `,
    [id],
  );

  return { header: header.rows[0], line_items: lines.rows };
}

export async function createAnvil({ anvil_date, player_username, total_xp_cost, player_xp_before, player_xp_after, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    const anvilResult = await client.query(
      `
        INSERT INTO "anvil" (anvil_date, player_id, total_xp_cost, player_xp_before, player_xp_after)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [anvil_date || new Date(), player_id, total_xp_cost || 0, player_xp_before || 0, player_xp_after || 0],
    );

    const anvil_id = anvilResult.rows[0].id;

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO anvil_line_item (anvil_id, anvil_line_number, target_tool_id, current_durability, sacrifice_item_id, restored_durability, enchantment_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [anvil_id, lineNum++, li.target_tool_id || null, li.current_durability || null, li.sacrifice_item_id || null, li.restored_durability || null, li.enchantment_id || null],
      );
    }

    await client.query("commit");
    return { id: anvil_id };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteAnvil(id) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("DELETE FROM anvil_line_item WHERE anvil_id=$1", [id]);
    await client.query('DELETE FROM "anvil" WHERE id=$1', [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateAnvil(id, { anvil_date, player_username, total_xp_cost, player_xp_before, player_xp_after, line_items }) {
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
      `UPDATE "anvil" 
       SET anvil_date=$1, player_id=$2, total_xp_cost=$3, player_xp_before=$4, player_xp_after=$5 
       WHERE id=$6`,
      [anvil_date, player_id, total_xp_cost, player_xp_before, player_xp_after, id],
    );

    // Delete old lines, we will re-insert them fresh
    await client.query("DELETE FROM anvil_line_item WHERE anvil_id=$1", [id]);

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
            INSERT INTO anvil_line_item (anvil_id, anvil_line_number, target_tool_id, current_durability, sacrifice_item_id, restored_durability, enchantment_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [id, lineNum++, li.target_tool_id || null, li.current_durability || null, li.sacrifice_item_id || null, li.restored_durability || null, li.enchantment_id || null],
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
