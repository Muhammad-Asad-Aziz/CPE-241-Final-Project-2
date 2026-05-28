import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/recipes${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getRecipe(id) {
  const res = unwrap(await http(`/api/recipes/${encodeURIComponent(id)}`));
  return res.data;
}

export async function createRecipe(data) {
  const res = unwrap(await http("/api/recipes", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateRecipe(id, data) {
  const res = unwrap(await http(`/api/recipes/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteRecipe(id) {
  const res = unwrap(await http(`/api/recipes/${encodeURIComponent(id)}`, { method: "DELETE" }));
  return res.data;
}