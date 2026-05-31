import * as enchantmentsService from "../services/enchantments.service.js";

export async function listEnchantments(req, res) {
  try {
    const result = await enchantmentsService.listEnchantments(req.query);
    res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
  } catch (err) { res.status(500).json({ success: false, error: { message: err.message } }); }
}

export async function getEnchantment(req, res) {
  try {
    const enchantment = await enchantmentsService.getEnchantment(req.params.code);
    if (!enchantment) return res.status(404).json({ success: false, error: { message: "Enchantment not found" } });
    res.json({ success: true, data: enchantment });
  } catch (err) { res.status(500).json({ success: false, error: { message: err.message } }); }
}

export async function createEnchantment(req, res) {
  try {
    const result = await enchantmentsService.createEnchantment(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, error: { message: err.message } }); }
}

export async function updateEnchantment(req, res) {
  try {
    const result = await enchantmentsService.updateEnchantment(req.params.code, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Enchantment not found" } });
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, error: { message: err.message } }); }
}

export async function deleteEnchantment(req, res) {
  try {
    const result = await enchantmentsService.deleteEnchantment(req.params.code);
    if (!result) return res.status(404).json({ success: false, error: { message: "Enchantment not found" } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, error: { message: err.message } }); }
}