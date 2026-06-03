import { Router } from "express";
import * as c from "../controllers/tradings.controller.js";

const r = Router();

r.get("/", c.listTradings);
r.get("/:id", c.getTrading);
r.post("/", c.createTrading);
r.put("/:id", c.updateTrading);
r.delete("/:id", c.deleteTrading);

export default r;
