import { Router } from "express";
import * as c from "../controllers/minings.controller.js";

const r = Router();

r.get("/", c.listMinings);
r.post("/", c.createMining);
r.get("/:id", c.getMining);
r.put("/:id", c.updateMining);
r.delete("/:id", c.deleteMining);

export default r;