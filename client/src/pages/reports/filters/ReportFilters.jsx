import React from "react";
import { listChests } from "../../../api/chests.api.js";

import { listPlayers } from "../../../api/players.api.js";
import { listItems } from "../../../api/items.api.js"; 

export default function ReportFilters({ type, filters, onChange, onApply }) {
  const [chests, setChests] = React.useState([]);
  const [players, setPlayers] = React.useState([]);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (type === "chest-inventory") {
      listChests({ limit: 1000 }).then(res => setChests(res.data || []));
    }
    if (type === "crafting-history") {
      listPlayers({ limit: 1000 }).then(res => setPlayers(res.data || []));
    }
    if (type === "recipe-requirements") {
      listItems({ limit: 1000 }).then(res => setItems(res.data || []));
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

      {/* ----------------------------------------- */}
      {/* CRAFTING REPORTS  */}
      {/* ----------------------------------------- */}

      {/* 1. CRAFTING HISTORY FILTER (Dropdown) */}
      {type === "crafting-history" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
          <label className="form-label">Select Player</label>
          <select 
            className="form-control" 
            value={filters.playerName || ""} 
            onChange={(e) => onChange({ ...filters, playerName: e.target.value })}
          >
            <option value="">-- Choose Player --</option>
            {players.map(p => (
              <option key={p.id} value={p.username}>{p.username}</option>
            ))}
          </select>
        </div>
      )}

      {/* 2. RECIPE REQUIREMENTS FILTER (Dropdown) */}
      {type === "recipe-requirements" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
          <label className="form-label">Select Target Item</label>
          <select 
            className="form-control" 
            value={filters.itemName || ""} 
            onChange={(e) => onChange({ ...filters, itemName: e.target.value })}
          >
            <option value="">-- Choose Item --</option>
            {items.map(i => (
              <option key={i.id} value={i.item_name}>{i.item_name}</option>
            ))}
          </select>
        </div>
      )}

      {/* 3. TOP CRAFTED ITEMS FILTER (date) */}
      {type === "top-crafted" && (
        <>
          <div className="form-group" style={{ margin: 0, width: "200px" }}>
            <label className="form-label">Date From</label>
            <input 
              type="date" 
              className="form-control" 
              value={filters.fromDate || ""} 
              onChange={(e) => onChange({ ...filters, fromDate: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ margin: 0, width: "200px" }}>
            <label className="form-label">Date To</label>
            <input 
              type="date" 
              className="form-control" 
              value={filters.toDate || ""} 
              onChange={(e) => onChange({ ...filters, toDate: e.target.value })}
            />
          </div>
        </>
      )}

      {/*Run Report button */}
      <button type="button" className="btn btn-primary" onClick={onApply}>
        Run Report
      </button>
    </div>
  );
}