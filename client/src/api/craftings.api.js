import { http } from "./http.js";

function unwrap(res) {
    if (res && res.success === false && res.error) {
        throw new Error(res.error.message || "API Error");
    }
    return res.data;
}

export async function listCraftings(params = {}) {
    console.log("DataList sent something:", params);
    const query = new URLSearchParams(params).toString();
    const res = await http(`/api/craftings?${query}`);
    
    if (res && res.success === false) {
        throw new Error(res.error?.message || "API Error");
    }

    return res; 
}

export async function getCrafting(id) {
    const res = await http(`/api/craftings/${id}`);
    return unwrap(res);
}

export async function createCrafting(payload) {
    const res = await http("/api/craftings", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return unwrap(res);
}

export async function updateCrafting(id, payload) {
    const res = await http(`/api/craftings/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return unwrap(res);
}

export async function deleteCrafting(id) {
    const res = await http(`/api/craftings/${id}`, {
        method: "DELETE",
    });
    return unwrap(res);
}