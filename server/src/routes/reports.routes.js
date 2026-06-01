import { Router } from "express";
import * as c from "../controllers/reports.controller.js";

const r = Router();

r.get("/chest-inventory", c.getChestInventory);
r.get("/daily-transfers", c.getDailyTransfers);
r.get("/chest-utilization", c.getChestUtilization);

r.get("/crafting-history", c.getPlayerCraftingHistory);
r.get("/recipe-requirements", c.getRecipeRequirements);
r.get("/top-crafted", c.getTopCraftedItems);

r.get("/enchanted-tool", c.getEnchantedTool);
r.get("/anvil-history", c.getPlayerAnvilHistory);
r.get("/XP-type", c.getXPByType);
r.get("/mining-history", c.getBiomeMiningHistory);
r.get("/broken-tools", c.getBrokenTools);
r.get("/blocks-mined", c.getTotalBlocksMined);
// (GUIDE) #3.5 ADD YOUR REPORTS HERE

export default r;