import * as transfersService from "../services/transfers.service.js";

export async function listTransfers(req, res) {
  try {
    const result = await transfersService.listTransfers(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getTransfer(req, res) {
  try {
    const transfer = await transfersService.getTransfer(req.params.id);
    if (!transfer) return res.status(404).json({ success: false, error: { message: "Transfer not found" } });
    res.json({ success: true, data: transfer });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createTransfer(req, res) {
  try {
    const result = await transfersService.createTransfer(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function updateTransfer(req, res) {
  try {
    const result = await transfersService.updateTransfer(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Transfer not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteTransfer(req, res) {
  try {
    const result = await transfersService.deleteTransfer(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: { message: "Transfer not found" } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}