import * as itemsService from "../services/items.service.js";

export async function listItems(req, res) {
  try {
    const result = await itemsService.listItems(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getItem(req, res) {
  try {
    const item = await itemsService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: { message: "Item not found" } });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createItem(req, res) {
  try {
    const result = await itemsService.createItem(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function updateItem(req, res) {
  try {
    const result = await itemsService.updateItem(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Item not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteItem(req, res) {
  try {
    const force = req.query.force === "true";
    const result = await itemsService.deleteItem(req.params.id, { force });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
  }
}