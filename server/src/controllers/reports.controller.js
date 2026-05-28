import * as reportsService from "../services/reports.service.js";

export async function getChestInventory(req, res) {
  try {
    const result = await reportsService.getChestInventory(req.query);
    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getDailyTransfers(req, res) {
  try {
    const result = await reportsService.getDailyTransfers(req.query);
    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getChestUtilization(req, res) {
  try {
    const result = await reportsService.getChestUtilization();
    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function getPlayerCraftingHistory(req, res) {
    try {
        const data = await reportsService.getPlayerCraftingHistory(req.query);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getRecipeRequirements(req, res) {
    try {
        const data = await reportsService.getRecipeRequirements(req.query);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getTopCraftedItems(req, res) {
    try {
        const data = await reportsService.getTopCraftedItems(req.query);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// (GUIDE) #3.4 ADD YOUR REPORTS HERE