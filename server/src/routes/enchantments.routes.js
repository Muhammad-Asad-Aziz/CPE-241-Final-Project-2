import { Router } from "express";
import * as c from "../controllers/enchantments.controller.js";

const r = Router();

r.get("/", c.listEnchantments);
r.post("/", c.createEnchantment);
r.get("/:id", c.getEnchantment);
r.put("/:id", c.updateEnchantment);
r.delete("/:id", c.deleteEnchantment);

export default r;