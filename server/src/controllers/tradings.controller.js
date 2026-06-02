import * as tradingsService from "../services/tradings.service.js";
import { sendOne, sendCreated, sendError, sendOk } from "../utils/response.js";

export async function listTradings(req, res) {
    try {
        const result = await tradingsService.listTradings(req.query);
        res.json({
            success: true,
            data: result.data,
            meta: {
                total: result.total,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getTrading(req, res) {
    try {
        const result = await tradingsService.getTrading(req.params.id);
        if (!result) return sendError(res, "Not found", 404);
        sendOne(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function createTrading(req, res) {
    try {
        const result = await tradingsService.createTrading(req.body);
        sendCreated(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function updateTrading(req, res) {
    try {
        const result = await tradingsService.updateTrading(req.params.id, req.body);
        if (!result) return sendError(res, "Not found", 404);
        sendOk(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}

export async function deleteTrading(req, res) {
    try {
        const result = await tradingsService.deleteTrading(req.params.id);
        if (!result) return sendError(res, "Not found", 404);
        sendOk(res, result);
    } catch (err) {
        sendError(res, err.message, 500);
    }
}
