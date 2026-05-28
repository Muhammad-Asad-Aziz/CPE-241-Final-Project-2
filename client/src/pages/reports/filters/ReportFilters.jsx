import React from "react";
import { listChests } from "../../../api/chests.api.js";


export default function ReportFilters({ type, filters, onChange, onApply }) {
  const [chests, setChests] = React.useState([]);

  React.useEffect(() => {
    if (type === "chest-inventory") {
      listChests({ limit: 1000 }).then(res => setChests(res.data || []));
    }
  }, [type]);

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
      
      {/* CHEST INVENTORY FILTER */}
      {type === "chest-inventory" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
          <label className="form-label">Select Chest</label>
          <select 
            className="form-control" 
            value={filters.chest_id || ""} 
            onChange={(e) => onChange({ ...filters, chest_id: e.target.value })}
          >
            <option value="">-- Choose Chest --</option>
            {chests.map(c => (
              <option key={c.id} value={c.id}>Chest #{c.id} ({c.dimension})</option>
            ))}
          </select>
        </div>
      )}

      {/* DAILY TRANSFERS FILTER */}
      {type === "daily-transfers" && (
        <>
          <div className="form-group" style={{ margin: 0, width: "200px" }}>
            <label className="form-label">Date From</label>
            <input 
              type="date" 
              className="form-control" 
              value={filters.date_from || ""} 
              onChange={(e) => onChange({ ...filters, date_from: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ margin: 0, width: "200px" }}>
            <label className="form-label">Date To</label>
            <input 
              type="date" 
              className="form-control" 
              value={filters.date_to || ""} 
              onChange={(e) => onChange({ ...filters, date_to: e.target.value })}
            />
          </div>
        </>
      )}

      <button type="button" className="btn btn-primary" onClick={onApply}>
        Run Report
      </button>
    </div>
  );
}