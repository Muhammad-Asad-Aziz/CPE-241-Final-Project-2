import { Router } from "express";
import * as c from "../controllers/players.controller.js";

const r = Router();

r.get("/", c.listPlayers);
r.post("/", c.createPlayer);
r.get("/:code", c.getPlayer);
r.put("/:code", c.updatePlayer);
r.delete("/:code", c.deletePlayer);

export default r;