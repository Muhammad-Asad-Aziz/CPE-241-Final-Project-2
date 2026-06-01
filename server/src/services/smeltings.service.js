import { pool } from "../db/pool.js";

export async function listSmeltings({
    search = "",
    page = 1,
    limit = 10,
    sortBy = "id", 
    sortDir = "desc", 
} = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const allowedSort = ["id", "smelt_date", "player_id", "furnace_location_xyz"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "id";
    const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
    const searchParam = `%${search}%`;

    const countResult = await pool.query(
        `SELECT COUNT(*) as total FROM smelting WHERE CAST(id AS TEXT) ILIKE $1 OR furnace_location_xyz ILIKE $1`,
        [searchParam]
    );
    const total = Number(countResult.rows[0].total);

    const { rows } = await pool.query(
        `SELECT * FROM smelting 
         WHERE CAST(id AS TEXT) ILIKE $1 OR furnace_location_xyz ILIKE $1
         ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, id DESC
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

export async function getSmelting(id) {
    const smeltingQuery = `SELECT * FROM smelting WHERE id = $1;`;
    const lineItemQuery = `SELECT * FROM smelting_line_item WHERE smelting_id = $1;`;

    const smeltingResult = await pool.query(smeltingQuery, [id]);
    if (smeltingResult.rows.length === 0) return null;

    const lineItemsResult = await pool.query(lineItemQuery, [id]);
    return { ...smeltingResult.rows[0], line_items: lineItemsResult.rows };
}

export async function createSmelting(data) {
    const { smelt_date, player_id, furnace_location_xyz, line_items } = data;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const { rows } = await client.query(
            `INSERT INTO smelting (smelt_date, player_id, furnace_location_xyz) 
             VALUES ($1, $2, $3) RETURNING id`,
            [smelt_date, player_id, furnace_location_xyz]
        );
        const newId = rows[0].id;

        if (line_items && line_items.length > 0) {
            const insertLineItemText = `
                INSERT INTO smelting_line_item 
                (smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `;
            for (const item of line_items) {
                await client.query(insertLineItemText, [
                    newId, item.raw_input_item_id, item.quantity_inserted, 
                    item.fuel_item_id, item.fuel_consumed, item.output_item_id, item.output_quantity
                ]);
            }
        }
        await client.query('COMMIT');
        return getSmelting(newId);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function updateSmelting(id, data) {
    const { smelt_date, player_id, furnace_location_xyz, line_items } = data;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(
            `UPDATE smelting SET smelt_date = $1, player_id = $2, furnace_location_xyz = $3 WHERE id = $4`,
            [smelt_date, player_id, furnace_location_xyz, id]
        );

        if (line_items) {
            await client.query('DELETE FROM smelting_line_item WHERE smelting_id = $1;', [id]);
            const insertLineItemText = `
                INSERT INTO smelting_line_item 
                (smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `;
            for (const item of line_items) {
                await client.query(insertLineItemText, [
                    id, item.raw_input_item_id, item.quantity_inserted, 
                    item.fuel_item_id, item.fuel_consumed, item.output_item_id, item.output_quantity
                ]);
            }
        }
        await client.query('COMMIT');
        return getSmelting(id);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// 5. DELETE
export async function deleteSmelting(id) {
    const { rows } = await pool.query("DELETE FROM smelting WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}