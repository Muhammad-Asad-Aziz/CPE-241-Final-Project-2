import * as craftingsService from "../services/craftings.service.js";

import { sendList, sendOne, sendCreated, sendError, sendOk } from "../utils/response.js";

export async function listCraftings(req, res) {
    try {
        const result = await craftingsService.listCraftings(req.query);
        
        res.json({
            success: true,
            data: result.data,
            meta: {
                total: result.total,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getCrafting(req, res) {
    try {
        const result = await craftingsService.getCrafting(req.params.id);
        if (!result) return sendError(res, "Not found", 404);
        sendOne(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function createCrafting(req, res) {
    try {
        const result = await craftingsService.createCrafting(req.body);
        sendCreated(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function updateCrafting(req, res) {
    try {
        const result = await craftingsService.updateCrafting(req.params.id, req.body);
        if (!result) return sendError(res, "Not found", 404);
        sendOk(res, result); 
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function deleteCrafting(req, res) {
    try {
        const result = await craftingsService.deleteCrafting(req.params.id);
        if (!result) return sendError(res, "Not found", 404);
        sendOk(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}