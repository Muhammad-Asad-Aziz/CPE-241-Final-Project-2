import { Router } from "express";
import * as c from "../controllers/items.controller.js";

const r = Router();

r.get("/", c.listItems);
r.post("/", c.createItem);
r.get("/:id", c.getItem);
r.put("/:id", c.updateItem);
r.delete("/:id", c.deleteItem);

export default r;