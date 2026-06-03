import { http } from "./http.js";

function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/recipes${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getRecipe(code) {
  const res = unwrap(await http(`/api/recipes/${encodeURIComponent(code)}`));
  return res.data;
}

export async function createRecipe(data) {
  const res = unwrap(await http("/api/recipes", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updateRecipe(code, data) {
  const res = unwrap(await http(`/api/recipes/${encodeURIComponent(code)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deleteRecipe(code) {
  const res = unwrap(await http(`/api/recipes/${encodeURIComponent(code)}`, { method: "DELETE" }));
  return res.data;
}