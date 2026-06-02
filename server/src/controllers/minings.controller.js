import * as miningsService from "../services/minings.service.js";

export async function listMinings(req, res) {
  try {
    const result = await miningsService.listMinings(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getMining(req, res) {
  try {
    const mining = await miningsService.getMining(req.params.id);
    if (!mining) return res.status(404).json({ success: false, error: { message: "Mining trip not found" } });
    res.json({ success: true, data: mining });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createMining(req, res) {
  try {
    const result = await miningsService.createMining(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function updateMining(req, res) {
  try {
    const result = await miningsService.updateMining(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Mining trip not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteMining(req, res) {
  try {
    const result = await miningsService.deleteMining(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: { message: "Mining trip not found" } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}