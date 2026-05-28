import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

export async function listPlayers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = unwrap(await http(`/api/players${query ? `?${query}` : ""}`));
  return { data: res.data, ...(res.meta || {}) };
}

export async function getPlayer(id) {
  const res = unwrap(await http(`/api/players/${encodeURIComponent(id)}`));
  return res.data;
}

export async function createPlayer(data) {
  const res = unwrap(await http("/api/players", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updatePlayer(id, data) {
  const res = unwrap(await http(`/api/players/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deletePlayer(id, force = false) {
  const url = `/api/players/${encodeURIComponent(id)}` + (force ? "?force=true" : "");
  const res = unwrap(await http(url, { method: "DELETE" }));
  return res.data;
}