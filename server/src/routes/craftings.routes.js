import { Router } from "express";
import * as c from "../controllers/craftings.controller.js";

const r = Router();

r.get("/", c.listCraftings);
r.get("/:code", c.getCrafting);
r.post("/", c.createCrafting);
r.put("/:code", c.updateCrafting);
r.delete("/:code", c.deleteCrafting);

export default r;