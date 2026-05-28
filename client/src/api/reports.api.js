import { http } from "./http.js";

// If backend returns success: false, throw the error message so callers can catch.
function unwrap(res) {
  if (res && res.success === false && res.error) throw new Error(res.error.message);
  return res;
}

const REPORT_ENDPOINTS = {
  "chest-inventory": "/api/reports/chest-inventory",
  "daily-transfers": "/api/reports/daily-transfers",
  "chest-utilization": "/api/reports/chest-utilization",
};

export async function getPlayerCraftingHistory(params) {
    const query = new URLSearchParams(params).toString();
    const res = await http(`/api/reports/crafting-history?${query}`);
    return unwrap(res);
}

export async function getRecipeRequirements(params) {
    const query = new URLSearchParams(params).toString();
    const res = await http(`/api/reports/recipe-requirements?${query}`);
    return unwrap(res);
}

export async function getTopCraftedItems(params) {
    const query = new URLSearchParams(params).toString();
    const res = await http(`/api/reports/top-crafted?${query}`);
    return unwrap(res);
}

// (GUIDE) #3.6 ADD YOUR REPORTS HERE

export async function getReportData(type, params = {}) {
  const path = REPORT_ENDPOINTS[type] || REPORT_ENDPOINTS["chest-inventory"];

    if (type === "crafting-history") return getPlayerCraftingHistory(params);
    if (type === "recipe-requirements") return getRecipeRequirements(params);
    if (type === "top-crafted") return getTopCraftedItems(params);
  // Clean empty params
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") qs.set(key, value);
  }
  
  const queryString = qs.toString();
  const url = path + (queryString ? `?${queryString}` : "");
  
  const res = unwrap(await http(url));
  return { data: res.data || [] };
}