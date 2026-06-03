import { Router } from "express";
import * as c from "../controllers/anvils.controller.js";

const r = Router();

r.get("/", c.listAnvils);
r.post("/", c.createAnvil);
r.get("/:id", c.getAnvil);
r.put("/:id", c.updateAnvil);
r.delete("/:id", c.deleteAnvil);

export default r;