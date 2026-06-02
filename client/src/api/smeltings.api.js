import { http } from "./http.js";

function unwrap(res) {
    if (res && res.success === false && res.error) {
        throw new Error(res.error.message || "API Error");
    }
    return res.data;
}

export async function listSmeltings(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await http(`/api/smeltings?${query}`);
    if (res && res.success === false) throw new Error(res.error?.message || "API Error");
    return res; 
}

export async function getSmelting(id) {
    const res = await http(`/api/smeltings/${id}`);
    return unwrap(res);
}

export async function createSmelting(payload) {
    const res = await http("/api/smeltings", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return unwrap(res);
}

export async function updateSmelting(id, payload) {
    const res = await http(`/api/smeltings/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return unwrap(res);
}

export async function deleteSmelting(id) {
    const res = await http(`/api/smeltings/${id}`, { method: "DELETE" });
    return unwrap(res);
}