// Chest CRUD and list.
import { pool } from "../db/pool.js";

export async function listChests({
  search = "", // can search by dimension (Overworld, Nether, The End)
  page = 1,
  limit = 10,
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM chest WHERE dimension ILIKE $1`,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `SELECT id, x_coordinates, y_coordinates, z_coordinates, dimension, created_at
     FROM chest
     WHERE dimension ILIKE $1
     ORDER BY id ASC
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

export async function getChest(id) {
  const { rows } = await pool.query(
    `SELECT id, x_coordinates, y_coordinates, z_coordinates, dimension FROM chest WHERE id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function createChest({ x_coordinates, y_coordinates, z_coordinates, dimension = 'Overworld'  }) {
  const { rows } = await pool.query(
    `INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [x_coordinates, y_coordinates, z_coordinates, dimension],
  );
  return rows[0];
}

export async function updateChest(id, { x_coordinates, y_coordinates, z_coordinates, dimension }) {
  const { rows } = await pool.query(
    `UPDATE chest SET x_coordinates = $1, y_coordinates = $2, z_coordinates = $3, dimension = $4 WHERE id = $5`,
    [x_coordinates, y_coordinates, z_coordinates, dimension, id],
  );
  return { ok: true };
}

export async function deleteChest(id) {
// Prevent deleting if it has transfer history
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