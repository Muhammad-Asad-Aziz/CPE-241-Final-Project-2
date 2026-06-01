import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listAnvils(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/anvils${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getAnvil(id) {
  const res = unwrap(await http(`/api/anvils/${encodeURIComponent(id)}`));
  if (!res.ok) throw new Error("Network response failed tracking data records.");
  return res.data;
}

export async function createAnvil(payload) {
  const res = unwrap(await http("/api/anvils", { method: "POST", body: JSON.stringify(payload) }));
  return res.data;
}

export async function updateAnvil(id, payload) {
  const res = unwrap(await http(`/api/anvils/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }));
  return res.data;
}

export async function deleteAnvil(id) {
  const res = unwrap(await http(`/api/anvils/${encodeURIComponent(id)}`, { method: "DELETE" }));
  return res.data;
}