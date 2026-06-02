import * as villagersService from "../services/villagers.service.js";

export async function listVillagers(req, res) {
  try {
    const result = await villagersService.listVillagers(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getVillager(req, res) {
  try {
    const villager = await villagersService.getVillagerById(req.params.id);
    if (!villager) return res.status(404).json({ success: false, error: { message: "Villager not found" } });
    res.json({ success: true, data: villager });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createVillager(req, res) {
  try {
    const result = await villagersService.createVillager(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function updateVillager(req, res) {
  try {
    const result = await villagersService.updateVillager(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Villager not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function deleteVillager(req, res) {
  try {
    await villagersService.deleteVillager(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}