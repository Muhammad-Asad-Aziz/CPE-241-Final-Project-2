// Item CRUD and list (search by name/type, pagination, sort).
import { pool } from "../db/pool.js";

export async function listItems({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "item_name",
  sortDir = "asc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "item_name", "item_type", "max_stack_size"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "item_name";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total
      FROM item
      WHERE item_name ILIKE $1 OR item_type ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT id, item_name, max_stack_size, item_type, max_durability, created_at
      FROM item
      WHERE item_name ILIKE $1 OR item_type ILIKE $1
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
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

export async function createItem({
  item_name, 
  max_stack_size, 
  item_type = "Ingredient", 
  max_durability = null 
} = {}) {
    const { rows } = await pool.query(
        "INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ($1, $2, $3, $4) RETURNING id",
        [item_name, max_stack_size, item_type, max_durability],
    );
    return { id: rows[0].id };
}

export async function updateItem(id, { item_name, max_stack_size, item_type, max_durability } = {}) {
  await pool.query(
    "UPDATE item SET item_name=$1, max_stack_size=$2, item_type=$3, max_durability=$4 WHERE id=$5",
    [item_name, max_stack_size, item_type, max_durability, id]
  );
  return { ok: true };
}

export async function deleteItem(id, { force = false } = {}) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    if (force) {
      // Find all transfer lines containing this item
      const transLines = await client.query("SELECT DISTINCT transfer_id FROM transfer_line_item WHERE item_id=$1", [id]);
      const transIds = transLines.rows.map((t) => t.transfer_id);

      if (transIds.length > 0) {
        await client.query('DELETE FROM transfer_line_item WHERE transfer_id = ANY($1::int[])', [transIds]);
        await client.query('DELETE FROM "transfer" WHERE id = ANY($1::int[])', [transIds]);
      }
      // Also delete any crafting recipes involving this item
      await client.query("DELETE FROM recipe WHERE target_item_id=$1 OR ingredient_item_id=$1", [id]);
    }
    // ADD OTHER FUNCTIONS WHERE item IS USED AS AN FK

    await client.query("DELETE FROM item WHERE id=$1", [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    if (err?.code === "23503") {
      const e = new Error("not delete item because it is used in chests or recipes.");
      e.statusCode = 400;
      throw e;
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function getItemById(id) {
  const { rows } = await pool.query(
    `SELECT id, item_name, max_stack_size, item_type, max_durability, created_at FROM item WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}
