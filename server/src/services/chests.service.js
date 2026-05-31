import { pool } from "../db/pool.js";

async function generateChestCode(client) {
  const result = await client.query(`SELECT chest_code FROM chest WHERE chest_code LIKE 'CST-%' ORDER BY chest_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].chest_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `CST-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveChestId(code) {
  const r = await pool.query("SELECT id FROM chest WHERE chest_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listChests({ search = "", page = 1, limit = 10, sortBy = "chest_code", sortDir = "asc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["chest_code", "dimension", "x_coordinates"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "chest_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM chest WHERE chest_code ILIKE $1 OR dimension ILIKE $1`,
    [searchParam]
  );

  const { rows } = await pool.query(
    `SELECT id, chest_code, x_coordinates, y_coordinates, z_coordinates, dimension, created_at
     FROM chest
     WHERE chest_code ILIKE $1 OR dimension ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );

  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getChest(code) {
  const id = await resolveChestId(code);
  if (!id) return null;
  const { rows } = await pool.query(
    `SELECT id, chest_code, x_coordinates, y_coordinates, z_coordinates, dimension, created_at FROM chest WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function createChest({ chest_code, x_coordinates, y_coordinates, z_coordinates, dimension = 'Overworld' }) {
  const client = await pool.connect();
  try {
    let resolvedCode = chest_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateChestCode(client);
    
    await client.query(
      `INSERT INTO chest (chest_code, x_coordinates, y_coordinates, z_coordinates, dimension) VALUES ($1, $2, $3, $4, $5)`,
      [resolvedCode, x_coordinates, y_coordinates, z_coordinates, dimension]
    );
    return { chest_code: resolvedCode };
  } finally {
    client.release();
  }
}

export async function updateChest(code, { chest_code, x_coordinates, y_coordinates, z_coordinates, dimension }) {
  const id = await resolveChestId(code);
  if (!id) return null;
  
  let resolvedCode = (chest_code != null && String(chest_code).trim() !== "") ? String(chest_code).trim() : code;
  await pool.query(
    `UPDATE chest SET chest_code=$1, x_coordinates=$2, y_coordinates=$3, z_coordinates=$4, dimension=$5 WHERE id=$6`,
    [resolvedCode, x_coordinates, y_coordinates, z_coordinates, dimension, id]
  );
  return { chest_code: resolvedCode };
}

export async function deleteChest(code) {
  const id = await resolveChestId(code);
  if (!id) return null;
  
  try {
    await pool.query(`DELETE FROM chest WHERE id = $1`, [id]);
    return { ok: true };
  } catch (err) {
    if (err?.code === "23503") {
      const e = new Error("Cannot delete chest because it contains transfer history.");
      e.statusCode = 400;
      throw e;
    }
    throw err;
  }
}