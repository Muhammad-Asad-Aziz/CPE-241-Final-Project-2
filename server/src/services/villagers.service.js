import { pool } from "../db/pool.js";

async function generateVillagerCode(client) {
  const result = await client.query(`SELECT villager_code FROM villager WHERE villager_code LIKE 'VIL-%' ORDER BY villager_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].villager_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `VIL-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveVillagerId(code) {
  const r = await pool.query("SELECT id FROM villager WHERE villager_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listVillagers({ search = "", page = 1, limit = 10, sortBy = "villager_code", sortDir = "asc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["villager_code", "villager_name", "profession", "biome_type"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "villager_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM villager WHERE villager_code ILIKE $1 OR villager_name ILIKE $1 OR profession ILIKE $1 OR biome_type ILIKE $1`,
    [searchParam]
  );

  const { rows } = await pool.query(
    `SELECT id, villager_code, villager_name, profession, biome_type, created_at
     FROM villager
     WHERE villager_code ILIKE $1 OR villager_name ILIKE $1 OR profession ILIKE $1 OR biome_type ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
     LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );

  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getVillager(code) {
  const id = await resolveVillagerId(code);
  if (!id) return null;
  const { rows } = await pool.query(
    `SELECT id, villager_code, villager_name, profession, biome_type, created_at FROM villager WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function createVillager({ villager_code, villager_name, profession = 'Nitwit', biome_type = 'Plains' }) {
  const client = await pool.connect();
  try {
    let resolvedCode = villager_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateVillagerCode(client);
    
    await client.query(
      `INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ($1, $2, $3, $4)`,
      [resolvedCode, villager_name, profession, biome_type]
    );
    return { villager_code: resolvedCode };
  } finally {
    client.release();
  }
}

export async function updateVillager(code, { villager_code, villager_name, profession, biome_type }) {
  const id = await resolveVillagerId(code);
  if (!id) return null;
  
  let resolvedCode = (villager_code != null && String(villager_code).trim() !== "") ? String(villager_code).trim() : code;
  await pool.query(
    `UPDATE villager SET villager_code=$1, villager_name=$2, profession=$3, biome_type=$4 WHERE id=$5`,
    [resolvedCode, villager_name, profession, biome_type, id]
  );
  return { villager_code: resolvedCode };
}

export async function deleteVillager(code) {
  const id = await resolveVillagerId(code);
  if (!id) return null;
  await pool.query(`DELETE FROM villager WHERE id = $1`, [id]);
  return { ok: true };
}