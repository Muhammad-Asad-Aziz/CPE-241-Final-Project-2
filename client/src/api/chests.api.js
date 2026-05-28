import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listChests(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/chests${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getChest(id) {
  const res = unwrap(await http(`/api/chests/${encodeURIComponent(id)}`));
  return res.data;
}

export async function createChest(data) {
  const res = unwrap(await http("/api/chests", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateChest(id, data) {
  const res = unwrap(await http(`/api/chests/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteChest(id) {
  const res = unwrap(await http(`/api/chests/${encodeURIComponent(id)}`, { method: "DELETE" }));
  return res.data;
}