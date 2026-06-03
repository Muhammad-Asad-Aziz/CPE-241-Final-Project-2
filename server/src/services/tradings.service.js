import { pool } from "../db/pool.js";

// 1. LIST ALL
export async function listTradings({
    search = "",
    page = 1,
    limit = 10,
    sortBy = "id",
    sortDir = "desc",
} = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const allowedSort = ["id", "trade_date", "player_name", "villager_id"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "id";
    const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
    const searchParam = `%${search}%`;

    const countResult = await pool.query(
        `SELECT COUNT(*) as total FROM trading_session
         WHERE player_name ILIKE $1 OR CAST(id AS TEXT) ILIKE $1`,
        [searchParam]
    );
    const total = Number(countResult.rows[0].total);

    const { rows } = await pool.query(
        `SELECT ts.*, v.villager_name, v.profession
         FROM trading_session ts
         LEFT JOIN villager v ON v.id = ts.villager_id
         WHERE ts.player_name ILIKE $1 OR CAST(ts.id AS TEXT) ILIKE $1
         ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
         LIMIT $2 OFFSET $3`,
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

// 2. GET ONE
export async function getTrading(id) {
    const { rows: headerRows } = await pool.query(
        `SELECT ts.*, v.villager_name, v.profession
         FROM trading_session ts
         LEFT JOIN villager v ON v.id = ts.villager_id
         WHERE ts.id = $1`,
        [id]
    );
    if (headerRows.length === 0) return null;
    const trading = headerRows[0];

    const { rows: lineRows } = await pool.query(
        `SELECT tli.*,
                ig.item_name AS item_given_name,
                ir.item_name AS item_received_name
         FROM trading_line_item tli
         LEFT JOIN item ig ON ig.id = tli.item_given_id
         LEFT JOIN item ir ON ir.id = tli.item_received_id
         WHERE tli.trading_session_id = $1
         ORDER BY tli.line_number ASC`,
        [id]
    );
    trading.line_items = lineRows;
    return trading;
}

// 3. CREATE
export async function createTrading(data) {
    const { trade_date, player_name, villager_id, line_items } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `INSERT INTO trading_session (trade_date, player_name, villager_id)
             VALUES ($1, $2, $3) RETURNING *`,
            [trade_date, player_name, villager_id]
        );
        const newTrading = rows[0];

        if (line_items && line_items.length > 0) {
            let lineNumber = 1;
            for (const line of line_items) {
                await client.query(
                    `INSERT INTO trading_line_item
                     (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [newTrading.id, lineNumber, line.item_given_id, line.quantity_given, line.item_received_id, line.quantity_received, line.trade_uses_remaining]
                );
                lineNumber++;
            }
        }
        await client.query("COMMIT");
        return newTrading;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

// 4. UPDATE
export async function updateTrading(id, data) {
    const { trade_date, player_name, villager_id, line_items } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `UPDATE trading_session SET trade_date=$1, player_name=$2, villager_id=$3
             WHERE id=$4 RETURNING *`,
            [trade_date, player_name, villager_id, id]
        );
        if (!rows[0]) { await client.query("ROLLBACK"); return null; }

        await client.query("DELETE FROM trading_line_item WHERE trading_session_id=$1", [id]);

        if (line_items && line_items.length > 0) {
            let lineNumber = 1;
            for (const line of line_items) {
                await client.query(
                    `INSERT INTO trading_line_item
                     (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [id, lineNumber, line.item_given_id, line.quantity_given, line.item_received_id, line.quantity_received, line.trade_uses_remaining]
                );
                lineNumber++;
            }
        }
        await client.query("COMMIT");
        return rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

// 5. DELETE
export async function deleteTrading(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM trading_line_item WHERE trading_session_id=$1", [id]);
        const { rows } = await client.query("DELETE FROM trading_session WHERE id=$1 RETURNING *", [id]);
        await client.query("COMMIT");
        return rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}
