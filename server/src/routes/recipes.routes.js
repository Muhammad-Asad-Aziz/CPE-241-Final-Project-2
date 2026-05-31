import { Router } from "express";
import * as c from "../controllers/recipes.controller.js";

const r = Router();

r.get("/", c.listRecipes);
r.post("/", c.createRecipe);
r.get("/:code", c.getRecipe);
r.put(":code", c.updateRecipe);
r.delete("/:code", c.deleteRecipe);

export default r;