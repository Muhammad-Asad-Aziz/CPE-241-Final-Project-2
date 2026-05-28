// Recipe CRUD and list.
import { pool } from "../db/pool.js";

export async function listRecipes({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "target_item_name",
  sortDir = "asc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "target_item_name", "ingredient_item_name", "amount_needed"];
  const sortColumn = allowedSort.includes(sortBy) 
    ? sortBy === "target_item_name" ? "t.item_name" : sortBy === "ingredient_item_name" ? "i.item_name" : sortBy
    : "t.item_name";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total 
     FROM recipe r
     JOIN item t ON t.id = r.target_item_id
     JOIN item i ON i.id = r.ingredient_item_id
     WHERE t.item_name ILIKE $1 OR i.item_name ILIKE $1`,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `SELECT r.id, r.target_item_id, r.ingredient_item_id, r.amount_needed, r.created_at,
            t.item_name as target_item_name,
            i.item_name as ingredient_item_name
     FROM recipe r
     JOIN item t ON t.id = r.target_item_id
     JOIN item i ON i.id = r.ingredient_item_id
     WHERE t.item_name ILIKE $1 OR i.item_name ILIKE $1
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

export async function getRecipeById(id) {
  const { rows } = await pool.query(
    `SELECT r.id, r.target_item_id, r.ingredient_item_id, r.amount_needed, r.created_at,
            t.item_name as target_item_name,
            i.item_name as ingredient_item_name
     FROM recipe r
     JOIN item t ON t.id = r.target_item_id
     JOIN item i ON i.id = r.ingredient_item_id
     WHERE r.id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function createRecipe({ target_item_id, ingredient_item_id, amount_needed = 1 }) {
  const { rows } = await pool.query(
    `INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [target_item_id, ingredient_item_id, amount_needed],
  );
  return { id: rows[0].id };
}

export async function updateRecipe(id, { target_item_id, ingredient_item_id, amount_needed }) {
  await pool.query(
    `UPDATE recipe SET target_item_id = $1, ingredient_item_id = $2, amount_needed = $3 WHERE id = $4`,
    [target_item_id, ingredient_item_id, amount_needed, id],
  );
  return { ok: true };
}

export async function deleteRecipe(id) {
  await pool.query(`DELETE FROM recipe WHERE id = $1`, [id]);
  return { ok: true };
}