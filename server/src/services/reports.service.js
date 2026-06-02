import { pool } from "../db/pool.js";

// Report by Muhammad Asad Aziz Simple 1: List all items currently stored inside a specific Chest ID
export async function getChestInventory({ chest_id }) {
  const chestParam = chest_id ? Number(chest_id) : null;

  const { rows } = await pool.query(
    `
      WITH items_in AS (
        SELECT t.destination_chest_id as chest_id, li.item_id, SUM(li.quantity_transferred) as qty
        FROM transfer_line_item li
        JOIN transfer t ON t.id = li.transfer_id
        WHERE t.destination_chest_id IS NOT NULL
        GROUP BY t.destination_chest_id, li.item_id
      ),
      items_out AS (
        SELECT t.source_chest_id as chest_id, li.item_id, SUM(li.quantity_transferred) as qty
        FROM transfer_line_item li
        JOIN transfer t ON t.id = li.transfer_id
        WHERE t.source_chest_id IS NOT NULL
        GROUP BY t.source_chest_id, li.item_id
      ),
      chest_inventory AS (
        SELECT 
          COALESCE(iin.chest_id, iout.chest_id) as chest_id,
          COALESCE(iin.item_id, iout.item_id) as item_id,
          (COALESCE(iin.qty, 0) - COALESCE(iout.qty, 0)) as current_quantity
        FROM items_in iin
        FULL OUTER JOIN items_out iout 
          ON iin.chest_id = iout.chest_id AND iin.item_id = iout.item_id
      )
      SELECT 
        c.chest_code, 
        c.dimension,
        i.item_code, 
        i.item_name, 
        i.item_type,
        ci.current_quantity
      FROM chest_inventory ci
      JOIN item i ON i.id = ci.item_id
      JOIN chest c ON c.id = ci.chest_id
      WHERE ci.current_quantity > 0
        AND ($1::bigint IS NULL OR ci.chest_id = $1::bigint)
      ORDER BY c.chest_code ASC, ci.current_quantity DESC
    `,
    [chestParam]
  );
  return { data: rows };
}

// Report by Muhammad Asad Aziz Simple 2: List all item transfers made on a specific Date
export async function getDailyTransfers({ date_from, date_to }) {
  const dFrom = date_from ? date_from : null;
  const dTo = date_to ? date_to : null;

  const { rows } = await pool.query(
    `
      SELECT 
          t.transfer_code, 
          t.transfer_date, 
          p.player_code,
          p.username AS player_username,
          i.item_name AS item_moved, 
          i.item_code,
          COALESCE(sc.chest_code, 'Player Inventory') AS src_chest,
          COALESCE(dc.chest_code, 'Player Inventory') AS dst_chest,
          li.quantity_transferred
      FROM transfer t
      JOIN player p ON t.player_id = p.id
      JOIN transfer_line_item li ON t.id = li.transfer_id
      JOIN item i ON li.item_id = i.id
      LEFT JOIN chest sc ON t.source_chest_id = sc.id
      LEFT JOIN chest dc ON t.destination_chest_id = dc.id
      WHERE ($1::date IS NULL OR DATE(t.transfer_date) >= $1::date)
        AND ($2::date IS NULL OR DATE(t.transfer_date) <= $2::date)
      ORDER BY t.transfer_date DESC, t.transfer_code ASC
    `,
    [dFrom, dTo]
  );
  return { data: rows };
}

// Report by Muhammad Asad Aziz Analysis: Show Chest Capacity Utilization (%) with Dimension query/filter
export async function getChestUtilization({ dimension } = {}) {
  const dimParam = dimension ? dimension : null;

  const { rows } = await pool.query(
    `
      SELECT 
          c.chest_code,
          c.dimension,
          COUNT(DISTINCT li.destination_slot_number) as used_slots,
          27 as total_capacity,
          COALESCE(ROUND((COUNT(DISTINCT li.destination_slot_number) * 100.0) / 27, 2), 0) as utilization_percent
      FROM chest c
      LEFT JOIN transfer t ON c.id = t.destination_chest_id
      LEFT JOIN transfer_line_item li ON li.transfer_id = t.id
      WHERE ($1::text IS NULL OR c.dimension ILIKE $1::text)
      GROUP BY c.id, c.chest_code, c.dimension
      ORDER BY c.chest_code ASC
    `,
    [dimParam]
  );
  return { data: rows };
}

// Report by Supanut Sopha Crafting Simple 1:  List all crafting sessions made by Player Name: ___.
export async function getPlayerCraftingHistory({ playerName = "" }) {
    const { rows } = await pool.query(
        `SELECT c.crafting_date AS "Craft_Date", 
                c.id AS "Session_ID", 
                p.username AS "Player_Name", 
                i.item_name AS "Target_Item", 
                c.qty_wanted AS "Qty_Wanted"
         FROM crafting c
         JOIN player p ON c.player_id = p.id
         LEFT JOIN item i ON c.target_item_id = i.id
         WHERE p.username ILIKE $1
         ORDER BY c.crafting_date DESC`,
        [`%${playerName}%`]
    );
    return rows;
}
// Report by Supanut Sopha Crafting Simple 2:  Print Recipe requirements for Item Name: ___.
export async function getRecipeRequirements({ itemName = "" }) {
    const { rows } = await pool.query(
        `SELECT t.item_name AS "Target_Item", 
                i.item_name AS "Ingredient_Needed", 
                r.amount_needed AS "Required_Qty"
         FROM recipe r
         JOIN item t ON r.target_item_id = t.id
         JOIN item i ON r.ingredient_item_id = i.id
         WHERE t.item_name ILIKE $1`,
        [`%${itemName}%`]
    );
    return rows;
}

// Report by Supanut Sopha Crafting Analysis: Show Top 5 Most Crafted Items in the server from Date: ___ to ___.
export async function getTopCraftedItems({ fromDate, toDate }) {
    const from = fromDate || '2000-01-01';
    const to = toDate || '2100-12-31';

    const { rows } = await pool.query(
        `SELECT i.item_name AS "Target_Item", 
                i.item_type AS "Item_Type", 
                SUM(c.qty_wanted) AS "Total_Quantity_Crafted"
         FROM crafting c
         JOIN item i ON c.target_item_id = i.id
         WHERE c.crafting_date >= $1 AND c.crafting_date <= $2
         GROUP BY i.item_name, i.item_type
         ORDER BY "Total_Quantity_Crafted" DESC
         LIMIT 5`,
        [from, to]
    );
    return rows;
}

// Report 1 by Xander: List all ores smelted in a specific Furnace Location: ___ (Proposal)
export async function getFurnaceLocationReport({ location = "" }) {
    const { rows } = await pool.query(
        `SELECT s.id AS "Job_ID", 
                s.smelt_date AS "Date", 
                p.username AS "Player", 
                ri.item_name AS "Raw_Ore", 
                sli.quantity_inserted AS "Qty_In",
                oi.item_name AS "Output_Item", 
                sli.output_quantity AS "Qty_Out"
         FROM smelting s
         JOIN player p ON s.player_id = p.id
         JOIN smelting_line_item sli ON s.id = sli.smelting_id
         JOIN item ri ON sli.raw_input_item_id = ri.id
         JOIN item oi ON sli.output_item_id = oi.id
         WHERE s.furnace_location_xyz ILIKE $1
         ORDER BY s.smelt_date DESC`,
        [`%${location}%`]
    );
    return rows;
}

// Report 2 by Xander: List fuel consumption history for Player Name: ___ (Proposal)
export async function getPlayerFuelHistory({ playerName = "" }) {
    const { rows } = await pool.query(
        `SELECT s.smelt_date AS "Date", 
                s.furnace_location_xyz AS "Location",
                fi.item_name AS "Fuel_Type", 
                sli.fuel_consumed AS "Fuel_Consumed",
                oi.item_name AS "Output_Generated", 
                sli.output_quantity AS "Qty_Generated"
         FROM smelting s
         JOIN player p ON s.player_id = p.id
         JOIN smelting_line_item sli ON s.id = sli.smelting_id
         JOIN item fi ON sli.fuel_item_id = fi.id
         JOIN item oi ON sli.output_item_id = oi.id
         WHERE p.username ILIKE $1
         ORDER BY s.smelt_date DESC`,
        [`%${playerName}%`]
    );
    return rows;
}

// Report Analysis: Show Total Output Items produced grouped by Fuel Type Used (Coal vs Wood) from Date: ___ to ___. (Proposal)
export async function getFuelAnalysis({ fromDate, toDate }) {
    const from = fromDate || '2000-01-01';
    const to = toDate || '2100-12-31';

    const { rows } = await pool.query(
        `SELECT fi.item_name AS "Fuel_Type",
                SUM(sli.fuel_consumed) AS "Total_Fuel_Consumed",
                SUM(sli.output_quantity) AS "Total_Output_Produced"
         FROM smelting s
         JOIN smelting_line_item sli ON s.id = sli.smelting_id
         JOIN item fi ON sli.fuel_item_id = fi.id
         WHERE s.smelt_date >= $1 AND s.smelt_date <= $2
         GROUP BY fi.item_name
         ORDER BY "Total_Output_Produced" DESC`,
        [from, to]
    );
    return rows;
}

// Report by Iris: List all blocks mined inside Biome Name: ___.
export async function getBiomeMiningHistory({ biomeName = "" }) {
    const { rows } = await pool.query(
        `SELECT 
          m.id AS "TRIP ID", 
          m.mining_date AS "DATE", 
          p.username AS "PLAYER", 
          m.biome_name AS "BIOME", 
          ib.item_name AS "BLOCK MINED", 
          ml.quantity_mined AS "QTY MINED", 
          COALESCE(it.item_name, 'Hands') AS "TOOL USED"
          FROM "mining" m
          JOIN "player" p ON m.player_id = p.id
          JOIN "mining_line_item" ml ON m.id = ml.mining_id
          JOIN "item" ib ON ml.block_mined_id = ib.id
          LEFT JOIN "item" it ON ml.tool_used_id = it.id
          WHERE m.biome_name ILIKE $1
          ORDER BY m.mining_date DESC`,
        [`%${biomeName}%`]
    );
    return rows;
}

// Report by Iris: List tools that reached "Broken" status on Date: ___.
export async function getBrokenTools({ Date }) {
    const from = Date || '2000-01-01';

    const { rows } = await pool.query(
        `SELECT 
         m.id AS "TRIP ID", 
         m.mining_date AS "DATE", 
         p.username AS "PLAYER", 
         ib.item_name AS "BLOCK MINED", 
         COALESCE(it.item_name, 'Hands') AS "TOOL USED", 
         ml.durability_lost AS "DUR LOST", 
         ml.quantity_mined AS "QTY MINED", 
         ml.tool_status AS "STATUS"
         FROM mining m
         JOIN player p ON m.player_id = p.id
         JOIN mining_line_item ml ON m.id = ml.mining_id
         JOIN item ib ON ml.block_mined_id = ib.id
         LEFT JOIN item it ON ml.tool_used_id = it.id
         WHERE m.mining_date = $1 AND ml.tool_status = 'Broken'
         ORDER BY m.id DESC`,
        [from]
    );
    return rows;
}
// Report Analysis Iris: Show total blocks mined grouped by tool material(wood/iron/diamond) for Date: __ to ___.
export async function getTotalBlocksMined({ fromDate, toDate }) {
    const from = fromDate || '2000-01-01';
    const to = toDate || '2100-12-31';

    const { rows } = await pool.query(
        `SELECT 
         COALESCE(it.item_name, 'Hands') AS "TOOL (MATERIAL)", 
         COUNT(DISTINCT m.id) AS "TRIPS", 
         SUM(ml.quantity_mined) AS "TOTAL MINED", 
         SUM(ml.durability_lost) AS "DUR LOST", 
         COUNT(DISTINCT ml.block_mined_id) AS "BLOCKS MINED TYPES", 
         MAX(ml.tool_status) AS "TOOL STATUS"
        FROM mining m
        JOIN mining_line_item ml ON m.id = ml.mining_id
        LEFT JOIN item it ON ml.tool_used_id = it.id
        WHERE m.mining_date >= $1 AND m.mining_date <= $2
        GROUP BY it.item_name
        ORDER BY "TOTAL MINED" DESC`,
        [from, to]
    );
    return rows;
}

// (GUIDE) #3.3 ADD YOUR REPORTS HERE