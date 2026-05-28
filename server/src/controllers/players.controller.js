import * as playersService from "../services/players.service.js";

export async function listPlayers(req, res) {
  try {
    const result = await playersService.listPlayers(req.query);
    res.json({
      success: true,
      data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}

export async function createPlayer(req, res) {
  try {
    const result = await playersService.createPlayer(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function updatePlayer(req, res) {
  try {
    const result = await playersService.updatePlayer(req.params.id, req.body);
    if (!result) return res.status(404).json({ success: false, error: { message: "Player not found" } });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
}

export async function deletePlayer(req, res) {
  try {
    const force = req.query.force === "true";
    const result = await playersService.deletePlayer(req.params.id, { force });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: { message: err.message } });
  }
}

export async function getPlayer(req, res) {
  try {
    const player = await playersService.getPlayerById(req.params.id);
    if (!player) return res.status(404).json({ success: false, error: { message: "Player not found" } });
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
}