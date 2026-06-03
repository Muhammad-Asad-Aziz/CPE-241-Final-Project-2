import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listEnchantments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/enchantments${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getEnchantment(code) {
  const res = unwrap(await http(`/api/enchantments/${encodeURIComponent(code)}`));
  return res.data;
}

export async function createEnchantment(data) {
  const res = unwrap(await http("/api/enchantments", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateEnchantment(code, data) {
  const res = unwrap(await http(`/api/enchantments/${encodeURIComponent(code)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteEnchantment(code) {
  const res = unwrap(await http(`/api/enchantments/${encodeURIComponent(code)}`, { method: "DELETE" }));
  return res.data;
}