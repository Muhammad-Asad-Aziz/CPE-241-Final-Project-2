import { Router } from "express";
import * as c from "../controllers/items.controller.js";

const r = Router();

r.get("/", c.listItems);
r.post("/", c.createItem);
r.get("/:code", c.getItem);
r.put("/:code", c.updateItem);
r.delete(":code", c.deleteItem);

export default r;