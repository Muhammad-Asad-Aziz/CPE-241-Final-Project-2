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

export async function getSmelting(code) {
    const res = await http(`/api/smeltings/${code}`);
    return unwrap(res);
}

export async function createSmelting(payload) {
    const res = await http("/api/smeltings", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return unwrap(res);
}

export async function updateSmelting(code, payload) {
    const res = await http(`/api/smeltings/${code}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return unwrap(res);
}

export async function deleteSmelting(code) {
    const res = await http(`/api/smeltings/${code}`, { method: "DELETE" });
    return unwrap(res);
}