import { Router } from "express";
import * as c from "../controllers/chests.controller.js";

const r = Router();

r.get("/", c.listChests);
r.post("/", c.createChest);
r.get("/:code", c.getChest);
r.put("/:code", c.updateChest);
r.delete("/:code", c.deleteChest);

export default r;