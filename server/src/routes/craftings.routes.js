import { Router } from "express";
import * as c from "../controllers/craftings.controller.js";

const r = Router();

r.get("/", c.listCraftings);
r.get("/:id", c.getCrafting);
r.post("/", c.createCrafting);
r.put("/:id", c.updateCrafting);
r.delete("/:id", c.deleteCrafting);

export default r;