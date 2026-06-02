import { Router } from "express";
import * as c from "../controllers/recipes.controller.js";

const r = Router();

r.get("/", c.listRecipes);
r.post("/", c.createRecipe);
r.get("/:id", c.getRecipe);
r.put("/:id", c.updateRecipe);
r.delete("/:id", c.deleteRecipe);

export default r;