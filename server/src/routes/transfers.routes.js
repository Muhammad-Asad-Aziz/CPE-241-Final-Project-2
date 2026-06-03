import { Router } from "express";
import * as c from "../controllers/transfers.controller.js";

const r = Router();

r.get("/", c.listTransfers);
r.post("/", c.createTransfer);
r.get("/:code", c.getTransfer);
r.put("/:code", c.updateTransfer);
r.delete("/:code", c.deleteTransfer);

export default r;