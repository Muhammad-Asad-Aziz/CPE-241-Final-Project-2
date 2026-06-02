import React from "react";
import { toast } from "react-toastify";
import { getReportData } from "../../api/reports.api.js";
import { formatDate } from "../../utils.js";
import ReportFilters from "./filters/ReportFilters.jsx";
import ReportTable from "../../components/ReportTable.jsx";

const REPORT_CONFIG = {
  "chest-inventory": {
    title: "Chest Inventory",
    subtitle: "List items stored in a specific chest or view all chests at once.",
    emptyMessage: "No items found.",
    getColumns: () => [
      { key: "chest_id", label: "Chest", render: (v, row) => `Chest #${v} (${row.dimension})` },
      { key: "item_name", label: "Item Name", render: (v) => <span className="font-bold">{v}</span> },
      { key: "item_type", label: "Item Type" },
      { key: "current_quantity", label: "Quantity Stored", align: "right", style: { color: "var(--primary)", fontWeight: "bold" } }
    ]
  },
  "daily-transfers": {
    title: "Transfer History Log",
    subtitle: "Detailed item-by-item log of transfers. (Upgraded for project: Now supports full date ranges instead of just a single day, and shows all history if left blank!)",
    emptyMessage: "No transfers occurred in this date range.",
    getColumns: () => [
      { key: "transfer_id", label: "Transfer ID", render: (v) => `TRN-${v}` },
      { key: "transfer_date", label: "Date", render: (v) => formatDate(v) },
      { key: "player_username", label: "Player", render: (v) => <span className="font-bold">{v}</span> },
      { key: "item_moved", label: "Item Moved", render: (v) => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{v}</span> },
      { key: "quantity_transferred", label: "Quantity", align: "right" },
      { 
        key: "src_chest", 
        label: "From", 
        render: (v) => v === "Player Inventory" ? <span className="text-muted">{v}</span> : `Chest #${v}` 
      },
      { 
        key: "dst_chest", 
        label: "To", 
        render: (v) => v === "Player Inventory" ? <span className="text-muted">{v}</span> : `Chest #${v}` 
      }
    ]
  },
  "chest-utilization": {
    title: "Chest Capacity Utilization",
    subtitle: "Analysis: Chest slot usage grouped by Dimension (Assumes 27 slots per chest).",
    emptyMessage: "No data available.",
    getColumns: () => [
      { key: "dimension", label: "Dimension", render: (v) => <span className="font-bold">{v}</span> },
      { key: "total_chests", label: "Total Chests", align: "right" },
      { key: "total_used_slots", label: "Used Slots", align: "right" },
      { key: "total_capacity", label: "Max Capacity (Slots)", align: "right" },
      { key: "utilization_percent", label: "Utilization (%)", align: "right", style: { fontWeight: 600, color: "#ef4444" }, render: (v) => `${v}%` }
    ]
  },

  "crafting-history": {
    title: "Player Crafting History",
    subtitle: "Simple: List all crafting sessions made by a specific Player.",
    emptyMessage: "No crafting history found for this player.",
    getColumns: () => [
      { key: "Craft_Date", label: "Date", render: (v) => formatDate(v) },
      { key: "Session_ID", label: "Session ID", render: (v) => `CRF-${v}` },
      { key: "Player_Name", label: "Player Name", render: (v) => <span className="font-bold">{v}</span> },
      { key: "Target_Item", label: "Target Item", render: (v) => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{v}</span> },
      { key: "Qty_Wanted", label: "Qty Wanted", align: "right" }
    ]
  },
  "recipe-requirements": {
    title: "Recipe Requirements",
    subtitle: "Simple: Print Recipe requirements for a specific Item Name.",
    emptyMessage: "No recipe found for this item.",
    getColumns: () => [
      { key: "Target_Item", label: "Target Item", render: (v) => <span className="font-bold">{v}</span> },
      { key: "Ingredient_Needed", label: "Ingredient Needed" },
      { key: "Required_Qty", label: "Required Quantity", align: "right", style: { color: "var(--primary)", fontWeight: "bold" } }
    ]
  },
  "top-crafted": {
    title: "Top 5 Most Crafted Items",
    subtitle: "Analysis: Show Top 5 Most Crafted Items in the server within a date range.",
    emptyMessage: "No crafting records found in this date range.",
    getColumns: () => [
      { key: "Target_Item", label: "Item Name", render: (v) => <span className="font-bold">{v}</span> },
      { key: "Item_Type", label: "Item Type" },
      { key: "Total_Quantity_Crafted", label: "Total Crafted", align: "right", style: { color: "#ef4444", fontWeight: "bold" } }
    ]
  },
  // (GUIDE) #3.7 ADD YOUR REPORT

  "trading-by-villager": {
    title: "Trades by Villager",
    subtitle: "Simple: List all trades made with a specific Villager ID.",
    emptyMessage: "No trades found for this villager.",
    getColumns: () => [
      { key: "session_id", label: "Session", render: v => `TRD-${v}` },
      { key: "trade_date", label: "Date", render: v => formatDate(v) },
      { key: "player_name", label: "Player", render: v => <span className="font-bold">{v}</span> },
      { key: "villager_name", label: "Villager" },
      { key: "profession", label: "Profession" },
      { key: "item_given", label: "Item Given", render: v => <span style={{ color: "#ef4444" }}>{v}</span> },
      { key: "quantity_given", label: "Qty Given", align: "right" },
      { key: "item_received", label: "Item Received", render: v => <span style={{ color: "#22c55e" }}>{v}</span> },
      { key: "quantity_received", label: "Qty Received", align: "right" },
      { key: "trade_status", label: "Status", render: v => <span style={{ fontWeight: "bold", color: v === "Locked" ? "#ef4444" : "#22c55e" }}>{v}</span> },
    ]
  },
  "locked-trades": {
    title: "Villagers with Locked Trades",
    subtitle: "Simple: List all villagers who currently have 'Locked' trades.",
    emptyMessage: "No locked trades found.",
    getColumns: () => [
      { key: "villager_id", label: "Villager ID" },
      { key: "villager_name", label: "Villager Name", render: v => <span className="font-bold">{v}</span> },
      { key: "profession", label: "Profession", render: v => <span style={{ color: "var(--primary)" }}>{v}</span> },
      { key: "biome_type", label: "Biome" },
      { key: "locked_trade_count", label: "Locked Trades", align: "right", style: { fontWeight: "bold", color: "#ef4444" } },
    ]
  },
  "trading-volume-profession": {
    title: "Trading Volume by Profession",
    subtitle: "Analysis: Total Items Traded (Given vs Received) grouped by Villager Profession.",
    emptyMessage: "No trading data found in this date range.",
    getColumns: () => [
      { key: "profession", label: "Profession", render: v => <span className="font-bold">{v}</span> },
      { key: "total_sessions", label: "Sessions", align: "right" },
      { key: "total_given", label: "Total Given", align: "right", style: { color: "#ef4444", fontWeight: "bold" } },
      { key: "total_received", label: "Total Received", align: "right", style: { color: "#22c55e", fontWeight: "bold" } },
      { key: "total_volume", label: "Total Volume", align: "right", style: { fontWeight: "bold" } },
    ]
  },

  "mining-history": {
    title: "Mining History of each Biome",
    subtitle: "Simple: Shows the amount of blocks that was mined in each biome.",
    emptyMessage: "No mining records found for this biome.",
    getColumns: () => [
      { key: "TRIP ID", label: "Mining Trip ID", render: v => `MN-${v}` },
      { key: "DATE", label: "Date", align: "right", render: v => formatDate(v) },
      { key: "PLAYER", label: "Player Name", render: v => <span className="font-bold">{v}</span> },
      { key: "BIOME", label: "Biome", align: "right", style: { color: "var(--primary)", fontWeight: "bold"} },
      { key: "BLOCK MINED", label: "Block Name", align: "left" },
      { key: "QTY MINED", label: "QTY Mined", align: "right", style: { color: "var(--primary)", fontWeight: "bold"} },
      { key: "TOOL USED", label: "Item Used", align: "left" }
    ]
  },

  "broken-tools": {
    title: "Mining Tools That Are No Longer Usable",
    subtitle: "Simple: Shows mining tools that are broken",
    emptyMessage: "No broken tools found.",
    getColumns: () => [
      { key: "TRIP ID", label: "Mining Trip ID", render: (v) => `MN-${v}` },
      { key: "DATE", label: "Date", align: "right", render: (v) => formatDate(v) },
      { key: "PLAYER", label: "Player Name", render: (v) => <span className="font-bold">{v}</span> },
      { key: "BLOCK MINED", label: "Block Mined", align: "left" },
      { key: "TOOL USED", label: "Item Used", align: "left" },
      { key: "DUR LOST", label: "Durability Lost", align: "right", style: { color: "#ef4444"} },
      { key: "QTY MINED", label: "QTY Mined", align: "right" },
      { key: "STATUS", label: "Tool Status", align: "left", style: { color: "#ef4444", fontWeight: "bold"} }
    ]
  },

  "blocks-mined": {
    title: "Blocks Mined By Different Tool Materials",
    subtitle: "Analysis: Shows total blocks mined grouped by tool material",
    emptyMessage: "No blocks found.",
    getColumns: () => [
      { key: "TOOL (MATERIAL)", label: "Tool (material)", align: "left", style: { color: "var(--primary)", fontWeight: "bold"} },
      { key: "TRIPS", label: "Mining Trip ID", render: (v) => `MN-${v}` },
      { key: "TOTAL MINED", label: "Total Blocks Mined", align: "right" },
      { key: "DUR LOST", label: "Durability Lost", align: "right", style: { color: "#ef4444", fontWeight: "bold"} },
      { key: "BLOCKS MINED TYPES", label: "No. of Types of Blocks Mined", align: "right", style: { color: "var(--primary)", fontWeight: "bold"} },
      { key: "TOOL STATUS", label: "Tool Status", align: "left" }
    ]
  }
};

export default function Reports({ type = "chest-inventory" }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({});
  const [appliedFilters, setAppliedFilters] = React.useState({});
  const [hasApplied, setHasApplied] = React.useState(type === "chest-utilization");

  const config = REPORT_CONFIG[type];

  const fetchData = React.useCallback(() => {
    setLoading(true);
    getReportData(type, appliedFilters)
      .then((res) => setData(res.data || []))
      .catch((e) => toast.error(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [type, appliedFilters]);

  // Reset when changing report type
  React.useEffect(() => {
    setFilters({});
    setAppliedFilters({});
    setData([]);
    if (type === "chest-utilization") {
      setHasApplied(true);
    } else {
      setHasApplied(false);
    }
  }, [type]);

  // Fetch when applied filters change or if it's the utilization report
  React.useEffect(() => {
    if (!hasApplied) return;
    fetchData();
  }, [hasApplied, appliedFilters, fetchData]);

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setHasApplied(true);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h3 className="page-title">{config.title}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{config.subtitle}</p>
        </div>
      </div>

      {type !== "chest-utilization" && (
        <div className="card" style={{ marginBottom: 24 }}>
          <ReportFilters type={type} filters={filters} onChange={setFilters} onApply={handleApply} />
        </div>
      )}

      <div className="card">
        {!hasApplied ? (
          <div className="empty-state">
            <h4>Select your filters</h4>
            <p>Choose filter options above and click "Run Report".</p>
          </div>
        ) : (
          <div className="table-container">
            <ReportTable 
              columns={config.getColumns()} 
              data={data} 
              emptyMessage={config.emptyMessage}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}