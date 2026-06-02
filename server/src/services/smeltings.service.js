import { pool } from "../db/pool.js";

async function generateSmeltingCode(client) {
  const result = await client.query(`SELECT smelting_code FROM smelting WHERE smelting_code LIKE 'SML-%' ORDER BY smelting_code DESC LIMIT 1`);
  let nextSeq = 1;
  if (result.rowCount > 0) {
    const lastNo = result.rows[0].smelting_code;
    const parts = lastNo.split("-");
    const lastSeq = parseInt(parts[1], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  return `SML-${String(nextSeq).padStart(3, "0")}`;
}

async function resolveSmeltingId(code) {
  const r = await pool.query("SELECT id FROM smelting WHERE smelting_code = $1", [code]);
  return r.rowCount > 0 ? r.rows[0].id : null;
}

export async function listSmeltings({
    search = "",
    page = 1,
    limit = 10,
    sortBy = "smelt_date", 
    sortDir = "desc", 
} = {}) {
    const offset = (Number(page) - 1) * Number(limit);
    const allowedSort = ["smelting_code", "smelt_date", "player_id", "furnace_location_xyz", "player_name"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "smelt_date";
    
    const orderCol = sortColumn === "player_name" ? "p.username" : (sortColumn === "smelting_code" ? "s.smelting_code" : `s.${sortColumn}`);
    
    const sortDirection = sortDir === "asc" ? "ASC" : "DESC";
    const searchParam = `%${search}%`;

    const countResult = await pool.query(
        `SELECT COUNT(*) as total 
         FROM smelting s
         LEFT JOIN player p ON s.player_id = p.id
         WHERE s.smelting_code ILIKE $1 
            OR s.furnace_location_xyz ILIKE $1
            OR p.username ILIKE $1`, 
        [searchParam]
    );
    const total = Number(countResult.rows[0].total);

    const { rows } = await pool.query(
        `SELECT 
            s.*, 
            p.username AS player_name 
         FROM smelting s
         LEFT JOIN player p ON s.player_id = p.id
         WHERE s.smelting_code ILIKE $1 
            OR s.furnace_location_xyz ILIKE $1
            OR p.username ILIKE $1
         ORDER BY ${orderCol} ${sortDirection} NULLS LAST, s.id DESC
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

export async function getSmelting(code) {
    const id = await resolveSmeltingId(code);
    if (!id) return null;

    const smeltingQuery = `
      SELECT s.*, p.username as player_name 
      FROM smelting s
      LEFT JOIN player p ON p.id = s.player_id
      WHERE s.id = $1;
    `;
    const lineItemQuery = `
      SELECT li.*, i.item_name as raw_input_item_name, i2.item_name as fuel_item_name, i3.item_name as output_item_name
      FROM smelting_line_item li
      LEFT JOIN item i ON i.id = li.raw_input_item_id
      LEFT JOIN item i2 ON i2.id = li.fuel_item_id
      LEFT JOIN item i3 ON i3.id = li.output_item_id
      WHERE li.smelting_id = $1;
    `;

    const smeltingResult = await pool.query(smeltingQuery, [id]);
    if (smeltingResult.rows.length === 0) return null;

    const lineItemsResult = await pool.query(lineItemQuery, [id]);
    return { ...smeltingResult.rows[0], line_items: lineItemsResult.rows };
}

export async function createSmelting(data) {
    const { smelting_code, smelt_date, player_id, furnace_location_xyz, line_items } = data;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let resolvedCode = smelting_code;
        if (!resolvedCode || String(resolvedCode).trim() === "") {
            resolvedCode = await generateSmeltingCode(client);
        }

        const { rows } = await client.query(
            `INSERT INTO smelting (smelting_code, smelt_date, player_id, furnace_location_xyz) 
             VALUES ($1, $2, $3, $4) RETURNING id, smelting_code`,
            [resolvedCode, smelt_date || new Date(), player_id, furnace_location_xyz]
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
        return { smelting_code: resolvedCode };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function updateSmelting(code, data) {
    const id = await resolveSmeltingId(code);
    if (!id) return null;

    const { smelting_code, smelt_date, player_id, furnace_location_xyz, line_items } = data;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let resolvedCode = (smelting_code != null && String(smelting_code).trim() !== "") ? String(smelting_code).trim() : code;

        await client.query(
            `UPDATE smelting SET smelting_code = $1, smelt_date = $2, player_id = $3, furnace_location_xyz = $4 WHERE id = $5`,
            [resolvedCode, smelt_date, player_id, furnace_location_xyz, id]
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
        return { smelting_code: resolvedCode };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteSmelting(code) {
    const id = await resolveSmeltingId(code);
    if (!id) return null;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query("DELETE FROM smelting_line_item WHERE smelting_id = $1", [id]);
        const { rows } = await client.query("DELETE FROM smelting WHERE id = $1 RETURNING *", [id]);
        await client.query('COMMIT');
        return rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}