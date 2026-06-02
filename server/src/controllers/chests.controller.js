import * as chestsService from "../services/chests.service.js";

export async function listChests(req, res) {
  try {
    const result = await chestsService.listChests(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getChest(req, res) {
  try {
    const chest = await chestsService.getChest(req.params.id);
    if (!chest) return res.status(404).json({ success: false, error: { message: "Chest not found" } });
    res.json({ success: true, data: chest });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createChest(req, res) {
  try {
    const result = await chestsService.createChest(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function updateChest(req, res) {
  try {
    const result = await chestsService.updateChest(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Chest not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteChest(req, res) {
  try {
    await chestsService.deleteChest(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
  }
}