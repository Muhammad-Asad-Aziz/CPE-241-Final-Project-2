import { pool } from "../db/pool.js";

async function generatePlayerCode(client) {
  const result = await client.query(`SELECT player_code FROM player WHERE player_code LIKE 'PLR-%' ORDER BY player_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].player_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `PLR-${String(nextSeq).padStart(3, "0")}`;
}

async function resolvePlayerId(code) {
  const r = await pool.query("SELECT id FROM player WHERE player_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listPlayers({ search = "", page = 1, limit = 10, sortBy = "player_code", sortDir = "asc" } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSort = ["player_code", "username", "current_xp_level", "health_points"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "player_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM player WHERE player_code ILIKE $1 OR username ILIKE $1`, [searchParam]
  );

  const { rows } = await pool.query(
    `SELECT id, player_code, username, current_xp_level, health_points, created_at
     FROM player WHERE player_code ILIKE $1 OR username ILIKE $1
     ORDER BY ${sortColumn} ${sortDirection} NULLS LAST LIMIT $2 OFFSET $3`,
    [searchParam, Number(limit), offset]
  );
  return { data: rows, total: Number(countResult.rows[0].total), page: Number(page), limit: Number(limit), totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit)) };
}

export async function getPlayerById(code) {
  const id = await resolvePlayerId(code);
  if (!id) return null;
  const { rows } = await pool.query(`SELECT id, player_code, username, current_xp_level, health_points, created_at FROM player WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createPlayer({ player_code, username, current_xp_level = 0, health_points = 20 } = {}) {
  const client = await pool.connect();
  try {
    let resolvedCode = player_code;
    if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generatePlayerCode(client);
    
    await client.query(
      "INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ($1, $2, $3, $4)",
      [resolvedCode, username, current_xp_level, health_points]
    );
    return { player_code: resolvedCode };
  } finally { client.release(); }
}

export async function updatePlayer(code, { player_code, username, current_xp_level, health_points } = {}) {
  const id = await resolvePlayerId(code);
  if (!id) return null;
  let resolvedCode = (player_code != null && String(player_code).trim() !== "") ? String(player_code).trim() : code;
  
  await pool.query(
    "UPDATE player SET player_code=$1, username=$2, current_xp_level=$3, health_points=$4 WHERE id=$5",
    [resolvedCode, username, current_xp_level, health_points, id]
  );
  return { player_code: resolvedCode };
}

export async function deletePlayer(code, { force = false } = {}) {
  const id = await resolvePlayerId(code);
  if (!id) return null;
  const client = await pool.connect();
  try {
    await client.query("begin");
    if (force) {
      const trans = await client.query(`SELECT id FROM "transfer" WHERE player_id=$1`, [id]);
      const transIds = trans.rows.map((t) => t.id);
      if (transIds.length > 0) {
        await client.query("DELETE FROM transfer_line_item WHERE transfer_id = ANY($1::int[])", [transIds]);
        await client.query(`DELETE FROM "transfer" WHERE id = ANY($1::int[])`, [transIds]);
      }
    }
    await client.query("DELETE FROM player WHERE id=$1", [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    if (err?.code === "23503") {
      const e = new Error("Cannot delete player because they have existing chest transfers.");
      e.statusCode = 400;
      throw e;
    }
    throw err;
  } finally { client.release(); }
}