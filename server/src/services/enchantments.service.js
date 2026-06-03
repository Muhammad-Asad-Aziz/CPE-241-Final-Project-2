import { pool } from "../db/pool.js";

async function generateEnchantmentCode(client) {
  const result = await client.query(`SELECT enchantment_code FROM enchantment WHERE enchantment_code LIKE 'ENC-%' ORDER BY enchantment_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].enchantment_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `ENC-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveEnchantmentId(code) {
  const r = await pool.query("SELECT id FROM enchantment WHERE enchantment_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listEnchantments({ search = "", page = 1, limit = 10, sortBy = "enchantment_code", sortDir = "asc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["enchantment_code", "enchantment_name", "max_level"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "enchantment_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM enchantment WHERE enchantment_code ILIKE $1 OR enchantment_name ILIKE $1`,
    [searchParam]
  );

  const { rows } = await pool.query(
    `SELECT id, enchantment_code, enchantment_name, max_level, created_at
     FROM enchantment
     WHERE enchantment_code ILIKE $1 OR enchantment_name ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );

  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getEnchantment(code) {
  const id = await resolveEnchantmentId(code);
  if (!id) return null;
  const { rows } = await pool.query(
    `SELECT id, enchantment_code, enchantment_name, max_level, created_at FROM enchantment WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function createEnchantment({ enchantment_code, enchantment_name, max_level }) {
  const client = await pool.connect();
  try {
    let resolvedCode = enchantment_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateEnchantmentCode(client);
    
    await client.query(
      `INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ($1, $2, $3)`,
      [resolvedCode, enchantment_name, max_level]
    );
    return { enchantment_code: resolvedCode };
  } finally {
    client.release();
  }
}

export async function updateEnchantment(code, { enchantment_code, enchantment_name, max_level }) {
  const id = await resolveEnchantmentId(code);
  if (!id) return null;
  
  let resolvedCode = (enchantment_code != null && String(enchantment_code).trim() !== "") ? String(enchantment_code).trim() : code;
  await pool.query(
    `UPDATE enchantment SET enchantment_code=$1, enchantment_name=$2, max_level=$3 WHERE id=$4`,
    [resolvedCode, enchantment_name, max_level, id]
  );
  return { enchantment_code: resolvedCode };
}

export async function deleteEnchantment(code) {
  const id = await resolveEnchantmentId(code);
  if (!id) return null;
  await pool.query(`DELETE FROM enchantment WHERE id = $1`, [id]);
  return { ok: true };
}