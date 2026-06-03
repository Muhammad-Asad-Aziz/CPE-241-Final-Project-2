import { Router } from "express";
import * as c from "../controllers/villagers.controller.js";

const r = Router();

r.get("/", c.listVillagers);
r.post("/", c.createVillager);
r.get("/:code", c.getVillager);
r.put("/:code", c.updateVillager);
r.delete("/:code", c.deleteVillager);

export default r;