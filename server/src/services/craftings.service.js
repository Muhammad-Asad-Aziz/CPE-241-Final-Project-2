import { pool } from "../db/pool.js";

async function generateCraftingCode(client) {
    const result = await client.query(`SELECT crafting_code FROM crafting WHERE crafting_code LIKE 'CRA-%' ORDER BY crafting_code DESC LIMIT 1`);
    let nextSeq = 1;
    if (result.rowCount > 0) {
        const lastNo = result.rows[0].crafting_code;
        const parts = lastNo.split("-");
        const lastSeq = parseInt(parts[1], 10);
        if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
    }
    return `CRA-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveCraftingId(code) {
    const r = await pool.query("SELECT id FROM crafting WHERE crafting_code = $1", [code]);
    return r.rowCount > 0 ? r.rows[0].id : null;
}

// 1. GET ALL
export async function listCraftings({ search = "", page = 1, limit = 10, sortBy = "id", sortDir = "desc" } = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const allowedSort = ["id", "crafting_code", "crafting_date", "session_id", "player_id", "qty_wanted"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "id";
    const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

    const searchParam = `%${search}%`;

    const countResult = await pool.query(
        `SELECT COUNT(*) as total 
         FROM crafting c 
         LEFT JOIN player p ON p.id = c.player_id 
         LEFT JOIN item i ON i.id = c.target_item_id
         WHERE c.crafting_code ILIKE $1 OR p.username ILIKE $1 OR i.item_name ILIKE $1`,
        [searchParam]
    );
    const total = Number(countResult.rows[0].total);

    const { rows } = await pool.query(
        `SELECT c.*, p.player_code, p.username as player_username, i.item_name as target_item_name
         FROM crafting c
         LEFT JOIN player p ON p.id = c.player_id
         LEFT JOIN item i ON i.id = c.target_item_id
         WHERE c.crafting_code ILIKE $1 OR p.username ILIKE $1 OR i.item_name ILIKE $1
         ORDER BY c.${sortColumn} ${sortDirection} NULLS LAST, c.id DESC
         LIMIT $2 OFFSET $3`,
        [searchParam, Number(limit), offset]
    );

    return {
        data: rows, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit))
    };
}

// 2. GET only 1
export async function getCrafting(code) {
    const id = await resolveCraftingId(code);
    if (!id) return null;

    const { rows: headerRows } = await pool.query("SELECT * FROM crafting WHERE id = $1", [id]);
    if (headerRows.length === 0) return null;
    const crafting = headerRows[0];

    const { rows: lineRows } = await pool.query(`
        SELECT ingredient_id AS item_id, required_quantity AS required_qty_per_unit
        FROM crafting_line_item WHERE crafting_id = $1
    `, [id]);
    
    crafting.line_items = lineRows;
    return crafting;
}

// 3. CREATE (POST)
export async function createCrafting(data) {
    const { crafting_code, crafting_date, session_id, player_id, target_item_id, qty_wanted, line_items } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        let resolvedCode = crafting_code;
        if (!resolvedCode || String(resolvedCode).trim() === "") resolvedCode = await generateCraftingCode(client);
        
        const { rows } = await client.query(
            `INSERT INTO crafting (crafting_code, crafting_date, session_id, player_id, target_item_id, qty_wanted) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [resolvedCode, crafting_date, session_id, player_id, target_item_id, qty_wanted]
        );
        const newCrafting = rows[0];

        if (line_items && line_items.length > 0) {
            let lineNumber = 1;
            for (const item of line_items) {
                const totalNeeded = Number(item.required_qty_per_unit) * Number(qty_wanted);
                await client.query(
                    `INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [newCrafting.id, lineNumber, session_id, item.item_id, item.required_qty_per_unit, totalNeeded]
                );
                lineNumber++;
            }
        }
        await client.query("COMMIT");
        return newCrafting;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

// 4. UPDATE (PUT)
export async function updateCrafting(code, data) {
    const id = await resolveCraftingId(code);
    if (!id) return null;

    const { crafting_code, crafting_date, session_id, player_id, target_item_id, qty_wanted, line_items } = data;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        let resolvedCode = (crafting_code != null && String(crafting_code).trim() !== "") ? String(crafting_code).trim() : code;
        
        const { rows } = await client.query(
            `UPDATE crafting 
             SET crafting_code = $1, crafting_date = $2, session_id = $3, player_id = $4, target_item_id = $5, qty_wanted = $6
             WHERE id = $7 RETURNING *`,
            [resolvedCode, crafting_date, session_id, player_id, target_item_id, qty_wanted, id]
        );
        const updatedCrafting = rows[0];

        await client.query("DELETE FROM crafting_line_item WHERE crafting_id = $1", [id]);

        if (line_items && line_items.length > 0) {
            let lineNumber = 1;
            for (const item of line_items) {
                const totalNeeded = Number(item.required_qty_per_unit) * Number(qty_wanted);
                await client.query(
                    `INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [id, lineNumber, session_id, item.item_id, item.required_qty_per_unit, totalNeeded]
                );
                lineNumber++;
            }
        }
        await client.query("COMMIT");
        return updatedCrafting;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

// 5. DELETE
export async function deleteCrafting(code) {
    const id = await resolveCraftingId(code);
    if (!id) return null;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM crafting_line_item WHERE crafting_id = $1", [id]);
        const { rows } = await client.query("DELETE FROM crafting WHERE id = $1 RETURNING *", [id]);
        await client.query("COMMIT");
        return rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}