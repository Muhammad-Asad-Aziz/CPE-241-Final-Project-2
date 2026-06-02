import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listMinings(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/minings${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getMining(id) {
  const res = unwrap(await http(`/api/minings/${encodeURIComponent(id)}`));
  return res.data;
}

export async function createMining(payload) {
  const res = unwrap(await http("/api/minings", { method: "POST", body: JSON.stringify(payload) }));
  return res.data;
}

export async function updateMining(id, payload) {
  const res = unwrap(await http(`/api/minings/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }));
  return res.data;
}

export async function deleteMining(id) {
  const res = unwrap(await http(`/api/minings/${encodeURIComponent(id)}`, { method: "DELETE" }));
  return res.data;
}