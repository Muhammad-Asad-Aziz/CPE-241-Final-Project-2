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

// 2. GET only 1
export async function getCrafting(id) {
    const { rows } = await pool.query("SELECT * FROM crafting WHERE id = $1", [id]);
    return rows[0];
}

// 3. CREATE (POST)
export async function createCrafting(data) {
    const { crafting_date, session_id, player_id, target_item_id, qty_wanted } = data;
    const { rows } = await pool.query(
        `INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [crafting_date, session_id, player_id, target_item_id, qty_wanted]
    );
    return rows[0];
}

// 4. UPDATE (PUT)
export async function updateCrafting(id, data) {
    const { crafting_date, session_id, player_id, target_item_id, qty_wanted } = data;
    const { rows } = await pool.query(
        `UPDATE crafting 
         SET crafting_date = $1, session_id = $2, player_id = $3, target_item_id = $4, qty_wanted = $5
         WHERE id = $6 RETURNING *`,
        [crafting_date, session_id, player_id, target_item_id, qty_wanted, id]
    );
    return rows[0];
}

// 5. DELETE
export async function deleteCrafting(id) {
    const { rows } = await pool.query("DELETE FROM crafting WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}