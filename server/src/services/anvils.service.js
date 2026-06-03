// Anvil CRUD: list, get with line items, create/update/delete. Transactions for create/update.
import { pool } from "../db/pool.js";

export async function listAnvils({
  search = "",
  page = 1,
  limit = 10,
  sortBy = "anvil_code",
  sortDir = "desc",
} = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["id", "anvil_code", "anvil_date", "player_id", "total_xp_cost"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "anvil_code";
  const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

  const searchParam = `%${search}%`;

  const countResult = await pool.query(
    `
      SELECT COUNT(*) as total
      FROM "anvil" a
      LEFT JOIN player p ON p.id = a.player_id
      WHERE p.username ILIKE $1 OR a.anvil_code ILIKE $1
    `,
    [searchParam],
  );
  const total = Number(countResult.rows[0].total);

  const { rows } = await pool.query(
    `
      SELECT a.id, a.anvil_code, a.anvil_date, a.total_xp_cost, a.player_xp_before, a.player_xp_after,
             p.username as player_username
      FROM "anvil" a
      LEFT JOIN player p ON p.id = a.player_id
      WHERE p.username ILIKE $1 OR a.anvil_code ILIKE $1
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, a.id DESC
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

export async function getAnvil(idOrCode) {
  const isId = /^\d+$/.test(idOrCode);
  const header = await pool.query(
    `
      SELECT a.id, a.anvil_code, a.anvil_date, a.total_xp_cost, a.player_xp_before, a.player_xp_after,
             p.username as player_username
      FROM "anvil" a
      LEFT JOIN player p ON p.id = a.player_id
      WHERE ${isId ? "a.id = $1" : "a.anvil_code = $1"}
    `,
    [isId ? Number(idOrCode) : idOrCode],
  );

  if (header.rowCount === 0) return null;

  const actualId = header.rows[0].id;

  const lines = await pool.query(
    `
      SELECT li.id, li.anvil_line_number, li.target_tool_id,
        t_item.item_name as target_tool_name,
        li.current_durability, li.sacrifice_item_id, 
        s_item.item_name as sacrifice_item_name, li.restored_durability, 
        li.enchantment_id, e.enchantment_name                   
      FROM anvil_line_item li
      LEFT JOIN item t_item ON t_item.id = li.target_tool_id
      LEFT JOIN item s_item ON s_item.id = li.sacrifice_item_id
      LEFT JOIN enchantment e ON e.id = li.enchantment_id
      WHERE li.anvil_id = $1
      ORDER BY li.anvil_line_number ASC
    `,
    [actualId],
  );

  return { header: header.rows[0], line_items: lines.rows };
}

export async function createAnvil({ anvil_code, anvil_date, player_username, total_xp_cost, player_xp_before, player_xp_after, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");

    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    let code = anvil_code;
    if (!code) {
      const last = await client.query('SELECT anvil_code FROM "anvil" WHERE anvil_code LIKE \'ANV-%\' ORDER BY id DESC LIMIT 1');
      if (last.rowCount > 0) {
        const num = parseInt(last.rows[0].anvil_code.replace("ANV-", ""), 10);
        code = `ANV-${String(num + 1).padStart(4, "0")}`;
      } else {
        code = "ANV-0001";
      }
    }

    const anvilResult = await client.query(
      `
        INSERT INTO "anvil" (anvil_code, anvil_date, player_id, total_xp_cost, player_xp_before, player_xp_after)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, anvil_code
      `,
      [code, anvil_date || new Date(), player_id, total_xp_cost || 0, player_xp_before || 0, player_xp_after || 0],
    );

    const anvil_id = anvilResult.rows[0].id;

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
          INSERT INTO anvil_line_item (anvil_id, anvil_line_number, target_tool_id, current_durability, sacrifice_item_id, restored_durability, enchantment_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [anvil_id, lineNum++, li.target_tool_id || null, li.current_durability || null, li.sacrifice_item_id || null, li.restored_durability || null, li.enchantment_id || null],
      );
    }

    await client.query("commit");
    return { id: code }; // Return code instead of numeric ID
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteAnvil(idOrCode) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const isId = /^\d+$/.test(idOrCode);
    const lookup = await client.query(`SELECT id FROM "anvil" WHERE ${isId ? "id = $1" : "anvil_code = $1"}`, [isId ? Number(idOrCode) : idOrCode]);
    if (lookup.rowCount === 0) {
      throw new Error("Anvil log not found");
    }
    const actualId = lookup.rows[0].id;

    await client.query("DELETE FROM anvil_line_item WHERE anvil_id=$1", [actualId]);
    await client.query('DELETE FROM "anvil" WHERE id=$1', [actualId]);
    await client.query("commit");
    return { ok: true };
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateAnvil(idOrCode, { anvil_code, anvil_date, player_username, total_xp_cost, player_xp_before, player_xp_after, line_items }) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const isId = /^\d+$/.test(idOrCode);
    const lookup = await client.query(`SELECT id FROM "anvil" WHERE ${isId ? "id = $1" : "anvil_code = $1"}`, [isId ? Number(idOrCode) : idOrCode]);
    if (lookup.rowCount === 0) {
      throw new Error("Anvil log not found");
    }
    const actualId = lookup.rows[0].id;

    let player_id = null;
    if (player_username) {
      const p = await client.query("SELECT id FROM player WHERE username = $1", [player_username]);
      if (p.rowCount === 0) throw new Error(`Player not found: ${player_username}`);
      player_id = p.rows[0].id;
    }

    await client.query(
      `UPDATE "anvil" 
       SET anvil_code=$1, anvil_date=$2, player_id=$3, total_xp_cost=$4, player_xp_before=$5, player_xp_after=$6 
       WHERE id=$7`,
      [anvil_code || idOrCode, anvil_date, player_id, total_xp_cost, player_xp_before, player_xp_after, actualId],
    );

    // Delete old lines, we will re-insert them fresh
    await client.query("DELETE FROM anvil_line_item WHERE anvil_id=$1", [actualId]);

    let lineNum = 1;
    for (const li of line_items) {
      await client.query(
        `
            INSERT INTO anvil_line_item (anvil_id, anvil_line_number, target_tool_id, current_durability, sacrifice_item_id, restored_durability, enchantment_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [actualId, lineNum++, li.target_tool_id || null, li.current_durability || null, li.sacrifice_item_id || null, li.restored_durability || null, li.enchantment_id || null],
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
