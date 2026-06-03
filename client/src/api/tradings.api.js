import { http } from "./http.js";

function unwrap(res) {
    if (res && res.success === false && res.error) throw new Error(res.error.message || res.error);
    return res;
}

export async function listTradings(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = unwrap(await http(`/api/tradings${query ? `?${query}` : ""}`));
    return { data: res.data, ...(res.meta || {}) };
}

export async function getTrading(id) {
    const res = unwrap(await http(`/api/tradings/${encodeURIComponent(id)}`));
    return res.data;
}

export async function createTrading(data) {
    const res = unwrap(await http("/api/tradings", { method: "POST", body: JSON.stringify(data) }));
    return res.data;
}

export async function updateTrading(id, data) {
    const res = unwrap(await http(`/api/tradings/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }));
    return res.data;
}

export async function deleteTrading(id) {
    const res = unwrap(await http(`/api/tradings/${encodeURIComponent(id)}`, { method: "DELETE" }));
    return res.data;
}
