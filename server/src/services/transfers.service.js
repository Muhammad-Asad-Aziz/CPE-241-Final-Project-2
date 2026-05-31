import { pool } from "../db/pool.js";

async function generateTransferCode(client) {
  const result = await client.query(`SELECT transfer_code FROM transfer WHERE transfer_code LIKE 'TRN-%' ORDER BY transfer_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].transfer_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `TRN-${String(nextSeq).padStart(4, "0")}`;
}

// Helper: Resolve Code to Internal ID
async function resolveTransferId(code) {
  const r = await pool.query("SELECT id FROM transfer WHERE transfer_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listTransfers({ search = "", page = 1, limit = 10, sortBy = "transfer_date", sortDir = "desc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["transfer_code", "transfer_date", "player_username", "dimension"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "transfer_date";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM transfer t LEFT JOIN player p ON p.id = t.player_id WHERE p.username ILIKE $1 OR t.transfer_code ILIKE $1`,
    [searchParam]
  );

  const { rows } = await pool.query(
    `SELECT t.id, t.transfer_code, t.transfer_date, t.source_chest_id, t.destination_chest_id,
            p.username as player_username, sc.dimension as source_dimension, dc.dimension as destination_dimension
     FROM transfer t
     LEFT JOIN player p ON p.id = t.player_id
     LEFT JOIN chest sc ON sc.id = t.source_chest_id
     LEFT JOIN chest dc ON dc.id = t.destination_chest_id
     WHERE p.username ILIKE $1 OR t.transfer_code ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, t.id DESC
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );

  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getTransfer(code) {
  const id = await resolveTransferId(code);
  if (!id) return null;

  const header = await pool.query(
    `SELECT t.id, t.transfer_code, t.transfer_date, t.source_chest_id, t.destination_chest_id,
            p.username as player_username, sc.x_coordinates as src_x, sc.y_coordinates as src_y, sc.z_coordinates as src_z, sc.dimension as src_dim,
            dc.x_coordinates as dst_x, dc.y_coordinates as dst_y, dc.z_coordinates as dst_z, dc.dimension as dst_dim
     FROM transfer t
     LEFT JOIN player p ON p.id = t.player_id
     LEFT JOIN chest sc ON sc.id = t.source_chest_id
     LEFT JOIN chest dc ON dc.id = t.destination_chest_id
     WHERE t.id = $1`,
    [id]
  );

  const lines = await pool.query(
    `SELECT li.id, li.transfer_line_number, li.quantity_transferred, li.destination_slot_number,
            i.id as item_id, i.item_name, i.item_type
     FROM transfer_line_item li
     LEFT JOIN item i ON i.id = li.item_id
     WHERE li.transfer_id = $1 ORDER BY li.transfer_line_number ASC`,
    [id]
  );

  return { header: header.rows[0], line_items: lines.rows };
}

export async function createTransfer({ transfer_code, transfer_date, player_username, source_chest_id, destination_chest_id, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    let resolvedCode = transfer_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateTransferCode(client);

    const trans = await client.query(
      `INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, transfer_code`,
      [resolvedCode, transfer_date || new Date(), player_id, source_chest_id || null, destination_chest_id || null]
    );

    const transfer_id = trans.rows[0].id;
    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number)
         VALUES ($1, $2, $3, $4, $5)`,
        [transfer_id, lineNum++, li.item_id, li.quantity_transferred, li.destination_slot_number]
      );
    }
    await client.query("commit");
    return { transfer_code: trans.rows[0].transfer_code };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateTransfer(code, { transfer_code, transfer_date, player_username, source_chest_id, destination_chest_id, line_items }) {
  const id = await resolveTransferId(code);
  if (!id) return null;

  const client = await pool.connect();
  try {
    await client.query("begin");
    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    let resolvedCode = (transfer_code != null && String(transfer_code).trim() !== "") ? String(transfer_code).trim() : code;

    await client.query(
      `UPDATE transfer SET transfer_code=$1, transfer_date=$2, player_id=$3, source_chest_id=$4, destination_chest_id=$5 WHERE id=$6`,
      [resolvedCode, transfer_date, player_id, source_chest_id || null, destination_chest_id || null, id]
    );

    await client.query("DELETE FROM transfer_line_item WHERE transfer_id=$1", [id]);
    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, lineNum++, li.item_id, li.quantity_transferred, li.destination_slot_number]
      );
    }
    await client.query("commit");
    return { transfer_code: resolvedCode };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteTransfer(code) {
  const id = await resolveTransferId(code);
  if (!id) return null;
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("DELETE FROM transfer_line_item WHERE transfer_id=$1", [id]);
    await client.query('DELETE FROM transfer WHERE id=$1', [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}