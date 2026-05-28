import { Router } from "express";
import * as c from "../controllers/players.controller.js";

const r = Router();

r.get("/", c.listPlayers);
r.post("/", c.createPlayer);
r.get("/:id", c.getPlayer);
r.put("/:id", c.updatePlayer);
r.delete("/:id", c.deletePlayer);

export default r;