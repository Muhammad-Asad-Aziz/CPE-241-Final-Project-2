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

export async function getPlayer(code) {
  const res = unwrap(await http(`/api/players/${encodeURIComponent(code)}`));
  return res.data;
}

export async function createPlayer(data) {
  const res = unwrap(await http("/api/players", { method: "POST", body: JSON.stringify(data) }));
  return res.data;
}

export async function updatePlayer(code, data) {
  const res = unwrap(await http(`/api/players/${encodeURIComponent(code)}`, { method: "PUT", body: JSON.stringify(data) }));
  return res.data;
}

export async function deletePlayer(code, force = false) {
  const url = `/api/players/${encodeURIComponent(code)}` + (force ? "?force=true" : "");
  const res = unwrap(await http(url, { method: "DELETE" }));
  return res.data;
}