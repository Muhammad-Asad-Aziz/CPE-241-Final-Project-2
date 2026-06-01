import { pool } from "../db/pool.js";

// 1. GET ALL
export async function listCraftings({
    search = "",
    page = 1,
    limit = 10,
    sortBy = "id", 
    sortDir = "desc", 
} = {}) {
    const offset = (Number(page) - 1) * Number(limit);

    const allowedSort = ["id", "crafting_date", "session_id", "player_id", "qty_wanted"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "id";
    const sortDirection = sortDir === "asc" ? "ASC" : "DESC";

    const searchParam = `%${search}%`;

    const countResult = await pool.query(
        `
        SELECT COUNT(*) as total
        FROM crafting
        WHERE CAST(id AS TEXT) ILIKE $1 OR CAST(player_id AS TEXT) ILIKE $1
        `,
        [searchParam]
    );
    const total = Number(countResult.rows[0].total);

    const { rows } = await pool.query(
        `
        SELECT *
        FROM crafting
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

// 2. GET only 1 (แก้ชื่อคอลัมน์ให้หน้าเว็บอ่านออก)
export async function getCrafting(id) {
    const { rows: headerRows } = await pool.query("SELECT * FROM crafting WHERE id = $1", [id]);
    if (headerRows.length === 0) return null;
    const crafting = headerRows[0];

    // 👇 ดึงข้อมูลและเปลี่ยนชื่อคอลัมน์กลับ (Alias) ให้หน้าเว็บเอาไปโชว์ได้
    const { rows: lineRows } = await pool.query(`
        SELECT 
            ingredient_id AS item_id, 
            required_quantity AS required_qty_per_unit
        FROM crafting_line_item 
        WHERE crafting_id = $1
    `, [id]);
    
    crafting.line_items = lineRows;
    return crafting;
}

// 3. CREATE (POST)
export async function createCrafting(data) {
    const { crafting_date, session_id, player_id, target_item_id, qty_wanted, line_items } = data;
    
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        const { rows } = await client.query(
            `INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [crafting_date, session_id, player_id, target_item_id, qty_wanted]
        );
        const newCrafting = rows[0];

        if (line_items && line_items.length > 0) {
            let lineNumber = 1; // สร้างเลขลำดับบรรทัด
            for (const item of line_items) {
                // คำนวณ Total Needed ให้ฐานข้อมูล
                const totalNeeded = Number(item.required_qty_per_unit) * Number(qty_wanted);
                
                // 👇 INSERT ด้วยชื่อคอลัมน์ที่ตรงกับฐานข้อมูลเป๊ะๆ
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
export async function updateCrafting(id, data) {
    const { crafting_date, session_id, player_id, target_item_id, qty_wanted, line_items } = data;
    
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        const { rows } = await client.query(
            `UPDATE crafting 
             SET crafting_date = $1, session_id = $2, player_id = $3, target_item_id = $4, qty_wanted = $5
             WHERE id = $6 RETURNING *`,
            [crafting_date, session_id, player_id, target_item_id, qty_wanted, id]
        );
        const updatedCrafting = rows[0];

        if (!updatedCrafting) {
            await client.query("ROLLBACK");
            return null;
        }

        await client.query("DELETE FROM crafting_line_item WHERE crafting_id = $1", [id]);

        if (line_items && line_items.length > 0) {
            let lineNumber = 1;
            for (const item of line_items) {
                // คำนวณ Total Needed ให้ฐานข้อมูล
                const totalNeeded = Number(item.required_qty_per_unit) * Number(qty_wanted);

                // 👇 INSERT ด้วยชื่อคอลัมน์ที่ตรงกับฐานข้อมูลเป๊ะๆ
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
export async function deleteCrafting(id) {
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