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

-- Supanut Sopha 67070503441
-- Populating crafting table
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 18:05:01', 1, 1, null, 1) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 18:15:01', 2, 2, null, 2) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 18:25:01', 3, 3, null, 3) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 18:35:01', 4, 4, null, 4) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 18:45:01', 5, 5, null, 5) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 18:55:01', 6, 6, null, 6) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 19:05:01', 7, 7, null, 7) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 19:15:01', 8, 8, null, 8) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 19:25:01', 9, 9, null, 9) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 19:35:01', 10, 10, null, 10) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 19:45:01', 11, 11, null, 11) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 19:55:01', 12, 12, null, 12) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 20:05:01', 13, 13, null, 13) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 20:15:01', 14, 14, null, 14) ON CONFLICT DO NOTHING;
INSERT INTO crafting (crafting_date, session_id, player_id, target_item_id, qty_wanted) VALUES ('2026-03-22 20:25:01', 15, 15, null, 15) ON CONFLICT DO NOTHING;

--Al Xander James Ybanez 67070503450
-- Populating smelting table
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (1, '2024-05-14 09:10:00', 1, '100,64,250');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (2, '2024-06-25 10:15:30', 2, '100,64,251');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (3, '2024-08-11 08:45:12', 3, '100,64,252');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (4, '2024-11-06 14:20:05', 4, '15,40,-50');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (5, '2025-01-20 18:05:55', 5, '16,40,-50');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (6, '2025-03-15 22:30:40', 6, '200,70,300');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (7, '2025-06-01 07:11:11', 7, '-500,64,-500');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (8, '2025-07-15 13:40:20', 8, '0,120,0');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (9, '2025-09-05 16:55:34', 9, '10,30,10');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (10, '2025-10-20 11:25:50', 10, '11,30,10');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (11, '2025-12-28 09:00:15', 11, '-100,64,800');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (12, '2026-01-15 20:18:44', 12, '50,50,50');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (13, '2026-02-08 17:33:21', 13, '20,64,20');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (14, '2026-02-22 14:10:09', 14, '21,64,20');
INSERT INTO smelting (id, smelt_date, player_id, furnace_location_xyz) OVERRIDING SYSTEM VALUE VALUES (15, '2026-03-22 08:05:01', 15, '22,64,20');

<<<<<<< HEAD
=======
--Iris French 67070503478
--Populating table: mining
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2024-05-12 14:20:00', 1, 'Extreme Hills') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2024-06-20 08:15:30', 2, 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2024-08-08 11:45:12', 3, 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2024-11-01 16:20:05', 4, 'Savanna') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-01-15 09:05:55', 5, 'Taiga') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-03-10 13:30:40', 6, 'Snowy Tundra') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-05-25 18:11:11', 7, 'Swamp') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-07-10 07:40:20', 8, 'Badlands') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-08-28 22:55:34', 9, 'Jungle') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-10-18 10:25:50', 10, 'Forest') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2025-12-20 15:00:15', 11, 'Ocean') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2026-01-12 08:18:44', 12, 'Nether Wastes') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2026-02-05 19:33:21', 13, 'Basalt Deltas') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2026-02-20 12:10:09', 14, 'Crimson Forest') ON CONFLICT DO NOTHING;
INSERT INTO mining (mining_date, player_id, biome_name) VALUES ('2026-03-21 16:05:01', 15, 'Warped Forest') ON CONFLICT DO NOTHING;

>>>>>>> origin/main
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

-- Populating table: crafting_line_item
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (1, 1, 1, 12, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (2, 1, 2, 5, 1, 4) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (3, 1, 3, 8, 6, 1) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (4, 1, 4, 15, 2, 5) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (5, 1, 5, 2, 7, 3) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (6, 1, 6, 11, 4, 2) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (7, 1, 7, 3, 5, 1) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (8, 1, 8, 16, 2, 4) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (9, 1, 9, 7, 1, 3) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (10, 1, 10, 14, 6, 5) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (11, 1, 11, 9, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (12, 1, 12, 4, 7, 1) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (13, 1, 13, 1, 5, 4) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (14, 1, 14, 10, 2, 3) ON CONFLICT DO NOTHING;
INSERT INTO crafting_line_item (crafting_id, crafting_line_number, session_id, ingredient_id, required_quantity, total_needed) VALUES (15, 1, 15, 13, 4, 5) ON CONFLICT DO NOTHING;

-- Populating table: smelting_line_item
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (1, 1, 4, 16, 6, 2, 5, 16);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (2, 2, 12, 32, 6, 4, 13, 32);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (3, 3, 14, 8, 6, 1, 15, 8);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (4, 4, 18, 64, 6, 8, 19, 64);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (5, 5, 4, 24, 6, 3, 5, 24);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (6, 6, 12, 16, 6, 2, 13, 16);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (7, 7, 14, 16, 6, 2, 15, 16);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (8, 8, 18, 32, 6, 4, 19, 32);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (9, 9, 4, 40, 6, 5, 5, 40);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (10, 10, 12, 8, 6, 1, 13, 8);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (11, 11, 14, 32, 6, 4, 15, 32);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (12, 12, 18, 16, 6, 2, 19, 16);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (13, 13, 4, 8, 6, 1, 5, 8);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (14, 14, 12, 64, 6, 8, 13, 64);
INSERT INTO smelting_line_item (id, smelting_id, raw_input_item_id, quantity_inserted, fuel_item_id, fuel_consumed, output_item_id, output_quantity) OVERRIDING SYSTEM VALUE VALUES (15, 15, 14, 64, 6, 8, 15, 64);

<<<<<<< HEAD
=======
--Populating table: mining_line_item
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES (1, 4, 15, 8, 15, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 2, 1, 64, 20, 64, 'Usable')ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 3, 18, 128, NULL, 0, 'Usable') ON CONFLICT DO NOTHING; 
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 4, 6, 30, 8, 30, 'Usable') ON CONFLICT DO NOTHING;  
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 5, 12, 50, 8, 50, 'Usable') ON CONFLICT DO NOTHING;  
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 6, 14, 20, 8, 20, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 7, 12, 100, 8, 100, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 8, 4, 25, 8, 25, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 9, 1, 32, 20, 32, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 10, 6, 45, 8, 45, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 11, 18, 50, NULL, 0, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES (12, 14, 15, 8, 15, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 13, 12, 100, 24, 100, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES ( 14, 1, 12, 20, 12, 'Usable') ON CONFLICT DO NOTHING;
INSERT INTO mining_line_item (mining_id, block_mined_id, quantity_mined, tool_used_id, durability_lost, tool_status) VALUES (15, 4, 22, 8, 22, 'Usable') ON CONFLICT DO NOTHING;
>>>>>>> origin/main
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

SELECT setval(pg_get_serial_sequence('crafting', 'id'), coalesce(max(id),0) + 1, false) FROM crafting;
SELECT setval(pg_get_serial_sequence('crafting_line_item', 'id'), coalesce(max(id),0) + 1, false) FROM crafting_line_item;

SELECT setval(pg_get_serial_sequence('smelting', 'id'), coalesce(max(id),0) + 1, false) FROM smelting;
SELECT setval(pg_get_serial_sequence('smelting_line_item', 'id'), coalesce(max(id),0) + 1, false) FROM smelting_line_item;

<<<<<<< HEAD
-- (GUIDE) #1.2.3 ADD SELECT COMMAND FOR YOUR SIMPLE FORM AND LINE ITEM HERE (just copy and rename)
-- SELECT setval(pg_get_serial_sequence('TABLE_NAME', 'id'), coalesce(max(id),0) + 1, false) FROM TABLE_NAME;

-- Populating table: trading_session (Punyawat)
-- villager id: 1=Bob(Cleric), 2=Testificate(Weaponsmith), 3=Dan(Fletcher), 4=Gary(Farmer), 5=Larry(Librarian), 6=Gerry(Armorer)
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-05 10:00:00', 'Steve', 1) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-06 11:00:00', 'Alex', 2) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-07 09:30:00', 'Herobrine', 1) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-08 14:00:00', 'Steve', 3) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-09 15:30:00', 'Notch', 2) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-10 08:00:00', 'Dream', 4) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-11 13:00:00', 'Alex', 1) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-12 10:30:00', 'Steve', 5) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-13 11:30:00', 'Technoblade', 2) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-14 16:00:00', 'Herobrine', 3) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-15 09:00:00', 'Notch', 1) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-16 12:00:00', 'Dream', 6) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-17 14:30:00', 'MumboJumbo', 4) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-18 10:00:00', 'Steve', 1) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-19 11:00:00', 'Alex', 5) ON CONFLICT DO NOTHING;
INSERT INTO trading_session (trade_date, player_name, villager_id) VALUES ('2024-01-20 15:00:00', 'Stampy', 6) ON CONFLICT DO NOTHING;

-- Populating table: trading_line_item (Punyawat)
-- item: 11=Rotten Flesh, 10=Emerald, 17=Wheat, 15=Gold Ingot, 7=Diamond, 12=Cobblestone, 3=Stick, 5=Iron Ingot
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (1, 1, 11, 32, 10, 1, 8);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (1, 2, 12, 20, 10, 2, 5);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (2, 1, 5,  4,  9,  1, 10);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (2, 2, 3,  10, 10, 3, 0);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (3, 1, 11, 16, 10, 1, 3);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (4, 1, 17, 20, 10, 2, 7);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (5, 1, 15, 3,  10, 5, 0);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (6, 1, 11, 32, 10, 1, 6);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (7, 1, 12, 15, 10, 1, 9);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (8, 1, 5,  6,  9,  1, 0);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (9, 1, 11, 32, 10, 1, 4);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (10, 1, 17, 30, 10, 3, 2);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (11, 1, 15, 5,  10, 8, 0);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (12, 1, 11, 32, 10, 1, 7);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (13, 1, 3,  8,  10, 2, 5);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (14, 1, 12, 25, 10, 2, 0);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (15, 1, 17, 15, 10, 1, 8);
INSERT INTO trading_line_item (trading_session_id, line_number, item_given_id, quantity_given, item_received_id, quantity_received, trade_uses_remaining) VALUES (16, 1, 11, 32, 10, 1, 3);
=======
SELECT setval(pg_get_serial_sequence('mining', 'id'), coalesce(max(id),0) + 1, false) FROM mining;
SELECT setval(pg_get_serial_sequence('mining_line_item', 'id'), coalesce(max(id),0) + 1, false) FROM mining_line_item;

-- (GUIDE) #1.2.3 ADD SELECT COMMAND FOR YOUR SIMPLE FORM AND LINE ITEM HERE (just copy and rename)
-- SELECT setval(pg_get_serial_sequence('TABLE_NAME', 'id'), coalesce(max(id),0) + 1, false) FROM TABLE_NAME;
>>>>>>> origin/main
