\set ON_ERROR_STOP on

-- Seed-only setup for CraftLess
-- Safe to rerun: inserts use ON CONFLICT DO NOTHING so partial seed repairs do not wipe user data.

-- ==========================================

-- Remove id and created_at column
-- Populating table: item
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Oak Log', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Oak Planks', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Stick', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Iron Ore', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Iron Ingot', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Coal', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Diamond', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Iron Pickaxe', 1, 'Tool', 250) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Diamond Sword', 1, 'Tool', 1561) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Emerald', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Rotten Flesh', 64, 'Food', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Cobblestone', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Stone', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Gold Ore', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Gold Ingot', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Bread', 64, 'Food', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Wheat', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Sand', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Glass', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Iron Axe', 1, 'Tool', 250) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Torch', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Crafting Table', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Furnace Block', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_name, max_stack_size, item_type, max_durability) VALUES ('Diamond Pickaxe', 1, 'Tool', 1561) ON CONFLICT DO NOTHING;

-- Populating table: recipe
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (2, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (3, 2, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (16, 17, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (8, 5, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (8, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (9, 7, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (9, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (20, 5, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (20, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (21, 6, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (21, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (24, 7, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (24, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (22, 2, 4) ON CONFLICT DO NOTHING;
INSERT INTO recipe (target_item_id, ingredient_item_id, amount_needed) VALUES (23, 12, 8) ON CONFLICT DO NOTHING;

-- Populating table: enchantment
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Unbreaking', 3) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Sharpness', 5) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Fortune', 3) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Efficiency', 5) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Protection', 4) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Silk Touch', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Mending', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Fire Aspect', 2) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Looting', 3) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Knockback', 2) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Power', 5) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Punch', 2) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Flame', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Infinity', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_name, max_level) VALUES ('Thorns', 3) ON CONFLICT DO NOTHING;

-- Populating table: player
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Steve', 30, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Alex', 15, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Herobrine', 99, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Notch', 50, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Jeb_', 40, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Dream', 25, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Technoblade', 80, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('DanTDM', 12, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('CaptainSparklez', 45, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Stampy', 22, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('MumboJumbo', 60, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Grian', 18, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('TommyInnit', 5, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('WilburSoot', 14, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (username, current_xp_level, health_points) VALUES ('Philza', 65, 20) ON CONFLICT DO NOTHING;

-- Populating table: chest
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (100, 64, 250, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (101, 64, 250, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (102, 64, 250, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (15, 40, -50, 'Nether') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (16, 40, -50, 'Nether') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (200, 70, 300, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (-500, 64, -500, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (0, 120, 0, 'The End') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (10, 30, 10, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (11, 30, 10, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (-100, 64, 800, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (50, 50, 50, 'Nether') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (20, 64, 20, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (21, 64, 20, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (x_coordinates, y_coordinates, z_coordinates, dimension) VALUES (22, 64, 20, 'Overworld') ON CONFLICT DO NOTHING;

-- Populating table: villager
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Bob', 'Cleric', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Testificate', 'Weaponsmith', 'Taiga') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Dan', 'Fletcher', 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Gary', 'Farmer', 'Savanna') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Larry', 'Librarian', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Gerry', 'Armorer', 'Snowy Tundra') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Terry', 'Toolsmith', 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Barry', 'Butcher', 'Taiga') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Mary', 'Leatherworker', 'Swamp') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Harry', 'Mason', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Jerry', 'Shepherd', 'Savanna') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Perry', 'Cartographer', 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Tom', 'Cleric', 'Snowy Tundra') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Dick', 'Farmer', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_name, profession, biome_type) VALUES ('Jane', 'Librarian', 'Taiga') ON CONFLICT DO NOTHING;

-- Muhammad Asad Aziz 67070503472
-- Populating table: transfer
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2024-05-14 20:10:00', 1, null, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2024-06-25 21:15:30', 2, 1, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2024-08-11 22:45:12', 3, null, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2024-11-06 23:20:05', 4, 3, 4) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-01-20 08:05:55', 5, null, 5) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-03-15 09:30:40', 6, 5, 6) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-06-01 10:11:11', 7, null, 7) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-07-15 11:40:20', 8, 7, 8) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-09-05 12:55:34', 9, null, 9) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-10-20 13:25:50', 10, 9, 10) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2025-12-28 14:00:15', 11, null, 11) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2026-01-15 15:18:44', 12, 11, 12) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2026-02-08 16:33:21', 13, null, 13) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2026-02-22 17:10:09', 14, 13, 14) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('2026-03-22 18:05:01', 15, null, 15) ON CONFLICT DO NOTHING;

-- (GUIDE) #1.2.1 POPULATE SIMPLE FORMS HERE


-- Line Items

-- Populating table: transfer_line_item
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (1, 1, 7, 5, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (1, 2, 5, 10, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (1, 3, 12, 64, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (2, 1, 5, 32, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (3, 1, 1, 64, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (4, 1, 2, 64, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (5, 1, 12, 64, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (6, 1, 13, 32, 4) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (7, 1, 18, 64, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (8, 1, 19, 16, 5) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (9, 1, 14, 10, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (10, 1, 15, 20, 6) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (11, 1, 4, 40, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (12, 1, 6, 64, 7) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (13, 1, 10, 15, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (14, 1, 11, 64, 8) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (15, 1, 16, 10, 1) ON CONFLICT DO NOTHING;

-- (GUIDE) #1.2.2 POPULATE LINE ITEMS HERE

-- update sequences to max id (crutial when inserting explicit IDs)
SELECT setval(pg_get_serial_sequence('item', 'id'), coalesce(max(id),0) + 1, false) FROM item;
SELECT setval(pg_get_serial_sequence('recipe', 'id'), coalesce(max(id),0) + 1, false) FROM recipe;
SELECT setval(pg_get_serial_sequence('enchantment', 'id'), coalesce(max(id),0) + 1, false) FROM enchantment;
SELECT setval(pg_get_serial_sequence('player', 'id'), coalesce(max(id),0) + 1, false) FROM player;
SELECT setval(pg_get_serial_sequence('chest', 'id'), coalesce(max(id),0) + 1, false) FROM chest;
SELECT setval(pg_get_serial_sequence('villager', 'id'), coalesce(max(id),0) + 1, false) FROM villager;
SELECT setval(pg_get_serial_sequence('transfer', 'id'), coalesce(max(id),0) + 1, false) FROM transfer;
SELECT setval(pg_get_serial_sequence('transfer_line_item', 'id'), coalesce(max(id),0) + 1, false) FROM transfer_line_item;

-- (GUIDE) #1.2.3 ADD SELECT COMMAND FOR YOUR SIMPLE FORM AND LINE ITEM HERE (just copy and rename)
-- SELECT setval(pg_get_serial_sequence('TABLE_NAME', 'id'), coalesce(max(id),0) + 1, false) FROM TABLE_NAME;
