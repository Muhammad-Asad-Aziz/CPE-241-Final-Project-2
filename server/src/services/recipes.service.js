import { pool } from "../db/pool.js";

async function generateRecipeCode(client) {
  const result = await client.query(`SELECT recipe_code FROM recipe WHERE recipe_code LIKE 'RCP-%' ORDER BY recipe_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].recipe_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `RCP-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveRecipeId(code) {
  const r = await pool.query("SELECT id FROM recipe WHERE recipe_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listRecipes({ search = "", page = 1, limit = 10, sortBy = "recipe_code", sortDir = "asc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["recipe_code", "target_item_name", "ingredient_item_name", "amount_needed"];
  const sortColumn = allowedSort.includes(sortBy) 
    ? sortBy === "target_item_name" ? "t.item_name" : sortBy === "ingredient_item_name" ? "i.item_name" : `r.${sortBy}`
    : "r.recipe_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total 
     FROM recipe r
     JOIN item t ON t.id = r.target_item_id
     JOIN item i ON i.id = r.ingredient_item_id
     WHERE r.recipe_code ILIKE $1 OR t.item_name ILIKE $1 OR i.item_name ILIKE $1`,
    [searchParam],
  );

  const { rows } = await pool.query(
    `SELECT r.id, r.recipe_code, r.target_item_id, r.ingredient_item_id, r.amount_needed, r.created_at,
            t.item_name as target_item_name,
            i.item_name as ingredient_item_name
     FROM recipe r
     JOIN item t ON t.id = r.target_item_id
     JOIN item i ON i.id = r.ingredient_item_id
     WHERE r.recipe_code ILIKE $1 OR t.item_name ILIKE $1 OR i.item_name ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset],
  );

  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getRecipe(code) {
  const id = await resolveRecipeId(code);
  if (!id) return null;
  const { rows } = await pool.query(
    `SELECT r.id, r.recipe_code, r.target_item_id, r.ingredient_item_id, r.amount_needed, r.created_at,
            t.item_name as target_item_name,
            i.item_name as ingredient_item_name
     FROM recipe r
     JOIN item t ON t.id = r.target_item_id
     JOIN item i ON i.id = r.ingredient_item_id
     WHERE r.id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function createRecipe({ recipe_code, target_item_id, ingredient_item_id, amount_needed = 1 }) {
  const client = await pool.connect();
  try {
    let resolvedCode = recipe_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateRecipeCode(client);
    
    await client.query(
      `INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ($1, $2, $3, $4)`,
      [resolvedCode, target_item_id, ingredient_item_id, amount_needed]
    );
    return { recipe_code: resolvedCode };
  } finally {
    client.release();
  }
}

export async function updateRecipe(code, { recipe_code, target_item_id, ingredient_item_id, amount_needed }) {
  const id = await resolveRecipeId(code);
  if (!id) return null;
  
  let resolvedCode = (recipe_code != null && String(recipe_code).trim() !== "") ? String(recipe_code).trim() : code;
  await pool.query(
    `UPDATE recipe SET recipe_code=$1, target_item_id = $2, ingredient_item_id = $3, amount_needed = $4 WHERE id = $5`,
    [resolvedCode, target_item_id, ingredient_item_id, amount_needed, id],
  );
  return { recipe_code: resolvedCode };
}

export async function deleteRecipe(code) {
  const id = await resolveRecipeId(code);
  if (!id) return null;
  await pool.query(`DELETE FROM recipe WHERE id = $1`, [id]);
  return { ok: true };
}