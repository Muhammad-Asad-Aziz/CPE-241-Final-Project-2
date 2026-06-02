// Villager CRUD and list.
import { pool } from "../db/pool.js";

export async function listVillagers({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "villager_name",
  sortDir = "asc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "villager_name", "profession", "biome_type"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "villager_name";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total 
     FROM villager 
     WHERE villager_name ILIKE $1 OR profession ILIKE $1 OR biome_type ILIKE $1`,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `SELECT id, villager_name, profession, biome_type, created_at
     FROM villager
     WHERE villager_name ILIKE $1 OR profession ILIKE $1 OR biome_type ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
     LIMIT $2 OFFSET $3`,
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

export async function getVillagerById(id) {
  const { rows } = await pool.query(
    `SELECT id, villager_name, profession, biome_type, created_at FROM villager WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function createVillager({ villager_name, profession = 'Nitwit', biome_type = 'Plains' }) {
  const { rows } = await pool.query(
    `INSERT INTO villager (villager_name, profession, biome_type)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [villager_name, profession, biome_type],
  );
  return { id: rows[0].id };
}

export async function updateVillager(id, { villager_name, profession, biome_type }) {
  await pool.query(
    `UPDATE villager SET villager_name = $1, profession = $2, biome_type = $3 WHERE id = $4`,
    [villager_name, profession, biome_type, id],
  );
  return { ok: true };
}

export async function deleteVillager(id) {
  await pool.query(`DELETE FROM villager WHERE id = $1`, [id]);
  return { ok: true };
}