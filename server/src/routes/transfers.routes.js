import { Router } from "express";
import * as c from "../controllers/transfers.controller.js";

const r = Router();

r.get("/", c.listTransfers);
r.post("/", c.createTransfer);
r.get("/:id", c.getTransfer);
r.put("/:id", c.updateTransfer);
r.delete("/:id", c.deleteTransfer);

export default r;