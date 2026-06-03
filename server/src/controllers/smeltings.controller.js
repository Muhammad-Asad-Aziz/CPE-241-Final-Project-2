import * as smeltingsService from "../services/smeltings.service.js";
import { sendList, sendOne, sendCreated, sendError, sendOk } from "../utils/response.js";

export async function listSmeltings(req, res) {
    try {
        const result = await smeltingsService.listSmeltings(req.query);
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

export async function getSmelting(req, res) {
    try {
        const result = await smeltingsService.getSmelting(req.params.code);
        if (!result) return sendError(res, "Not found", 404);
        sendOne(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function createSmelting(req, res) {
    try {
        const result = await smeltingsService.createSmelting(req.body);
        sendCreated(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function updateSmelting(req, res) {
    try {
        const result = await smeltingsService.updateSmelting(req.params.code, req.body);
        if (!result) return sendError(res, "Not found", 404);
        sendOk(res, result); 
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function deleteSmelting(req, res) {
    try {
        const result = await smeltingsService.deleteSmelting(req.params.code);
        if (!result) return sendError(res, "Not found", 404);
        sendOk(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}