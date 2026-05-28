import { pool } from "../db/pool.js";

// Report by Muhammad Asad Aziz Simple 1: List all items currently stored inside a specific Chest ID
export async function getChestInventory({ chest_id }) {
  // If chest_id is empty/undefined, set it to null so SQL understands it
  const chestParam = chest_id ? Number(chest_id) : null;

  const { rows } = await pool.query(
    `
      WITH items_in AS (
        SELECT t.destination_chest_id as chest_id, li.item_id, SUM(li.quantity_transferred) as qty
        FROM transfer_line_item li
        JOIN "transfer" t ON t.id = li.transfer_id
        WHERE t.destination_chest_id IS NOT NULL
        GROUP BY t.destination_chest_id, li.item_id
      ),
      items_out AS (
        SELECT t.source_chest_id as chest_id, li.item_id, SUM(li.quantity_transferred) as qty
        FROM transfer_line_item li
        JOIN "transfer" t ON t.id = li.transfer_id
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
        ci.chest_id, 
        c.dimension,
        i.id as item_id, 
        i.item_name, 
        i.item_type,
        ci.current_quantity
      FROM chest_inventory ci
      JOIN item i ON i.id = ci.item_id
      JOIN chest c ON c.id = ci.chest_id
      WHERE ci.current_quantity > 0
        AND ($1::bigint IS NULL OR ci.chest_id = $1::bigint)
      ORDER BY ci.chest_id ASC, ci.current_quantity DESC
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
          t.id AS transfer_id, 
          t.transfer_date, 
          p.username AS player_username, 
          i.item_name AS item_moved, 
          COALESCE(CAST(t.source_chest_id AS TEXT), 'Player Inventory') AS src_chest,
          COALESCE(CAST(t.destination_chest_id AS TEXT), 'Player Inventory') AS dst_chest,
          li.quantity_transferred
      FROM "transfer" t
      JOIN player p ON t.player_id = p.id
      JOIN transfer_line_item li ON t.id = li.transfer_id
      JOIN item i ON li.item_id = i.id
      WHERE ($1::date IS NULL OR DATE(t.transfer_date) >= $1::date)
        AND ($2::date IS NULL OR DATE(t.transfer_date) <= $2::date)
      ORDER BY t.transfer_date DESC, t.id ASC
    `,
    [dFrom, dTo]
  );
  return { data: rows };
}

// Report by Muhammad Asad Aziz Analysis: Show Chest Capacity Utilization (%) grouped by Chest Dimension
export async function getChestUtilization() {
  const { rows } = await pool.query(
    `
      WITH chest_usage AS (
          SELECT c.dimension, c.id, COUNT(DISTINCT li.destination_slot_number) as used_slots
          FROM chest c
          LEFT JOIN "transfer" t ON t.destination_chest_id = c.id
          LEFT JOIN transfer_line_item li ON li.transfer_id = t.id
          GROUP BY c.dimension, c.id
      )
      SELECT dimension,
             COUNT(id) as total_chests,
             SUM(used_slots) as total_used_slots,
             (COUNT(id) * 27) as total_capacity,
             COALESCE(ROUND((SUM(used_slots)::numeric / NULLIF(COUNT(id) * 27, 0)) * 100, 2), 0) as utilization_percent
      FROM chest_usage
      GROUP BY dimension
      ORDER BY utilization_percent DESC
    `
  );
  return { data: rows };
}

// (GUIDE) #3.3 ADD YOUR REPORTS HERE