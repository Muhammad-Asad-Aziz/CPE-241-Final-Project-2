import { Router } from "express";
import * as c from "../controllers/enchantments.controller.js";

const r = Router();

r.get("/", c.listEnchantments);
r.post("/", c.createEnchantment);
r.get("/:code", c.getEnchantment);
r.put("/:code", c.updateEnchantment);
r.delete("/:code", c.deleteEnchantment);

export default r;