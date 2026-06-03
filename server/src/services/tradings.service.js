import { pool } from "../db/pool.js";

// 1. LIST ALL
export async function listTradings({
    search = "",
    page = 1,
    limit = 10,
    sortBy = "trade_code",
    sortDir = "desc",
} = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const allowedSort = ["id", "trade_code", "trade_date", "player_name", "villager_id"];
    const sortByCol = allowedSort.includes(sortBy) ? sortBy : "trade_code";
    const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
    const sortColumn = sortByCol === "trade_code"
        ? "NULLIF(regexp_replace(ts.trade_code, '\\D', '', 'g'), '')::int"
        : `ts.${sortByCol}`;
    const searchParam = `%${search}%`;

    const countResult = await pool.query(
        `SELECT COUNT(*) as total FROM trading_session
         WHERE player_name ILIKE $1 OR trade_code ILIKE $1`,
        [searchParam]
    );
    const total = Number(countResult.rows[0].total);

    const { rows } = await pool.query(
        `SELECT ts.*, v.villager_name, v.profession
         FROM trading_session ts
         LEFT JOIN villager v ON v.id = ts.villager_id
         WHERE ts.player_name ILIKE $1 OR ts.trade_code ILIKE $1
         ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, ts.id DESC
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
export async function getTrading(idOrCode) {
    const isId = /^\d+$/.test(idOrCode);
    const { rows: headerRows } = await pool.query(
        `SELECT ts.*, v.villager_name, v.profession
         FROM trading_session ts
         LEFT JOIN villager v ON v.id = ts.villager_id
         WHERE ${isId ? "ts.id = $1" : "ts.trade_code = $1"}`,
        [isId ? Number(idOrCode) : idOrCode]
    );
    if (headerRows.length === 0) return null;
    const trading = headerRows[0];
    const actualId = trading.id;

    const { rows: lineRows } = await pool.query(
        `SELECT tli.*,
                 ig.item_name AS item_given_name,
                 ir.item_name AS item_received_name
         FROM trading_line_item tli
         LEFT JOIN item ig ON ig.id = tli.item_given_id
         LEFT JOIN item ir ON ir.id = tli.item_received_id
         WHERE tli.trading_session_id = $1
         ORDER BY tli.line_number ASC`,
        [actualId]
    );
    trading.line_items = lineRows;
    return trading;
}

// 3. CREATE
export async function createTrading(data) {
    const { trade_code, trade_date, player_name, villager_id, line_items } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        let code = trade_code;
        if (!code) {
            const last = await client.query('SELECT trade_code FROM "trading_session" WHERE trade_code LIKE \'TRD-%\' ORDER BY id DESC LIMIT 1');
            if (last.rowCount > 0) {
                const num = parseInt(last.rows[0].trade_code.replace("TRD-", ""), 10);
                code = `TRD-${num + 1}`;
            } else {
                code = "TRD-1";
            }
        }

        const { rows } = await client.query(
            `INSERT INTO trading_session (trade_code, trade_date, player_name, villager_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [code, trade_date || new Date(), player_name, villager_id]
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
export async function updateTrading(idOrCode, data) {
    const { trade_code, trade_date, player_name, villager_id, line_items } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const isId = /^\d+$/.test(idOrCode);
        const lookup = await client.query(`SELECT id FROM "trading_session" WHERE ${isId ? "id = $1" : "trade_code = $1"}`, [isId ? Number(idOrCode) : idOrCode]);
        if (lookup.rowCount === 0) { await client.query("ROLLBACK"); return null; }
        const actualId = lookup.rows[0].id;

        const { rows } = await client.query(
            `UPDATE trading_session SET trade_code=$1, trade_date=$2, player_name=$3, villager_id=$4
             WHERE id=$5 RETURNING *`,
            [trade_code || idOrCode, trade_date, player_name, villager_id, actualId]
        );

        await client.query("DELETE FROM trading_line_item WHERE trading_session_id=$1", [actualId]);

        if (line_items && line_items.length > 0) {
            let lineNumber = 1;
            for (const line of line_items) {
                await client.query(
                    `INSERT INTO trading_line_item
                     (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [actualId, lineNumber, line.item_given_id, line.quantity_given, line.item_received_id, line.quantity_received, line.trade_uses_remaining]
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
export async function deleteTrading(idOrCode) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const isId = /^\d+$/.test(idOrCode);
        const lookup = await client.query(`SELECT id FROM "trading_session" WHERE ${isId ? "id = $1" : "trade_code = $1"}`, [isId ? Number(idOrCode) : idOrCode]);
        if (lookup.rowCount === 0) { await client.query("ROLLBACK"); return null; }
        const actualId = lookup.rows[0].id;

        await client.query("DELETE FROM trading_line_item WHERE trading_session_id=$1", [actualId]);
        const { rows } = await client.query("DELETE FROM trading_session WHERE id=$1 RETURNING *", [actualId]);
        await client.query("COMMIT");
        return rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}
