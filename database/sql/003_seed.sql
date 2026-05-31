\set ON_ERROR_STOP on

-- Seed-only setup for CraftLess
-- Safe to rerun: inserts use ON CONFLICT DO NOTHING so partial seed repairs do not wipe user data.

-- ==========================================

-- Remove id and created_at column
-- Populating table: item
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-001', 'Oak Log', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-002', 'Oak Planks', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-003', 'Stick', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-004', 'Iron Ore', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-005', 'Iron Ingot', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-006', 'Coal', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-007', 'Diamond', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-008', 'Iron Pickaxe', 1, 'Tool', 250) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-009', 'Diamond Sword', 1, 'Tool', 1561) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-010', 'Emerald', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-011', 'Rotten Flesh', 64, 'Food', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-012', 'Cobblestone', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-013', 'Stone', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-014', 'Gold Ore', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-015', 'Gold Ingot', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-016', 'Bread', 64, 'Food', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-017', 'Wheat', 64, 'Ingredient', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-018', 'Sand', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-019', 'Glass', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-020', 'Iron Axe', 1, 'Tool', 250) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-021', 'Torch', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-022', 'Crafting Table', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-023', 'Furnace Block', 64, 'Block', null) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-024', 'Diamond Pickaxe', 1, 'Tool', 1561) ON CONFLICT DO NOTHING;
INSERT INTO item (item_code, item_name, max_stack_size, item_type, max_durability) VALUES ('ITM-025', 'Ender Pearl', 16, 'Ingredient', null) ON CONFLICT DO NOTHING;

-- Populating table: recipe
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-001', 2, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-002', 3, 2, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-003', 16, 17, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-004', 8, 5, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-005', 8, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-006', 9, 7, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-007', 9, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-008', 20, 5, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-009', 20, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-010', 21, 6, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-011', 21, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-012', 24, 7, 3) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-013', 24, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-014', 22, 2, 4) ON CONFLICT DO NOTHING;
INSERT INTO recipe (recipe_code, target_item_id, ingredient_item_id, amount_needed) VALUES ('RCP-015', 23, 12, 8) ON CONFLICT DO NOTHING;

-- Populating table: enchantment
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-001', 'Unbreaking', 3) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-002', 'Sharpness', 5) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-003', 'Fortune', 3) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-004', 'Efficiency', 5) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-005', 'Protection', 4) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-006', 'Silk Touch', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-007', 'Mending', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-008', 'Fire Aspect', 2) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-009', 'Looting', 3) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-010', 'Knockback', 2) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-011', 'Power', 5) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-012', 'Punch', 2) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-013', 'Flame', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-014', 'Infinity', 1) ON CONFLICT DO NOTHING;
INSERT INTO enchantment (enchantment_code, enchantment_name, max_level) VALUES ('ENC-015', 'Thorns', 3) ON CONFLICT DO NOTHING;

-- Populating table: player
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-001', 'Steve', 30, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-002', 'Alex', 15, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-003', 'Herobrine', 99, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-004', 'Notch', 50, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-005', 'Jeb_', 40, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-006', 'Dream', 25, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-007', 'Technoblade', 80, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-008', 'DanTDM', 12, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-009', 'CaptainSparklez', 45, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-010', 'Stampy', 22, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-011', 'MumboJumbo', 60, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-012', 'Grian', 18, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-013', 'TommyInnit', 5, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-014', 'WilburSoot', 14, 20) ON CONFLICT DO NOTHING;
INSERT INTO player (player_code, username, current_xp_level, health_points) VALUES ('PLR-015', 'Philza', 65, 20) ON CONFLICT DO NOTHING;

-- Populating table: chest
INSERT INTO chest (chest_code, x_coordinates, y_coordinates, z_coordinates, dimension) VALUES ('CST-001', 100, 64, 250, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (chest_code, x_coordinates, y_coordinates, z_coordinates, dimension) VALUES ('CST-002', -500, 64, -500, 'Overworld') ON CONFLICT DO NOTHING;
INSERT INTO chest (chest_code, x_coordinates, y_coordinates, z_coordinates, dimension) VALUES ('CST-003', 15, 40, -50, 'Nether') ON CONFLICT DO NOTHING;
INSERT INTO chest (chest_code, x_coordinates, y_coordinates, z_coordinates, dimension) VALUES ('CST-004', 50, 50, 50, 'Nether') ON CONFLICT DO NOTHING;
INSERT INTO chest (chest_code, x_coordinates, y_coordinates, z_coordinates, dimension) VALUES ('CST-005', 0, 120, 0, 'The End') ON CONFLICT DO NOTHING;

-- Populating table: villager
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-001', 'Bob', 'Cleric', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-002', 'Testificate', 'Weaponsmith', 'Taiga') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-003', 'Dan', 'Fletcher', 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-004', 'Gary', 'Farmer', 'Savanna') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-005', 'Larry', 'Librarian', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-006', 'Gerry', 'Armorer', 'Snowy Tundra') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-007', 'Terry', 'Toolsmith', 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-008', 'Barry', 'Butcher', 'Taiga') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-009', 'Mary', 'Leatherworker', 'Swamp') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-010', 'Harry', 'Mason', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-011', 'Jerry', 'Shepherd', 'Savanna') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-012', 'Perry', 'Cartographer', 'Desert') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-013', 'Tom', 'Cleric', 'Snowy Tundra') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-014', 'Dick', 'Farmer', 'Plains') ON CONFLICT DO NOTHING;
INSERT INTO villager (villager_code, villager_name, profession, biome_type) VALUES ('VIL-015', 'Jane', 'Librarian', 'Taiga') ON CONFLICT DO NOTHING;

-- Muhammad Asad Aziz 67070503472
-- Populating table: transfer
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0001', '2024-05-14 20:10:00', 1, null, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0002', '2024-06-25 21:15:30', 2, 1, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0003', '2024-08-11 22:45:12', 3, null, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0004', '2024-11-06 23:20:05', 4, 3, 4) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0005', '2025-01-20 08:05:55', 5, null, 5) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0006', '2025-03-15 09:30:40', 6, 5, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0007', '2025-06-01 10:11:11', 7, null, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0008', '2025-07-15 11:40:20', 8, 2, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0009', '2025-09-05 12:55:34', 9, null, 4) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0010', '2025-10-20 13:25:50', 10, 4, 5) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0011', '2025-12-28 14:00:15', 11, null, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0012', '2026-01-15 15:18:44', 12, 1, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0013', '2026-02-08 16:33:21', 13, null, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0014', '2026-02-22 17:10:09', 14, 3, 4) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0015', '2026-03-22 18:05:01', 15, null, 5) ON CONFLICT DO NOTHING;
INSERT INTO transfer (transfer_code, transfer_date, player_id, source_chest_id, destination_chest_id) VALUES ('TRN-0016', '2026-05-20 12:00:00', 6, null, 3) ON CONFLICT DO NOTHING;

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
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 1, 25, 16, 1) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 2, 25, 16, 2) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 3, 25, 16, 3) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 4, 25, 16, 4) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 5, 25, 16, 5) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 6, 25, 16, 6) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 7, 25, 16, 7) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 8, 25, 16, 8) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 9, 25, 16, 9) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 10, 25, 16, 10) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 11, 25, 16, 11) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 12, 25, 16, 12) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 13, 25, 16, 13) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 14, 25, 16, 14) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 15, 25, 16, 15) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 16, 25, 16, 16) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 17, 25, 16, 17) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 18, 25, 16, 18) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 19, 25, 16, 19) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 20, 25, 16, 20) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 21, 25, 16, 21) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 22, 25, 16, 22) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 23, 25, 16, 23) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 24, 25, 16, 24) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 25, 25, 16, 25) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 26, 25, 16, 26) ON CONFLICT DO NOTHING;
INSERT INTO transfer_line_item (transfer_id, transfer_line_number, item_id, quantity_transferred, destination_slot_number) VALUES (16, 27, 25, 16, 27) ON CONFLICT DO NOTHING;

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

-- (GUIDE) #1.2.3 ADD SELECT COMMAND FOR YOUR SIMPLE FORM AND LINE ITEM HERE (just copy and rename)
-- SELECT setval(pg_get_serial_sequence('TABLE_NAME', 'id'), coalesce(max(id),0) + 1, false) FROM TABLE_NAME;
