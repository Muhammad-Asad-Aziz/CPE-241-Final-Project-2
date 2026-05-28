import { Router } from "express";
import * as c from "../controllers/chests.controller.js";

const r = Router();

r.get("/", c.listChests);
r.post("/", c.createChest);
r.get("/:id", c.getChest);
r.put("/:id", c.updateChest);
r.delete("/:id", c.deleteChest);

export default r;