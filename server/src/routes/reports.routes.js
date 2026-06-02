import { Router } from "express";
import * as c from "../controllers/reports.controller.js";

const r = Router();

r.get("/chest-inventory", c.getChestInventory);
r.get("/daily-transfers", c.getDailyTransfers);
r.get("/chest-utilization", c.getChestUtilization);

r.get("/crafting-history", c.getPlayerCraftingHistory);
r.get("/recipe-requirements", c.getRecipeRequirements);
r.get("/top-crafted", c.getTopCraftedItems);
// (GUIDE) #3.5 ADD YOUR REPORTS HERE
r.get("/trading-by-villager", c.getTradingsByVillager);
r.get("/locked-trades", c.getLockedTrades);
r.get("/trading-volume-profession", c.getTradingVolumeByProfession);

export default r;