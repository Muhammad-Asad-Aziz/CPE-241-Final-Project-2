// Transfer CRUD: list, get with line items, create/update/delete. Transactions for create/update.
import { pool } from "../db/pool.js";

export async function listMinings({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "mining_date",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "mining_date", "player_id", "biome_name"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "mining_date";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total
      FROM mining
      WHERE CAST(id AS TEXT) ILIKE $1 OR CAST(player_id AS TEXT) ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT *
      FROM mining
      WHERE CAST(id AS TEXT) ILIKE $1 OR CAST(player_id AS TEXT) ILIKE $1
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, id DESC
      LIMIT $2 OFFSET $3
    `,
    [searchParam, Number(limit), offset]
  );
  
  return {
    data: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
}

export async function getMining(id) {
  const header = await pool.query(
    `
      SELECT m.id, m.mining_date, m.player_id, m.biome_name
      FROM mining m
      WHERE m.id = $1
    `,
    [id],
  );

  if (header.rowCount === 0) return null;

  const lines = await pool.query(
    `
      SELECT li.id, li.mining_id, li.block_mined_id, li.quantity_mined,
             li.tool_used_id, li.durability_lost, li.tool_status
      FROM mining_line_item li
      WHERE li.mining_id = $1
      ORDER BY li.mining_id ASC
    `,
    [id],
  );

  return { header: header.rows[0], line_items: lines.rows };
}

export async function createMining({ mining_date, player_id, biome_name, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    const mines = await client.query(
      `
        INSERT INTO mining (mining_date, player_id, biome_name)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [mining_date || new Date(), player_id, biome_name],
    );

    const mining_id = mines.rows[0].id;

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [mining_id, li.block_mined_id, li.quantity_mined, li.tool_used_id, li.durability_lost, li.tool_status],
      );
    }

    await client.query("commit");
    return { id: mining_id };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteMining(id) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("DELETE FROM mining_line_item WHERE mining_id=$1", [id]);
    await client.query('DELETE FROM mining WHERE id=$1', [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateMining(id, { mining_date, player_id, biome_name, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    await client.query(
      `UPDATE mining SET mining_date=$1, player_id=$2, biome_name=$3 WHERE id=$4`,
      [mining_date, player_id, biome_name , id],
    );

    // Delete old lines, we will re-insert them fresh
    await client.query("DELETE FROM mining_line_item WHERE mining_id=$1", [id]);

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [id, li.block_mined_id, li.quantity_mined, li.tool_used_id, li.durability_lost, li.tool_status],
      );
    }

    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
