import { Router } from "express";
import * as c from "../controllers/smeltings.controller.js";

const r = Router();

r.get("/", c.listSmeltings);
r.get("/:id", c.getSmelting);
r.post("/", c.createSmelting);
r.put("/:id", c.updateSmelting);
r.delete("/:id", c.deleteSmelting);

export default r;