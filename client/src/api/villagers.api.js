import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listVillagers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/villagers${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getVillager(id) {
  const res = unwrap(await http(`/api/villagers/${encodeURIComponent(id)}`));
  return res.data;
}

export async function createVillager(data) {
  const res = unwrap(await http("/api/villagers", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateVillager(id, data) {
  const res = unwrap(await http(`/api/villagers/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteVillager(id) {
  const res = unwrap(await http(`/api/villagers/${encodeURIComponent(id)}`, { method: "DELETE" }));
  return res.data;
}