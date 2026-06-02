import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listTransfers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/transfers${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getTransfer(id) {
  const res = unwrap(await http(`/api/transfers/${encodeURIComponent(id)}`));
  return res.data;
}

export async function createTransfer(payload) {
  const res = unwrap(await http("/api/transfers", { method: "POST", body: JSON.stringify(payload) }));
  return res.data;
}

export async function updateTransfer(id, payload) {
  const res = unwrap(await http(`/api/transfers/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }));
  return res.data;
}

export async function deleteTransfer(id) {
  const res = unwrap(await http(`/api/transfers/${encodeURIComponent(id)}`, { method: "DELETE" }));
  return res.data;
}