import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listItems(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/items${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getItem(code) {
  const res = unwrap(await http(`/api/items/${encodeURIComponent(code)}`));
  return res.data;
}

export async function createItem(data) {
  const res = unwrap(await http("/api/items", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateItem(code, data) {
  const res = unwrap(await http(`/api/items/${encodeURIComponent(code)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteItem(code, force = false) {
  const url = `/api/items/${encodeURIComponent(code)}` + (force ? "?force=true" : "");
  const res = unwrap(await http(url, { method: "DELETE" }));
  return res.data;
}