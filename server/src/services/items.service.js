// Item CRUD and list (search by name/type, pagination, sort).
import { pool } from "../db/pool.js";

async function generateItemCode(client) {
  const result = await client.query(`SELECT item_code FROM item WHERE item_code LIKE 'ITM-%' ORDER BY item_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].item_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `ITM-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveItemId(code) {
  const r = await pool.query("SELECT id FROM item WHERE item_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listItems({ search = "", page = 1, limit = 10, sortBy = "item_code", sortDir = "asc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["item_code", "item_name", "item_type", "max_stack_size"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "item_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM item WHERE item_code ILIKE $1 OR item_name ILIKE $1 OR item_type ILIKE $1`,
    [searchParam]
  );

  const { rows } = await pool.query(
    `SELECT id, item_code, item_name, max_stack_size, item_type, max_durability, created_at
     FROM item WHERE item_code ILIKE $1 OR item_name ILIKE $1 OR item_type ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );

  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getItem(code) {
  const id = await resolveItemId(code);
  if (!id) return null;
  const { rows } = await pool.query(`SELECT id, item_code, item_name, max_stack_size, item_type, max_durability, created_at FROM item WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createItem({ item_code, item_name, max_stack_size, item_type = "Ingredient", max_durability = null } = {}) {
  const client = await pool.connect();
  try {
    let resolvedCode = item_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateItemCode(client);
    
    await client.query(
      "INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ($1, $2, $3, $4, $5)",
      [resolvedCode, item_name, max_stack_size, item_type, max_durability]
    );
    return { item_code: resolvedCode };
  } finally {
    client.release();
  }
}

export async function updateItem(code, { item_code, item_name, max_stack_size, item_type, max_durability } = {}) {
  const id = await resolveItemId(code);
  if (!id) return null;
  
  let resolvedCode = (item_code != null && String(item_code).trim() !== "") ? String(item_code).trim() : code;
  await pool.query(
    "UPDATE item SET item_code=$1, item_name=$2, max_stack_size=$3, item_type=$4, max_durability=$5 WHERE id=$6",
    [resolvedCode, item_name, max_stack_size, item_type, max_durability, id]
  );
  return { item_code: resolvedCode };
}

export async function deleteItem(code, { force = false } = {}) {
  const id = await resolveItemId(code);
  if (!id) return null;
  
  const client = await pool.connect();
  try {
    await client.query("begin");
    if (force) {
      const transLines = await client.query("SELECT DISTINCT transfer_id FROM transfer_line_item WHERE item_id=$1", [id]);
      const transIds = transLines.rows.map((t) => t.transfer_id);
      if (transIds.length > 0) {
        await client.query('DELETE FROM transfer_line_item WHERE transfer_id = ANY($1::int[])', [transIds]);
        await client.query('DELETE FROM "transfer" WHERE id = ANY($1::int[])', [transIds]);
      }
      await client.query("DELETE FROM recipe WHERE target_item_id=$1 OR ingredient_item_id=$1", [id]);
    }
    await client.query("DELETE FROM item WHERE id=$1", [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    if (err?.code === "23503") {
      const e = new Error("Cannot delete item because it is used in chests or recipes.");
      e.statusCode = 400;
      throw e;
    }
    throw err;
  } finally {
    client.release();
  }
}