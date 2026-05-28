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
// (GUIDE) #3.6 ADD YOUR REPORTS HERE

export async function getReportData(type, params = {}) {
  const path = REPORT_ENDPOINTS[type] || REPORT_ENDPOINTS["chest-inventory"];
  
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