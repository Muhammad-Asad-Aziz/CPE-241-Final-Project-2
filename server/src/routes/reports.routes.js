import { Router } from "express";
import * as c from "../controllers/reports.controller.js";

const r = Router();

r.get("/chest-inventory", c.getChestInventory);
r.get("/daily-transfers", c.getDailyTransfers);
r.get("/chest-utilization", c.getChestUtilization);
// (GUIDE) #3.5 ADD YOUR REPORTS HERE

export default r;