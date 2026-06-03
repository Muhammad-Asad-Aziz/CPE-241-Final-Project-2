import { http } from "./http.js";

function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listTransfers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/transfers${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getTransfer(code) {
  const res = unwrap(await http(`/api/transfers/${encodeURIComponent(code)}`));
  return res.data;
}

export async function createTransfer(payload) {
  const res = unwrap(await http("/api/transfers", { method: "POST", body: JSON.stringify(payload) }));
  return res.data;
}

export async function updateTransfer(code, payload) {
  const res = unwrap(await http(`/api/transfers/${encodeURIComponent(code)}`, { method: "PUT", body: JSON.stringify(payload) }));
  return res.data;
}

export async function deleteTransfer(code) {
  const res = unwrap(await http(`/api/transfers/${encodeURIComponent(code)}`, { method: "DELETE" }));
  return res.data;
}