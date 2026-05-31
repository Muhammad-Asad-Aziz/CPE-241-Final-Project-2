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

export async function getChest(code) {
  const res = unwrap(await http(`/api/chests/${encodeURIComponent(code)}`));
  return res.data;
}

export async function createChest(data) {
  const res = unwrap(await http("/api/chests", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateChest(code, data) {
  const res = unwrap(await http(`/api/chests/${encodeURIComponent(code)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteChest(code) {
  const res = unwrap(await http(`/api/chests/${encodeURIComponent(code)}`, { method: "DELETE" }));
  return res.data;
}