import { Router } from "express";
import * as c from "../controllers/smeltings.controller.js";

const r = Router();

r.get("/", c.listSmeltings);
r.get("/:code", c.getSmelting);
r.post("/", c.createSmelting);
r.put("/:code", c.updateSmelting);
r.delete("/:code", c.deleteSmelting);

export default r;