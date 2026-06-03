import React from "react";
import { listChests } from "../../../api/chests.api.js";
import { listPlayers } from "../../../api/players.api.js";
import { listItems } from "../../../api/items.api.js"; 
import { listSmeltings } from "../../../api/smeltings.api.js";
import { listMinings } from "../../../api/minings.api.js";
import { listVillagers } from "../../../api/villagers.api.js";
import { listEnchantments } from "../../../api/enchantments.api.js"; 

const MINECRAFT_PROFESSIONS = [
  "Armorer", "Butcher", "Cartographer", "Cleric", "Farmer",
  "Fisherman", "Fletcher", "Leatherworker", "Librarian", "Mason",
  "Nitwit", "Shepherd", "Toolsmith", "Weaponsmith"
];

export default function ReportFilters({ type, filters, onChange, onApply }) {
  const [chests, setChests] = React.useState([]);
  const [players, setPlayers] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [smeltings, setSmeltings] = React.useState([]);
  const [minings, setMinings] = React.useState([]);
  const [enchantments, setEnchantments] = React.useState([]);

  React.useEffect(() => {
    if (type === "chest-inventory") {
      listChests({ limit: 1000 }).then(res => setChests(res.data || []));
    }
    if (type === "crafting-history" || type === "player-fuel" || type === "anvil-history") {
      listPlayers({ limit: 1000 }).then(res => setPlayers(res.data || []));
    }
    if (type === "recipe-requirements") {
      listItems({ limit: 1000 }).then(res => setItems(res.data || []));
    }
    if (type === "furnace-location") {
      listSmeltings({ limit: 1000 }).then(res => {
        if (Array.isArray(res)) setSmeltings(res);
        else if (res?.data && Array.isArray(res.data)) setSmeltings(res.data);
        else if (res?.data?.data) setSmeltings(res.data.data);
      });
    }
    if (type === "mining-history") {
      listMinings({ limit: 1000 }).then(res => {
        if (res && Array.isArray(res)) setMinings(res);
        else if (res?.data && Array.isArray(res.data)) setMinings(res.data);
        else if (res?.data?.data) setMinings(res.data.data);
      }).catch(err => console.error("Error loading mining history in filters:", err));
    }
    if (type === "enchanted-tool") {
      listEnchantments({ limit: 1000 }).then(res => setEnchantments(res.data || []));
    }
  }, [type]);

  const distinctLocations = React.useMemo(() => {
    const locs = smeltings.map(s => s.furnace_location_xyz).filter(Boolean);
    return [...new Set(locs)].sort();
  }, [smeltings]);

  const distinctBiomes = React.useMemo(() => {
    const bms = minings.map(m => m.biome_name).filter(Boolean);
    return [...new Set(bms)].sort();
  }, [minings]);

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
      
      {/* CHEST UTILIZATION FILTER */}
      {type === "chest-utilization" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
          <label className="form-label">Select Dimension</label>
          <select 
            className="form-control" 
            value={filters.dimension || ""} 
            onChange={(e) => onChange({ ...filters, dimension: e.target.value })}
          >
            <option value="">-- Choose Dimension (All) --</option>
            <option value="Overworld">Overworld</option>
            <option value="Nether">Nether</option>
            <option value="The End">The End</option>
          </select>
        </div>
      )}

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
              <option key={c.id} value={c.id}>{c.chest_code} ({c.dimension})</option>
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

      {/* CRAFTING HISTORY FILTER */}
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

      {/* RECIPE REQUIREMENTS FILTER */}
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

      {/* TOP CRAFTED ITEMS FILTER */}
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

      
      {/* ----------------------------------------- */}
      {/* ANVIL REPORTS  */}
      {/* ----------------------------------------- */}

      {/* 1. TOOL BY ENCHANTMENT FILTER (Dropdown) */}
      {type === "enchanted-tool" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
            <label className="form-label">Select Enchantment</label>
            <select 
              className="form-control" 
              value={filters.enchantmentName || ""} 
              onChange={(e) => onChange({ ...filters, enchantmentName: e.target.value })}
            >
              <option value="">-- Choose Enchantment --</option>
              {enchantments && enchantments.map(e => (
                <option key={e.id} value={e.enchantment_name}>{e.enchantment_name}</option>
              ))}
            </select>
          </div>
      )}

      {/* 2. ANVIL HISTORY FILTER (Dropdown) */}
      {type === "anvil-history" && (
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

      {/* 3. XP COST BY TOOL TYPE FILTER (date) */}
      {type === "XP-type" && (
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

      {/* TRADING BY VILLAGER FILTER */}
      {type === "trading-by-villager" && (
        <div className="form-group" style={{ margin: 0, width: "200px" }}>
          <label className="form-label">Villager ID</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 1"
            value={filters.villager_id || ""}
            onChange={(e) => onChange({ ...filters, villager_id: e.target.value })}
          />
        </div>
      )}
          
      {/* Mining REPORTS  */}
      {/* ----------------------------------------- */}

      {/* LOCKED TRADES FILTER */}
      {type === "locked-trades" && (
        <div className="form-group" style={{ margin: 0, width: "250px" }}>
          <label className="form-label">Filter by Profession</label>
          <select
            className="form-control"
            value={filters.profession || ""}
            onChange={(e) => onChange({ ...filters, profession: e.target.value })}
          >
            <option value="">-- All Professions --</option>
            {MINECRAFT_PROFESSIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {/* TRADING VOLUME BY PROFESSION FILTER */}
      {type === "trading-volume-profession" && (
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

      {/* MINING HISTORY FILTER */}
      {type === "mining-history" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
          <label className="form-label">Select Biome</label>
          <select 
            className="form-control" 
            value={filters.biomeName || ""} 
            onChange={(e) => onChange({ ...filters, biomeName: e.target.value })}
          >
            <option value="">-- Choose Biome --</option>
            {distinctBiomes.map(biome => (
              <option key={biome} value={biome}>{biome}</option>
            ))}
          </select>
        </div>
      )}

      {/* 2. BROKEN TOOLS FILTER (date range) */}
      {type === "broken-tools" && (
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

      {/* BLOCKS MINED FILTER */}
      {type === "blocks-mined" && (
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

      {/* ----------------------------------------- */}
      {/* Smelting REPORTS  */}
      {/* ----------------------------------------- */}

      {/*1.Furnace Location*/}
      {type === "furnace-location" && (
        <div className="form-group" style={{ margin: 0, width: "300px" }}>
          <label className="form-label">Select Furnace Location</label>
          <select 
            className="form-control" 
            value={filters.location || ""} 
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
          >
            <option value="">-- Choose Location --</option>
            {distinctLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      )}

      {/*2.Player Fuel*/}
      {type === "player-fuel" && (
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

      {/*3.Fuel Analysis*/}
      {type === "fuel-analysis" && (
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
