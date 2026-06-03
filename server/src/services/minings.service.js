import { pool } from "../db/pool.js";

async function generateMiningCode(client) {
  const result = await client.query(`SELECT mining_code FROM mining WHERE mining_code LIKE 'MIN-%' ORDER BY mining_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].mining_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `MIN-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveMiningId(code) {
  const r = await pool.query("SELECT id FROM mining WHERE mining_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listMinings({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "mining_date",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["mining_code", "mining_date", "player_username", "biome_name"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "mining_date";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total
      FROM mining m
      LEFT JOIN player p ON p.id = m.player_id
      WHERE m.mining_code ILIKE $1 OR p.username ILIKE $1 OR m.biome_name ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT m.*, p.username as player_username, p.player_code
      FROM mining m
      LEFT JOIN player p ON p.id = m.player_id
      WHERE m.mining_code ILIKE $1 OR p.username ILIKE $1 OR m.biome_name ILIKE $1
      ORDER BY m.${sortColumn === "player_username" ? "player_id" : (sortColumn === "mining_code" ? "mining_code" : sortColumn)} ${sortDirection} NULLS LAST, m.id DESC
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

export async function getMining(code) {
  const id = await resolveMiningId(code);
  if (!id) return null;

  const header = await pool.query(
    `
      SELECT m.id, m.mining_code, m.mining_date, m.player_id, m.biome_name,
             p.username as player_username, p.player_code
      FROM mining m
      LEFT JOIN player p ON p.id = m.player_id
      WHERE m.id = $1
    `,
    [id],
  );

  if (header.rowCount === 0) return null;

  const lines = await pool.query(
    `
      SELECT li.id, li.mining_id, li.block_mined_id, i.item_name as block_mined_name, li.quantity_mined,
             li.tool_used_id, i2.item_name as tool_used_name, li.durability_lost, li.tool_status
      FROM mining_line_item li
      LEFT JOIN item i ON i.id = li.block_mined_id 
      LEFT JOIN item i2 ON i2.id = li.tool_used_id 
      WHERE li.mining_id = $1
      ORDER BY li.id ASC
    `,
    [id],
  );

  return { header: header.rows[0], line_items: lines.rows };
}

export async function createMining({ mining_code, mining_date, player_id, biome_name, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    let resolvedCode = mining_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateMiningCode(client);

    const mines = await client.query(
      `
        INSERT INTO mining (mining_code, mining_date, player_id, biome_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, mining_code
      `,
      [resolvedCode, mining_date || new Date(), player_id, biome_name],
    );

    const mining_id = mines.rows[0].id;

    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [mining_id, li.block_mined_id, li.quantity_mined, li.tool_used_id || null, li.durability_lost || 0, li.tool_status || 'Usable'],
      );
    }

    await client.query("commit");
    return { mining_code: mines.rows[0].mining_code };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteMining(code) {
  const id = await resolveMiningId(code);
  if (!id) return null;

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

export async function updateMining(code, { mining_code, mining_date, player_id, biome_name, line_items }) {
  const id = await resolveMiningId(code);
  if (!id) return null;

  const client = await pool.connect();
  try {
    await client.query("begin");

    let resolvedCode = (mining_code != null && String(mining_code).trim() !== "") ? String(mining_code).trim() : code;

    await client.query(
      `UPDATE mining SET mining_code=$1, mining_date=$2, player_id=$3, biome_name=$4 WHERE id=$5`,
      [resolvedCode, mining_date, player_id, biome_name, id],
    );

    await client.query("DELETE FROM mining_line_item WHERE mining_id=$1", [id]);

    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [id, li.block_mined_id, li.quantity_mined, li.tool_used_id || null, li.durability_lost || 0, li.tool_status || 'Usable'],
      );
    }

    await client.query("commit");
    return { mining_code: resolvedCode };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
