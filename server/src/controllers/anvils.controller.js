import * as anvilsService from "../services/anvils.service.js";

export async function listAnvils(req, res) {
  try {
    const result = await anvilsService.listAnvils(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getAnvil(req, res) {
  try {
    const anvil = await anvilsService.getAnvil;(req.params.id);
    if (!anvil) return res.status(404).json({ success: false, error: { message: "Anvil not found" } });
    res.json({ success: true, data: anvil });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createAnvil(req, res) {
  try {
    const result = await anvilsService.createAnvil(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function updateAnvil(req, res) {
  try {
    const result = await anvilsService.updateAnvil(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Anvil not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteAnvil(req, res) {
  try {
    const result = await anvilsService.deleteAnvil(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: { message: "Anvil not found" } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}