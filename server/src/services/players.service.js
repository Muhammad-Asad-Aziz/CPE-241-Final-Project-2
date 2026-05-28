// Player CRUD and list (search by username, pagination, sort). Parameterized queries only.
import { pool } from "../db/pool.js";

export async function listPlayers({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "username",
  sortDir = "asc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["username", "current_xp_level", "health_points"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "username";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total FROM player
      WHERE username ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT id, username, current_xp_level, health_points, created_at
      FROM player
      WHERE username ILIKE $1
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

export async function createPlayer({
  username,
  current_xp_level = 0,
  health_points = 20,
} = {}) {
  let resolvedUsername = username;

  if (!resolvedUsername  || String(resolvedUsername).trim() === "") {
    const maxRes = await pool.query("SELECT MAX(id) as m FROM player");
    const nextId = (maxRes.rows[0].m || 0) + 1;
    resolvedUsername  = `Player_${nextId}`;
  }

  await pool.query(
    "INSERT INTO player (username, current_xp_level, health_points) VALUES ($1, $2, $3)",
    [resolvedUsername, current_xp_level, health_points],
  );

  return { username: resolvedUsername  };
}

export async function updatePlayer(
  id,
  { username, current_xp_level, health_points } = {},
) {
  // If username is empty, keep existing to avoid unique constraint
  let resolvedUsername = (username != null && String(username).trim() !== "") ? String(username).trim() : null;
  if (resolvedUsername === null) {
    const cur = await pool.query("SELECT username FROM player WHERE id=$1", [id]);
    resolvedUsername = cur.rowCount > 0 ? cur.rows[0].username  : `Player_${id}`;
  }
  await pool.query(
    "UPDATE player SET username=$1, current_xp_level=$2, health_points=$3 WHERE id=$4",
    [resolvedUsername, current_xp_level, health_points, id],
  );
  return { ok: true };
}

export async function deletePlayer(id, { force = false } = {}) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    if (force) {
      // Find all transfers belonging to this player (Notice "transfer" is in quotes!)
      const trans = await client.query('SELECT id FROM "transfer" WHERE player_id=$1', [id]);
      const transIds = trans.rows.map((t) => t.id);

      if (transIds.length > 0) {
        // Delete all items inside the transfers first
        await client.query("DELETE FROM transfer_line_item WHERE transfer_id = ANY($1::int[])", [transIds]);
        // Then delete the transfers themselves
        await client.query('DELETE FROM "transfer" WHERE id = ANY($1::int[])', [transIds]);
      }
    }
    // ADD OTHER FUNCTIONS WHERE player IS USED AS AN FK

    await client.query("DELETE FROM player WHERE id=$1", [id]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    if (err?.code === "23503") {
      const e = new Error("Cannot delete player because they have existing invoices.");
      e.statusCode = 400;
      throw e;
    }
    throw err;
  } finally {
    client.release();
  }
}

export async function getPlayerById(id) {
  const { rows } = await pool.query(
    `SELECT username, current_xp_level, health_points, created_at
     FROM player
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

/** Resolve player username to id (internal use only; id never sent to client). */
export async function resolvePlayerId(username) {
  const r = await pool.query("SELECT id FROM player WHERE username = $1", [String(username).trim()]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function updatePlayerByUsername(username, body) {
  const id = await resolvePlayerId(username);
  if (id == null) return null;
  await updatePlayer(id, body);
  return { ok: true };
}

export async function deletePlayerByUsername(username, opts = {}) {
  const id = await resolvePlayerId(username);
  if (id == null) return null;
  await deletePlayer(id, opts);
  return { ok: true };
}
