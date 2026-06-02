// Enchantment CRUD and list.
import { pool } from "../db/pool.js";

export async function listEnchantments({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "enchantment_name",
  sortDir = "asc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "enchantment_name", "max_level"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "enchantment_name";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM enchantment WHERE enchantment_name ILIKE $1`,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `SELECT id, enchantment_name, max_level, created_at
     FROM enchantment
     WHERE enchantment_name ILIKE $1
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

export async function getEnchantmentById(id) {
  const { rows } = await pool.query(
    `SELECT id, enchantment_name, max_level, created_at FROM enchantment WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function createEnchantment({ enchantment_name, max_level }) {
  const { rows } = await pool.query(
    `INSERT INTO enchantment (enchantment_name, max_level)
     VALUES ($1, $2)
     RETURNING id`,
    [enchantment_name, max_level],
  );
  return { id: rows[0].id };
}

export async function updateEnchantment(id, { enchantment_name, max_level }) {
  await pool.query(
    `UPDATE enchantment SET enchantment_name = $1, max_level = $2 WHERE id = $3`,
    [enchantment_name, max_level, id],
  );
  return { ok: true };
}

export async function deleteEnchantment(id) {
  await pool.query(`DELETE FROM enchantment WHERE id = $1`, [id]);
  return { ok: true };
}