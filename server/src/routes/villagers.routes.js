import { Router } from "express";
import * as c from "../controllers/villagers.controller.js";

const r = Router();

r.get("/", c.listVillagers);
r.post("/", c.createVillager);
r.get("/:id", c.getVillager);
r.put("/:id", c.updateVillager);
r.delete("/:id", c.deleteVillager);

export default r;