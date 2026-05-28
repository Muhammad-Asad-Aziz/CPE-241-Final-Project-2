import * as recipesService from "../services/recipes.service.js";

export async function listRecipes(req, res) {
  try {
    const result = await recipesService.listRecipes(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getRecipe(req, res) {
  try {
    const recipe = await recipesService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, error: { message: "Recipe not found" } });
    res.json({ success: true, data: recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createRecipe(req, res) {
  try {
    const result = await recipesService.createRecipe(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function updateRecipe(req, res) {
  try {
    const result = await recipesService.updateRecipe(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Recipe not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteRecipe(req, res) {
  try {
    await recipesService.deleteRecipe(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}