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

  "enchanted-tool": {
    title: "Enchanted Tool History",
    subtitle: "Simple: List all tools modified with a specific enchantment.",
    emptyMessage: "No tools found with this enchantment.",
    getColumns: () => [
      { key: "date", label: "Interaction Date", render: (v) => formatDate(v) },
      { key: "anvil_id", label: "Workorder ID", render: (v) => `ANV-${v}` },
      { key: "player", label: "Player Username", render: (v) => <span className="font-bold">{v}</span> },
      { key: "target_tool", label: "Target Tool", render: (v) => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{v}</span> },
      { key: "enchantment", label: "Applied Enchantment" },
      { key: "max_level", label: "Max Level", align: "right" },
      { key: "xp_cost", label: "XP Level Cost", align: "right", style: { color: "#ef4444", fontWeight: "bold" } }
    ]
  },
  "anvil-history": {
    title: "Player Anvil History",
    subtitle: "Simple: List all anvil sessions made by a specific player.",
    emptyMessage: "No anvil history found for this player.",
    getColumns: () => [
      { key: "date", label: "Date", render: (v) => formatDate(v) },
      { key: "anvil_id", label: "Session ID", render: (v) => `ANV-${v}` },
      { key: "target_tool", label: "Target Item", render: (v) => <span className="font-bold">{v}</span> },
      { key: "curr_durability", label: "Current Durability", align: "right" },
      { key: "new_durability", label: "New Durability", align: "right", style: { color: "var(--primary)", fontWeight: "bold" } },
      { key: "xp_before", label: "XP Before", align: "right" },
      { key: "xp_after", label: "XP After", align: "right" }
    ]
  },
  "XP-type": {
    title: "Total XP Cost by Tool Type",
    subtitle: "Analysis: List XP On Tool Types",
    emptyMessage: "No tools found for this cost.",
    getColumns: () => [
      { key: "TOOL TYPE", label: "Item Name", render: (v) => <span className="font-bold">{v}</span> },
      { key: "JOBS", label: "Jobs", align: "right" },
      { key: "TOTAL XP SPENT", label: "Total XP Spent", align: "right", style: { color: "#ef4444", fontWeight: "bold" } },
      { key: "AVG XP/JOB", label: "Avg XP/Job", align: "right" },
      { key: "AVG DUR BEFORE", label: "Avg Dur Before", align: "right" },
      { key: "AVG DUR AFTER", label: "Avg Dur After", align: "right" }
    ]
  }
};
  // (GUIDE) #3.7 ADD YOUR REPORT


export default function Reports({ type = "chest-inventory" }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState({});
  const [appliedFilters, setAppliedFilters] = React.useState({});
  const [hasApplied, setHasApplied] = React.useState(type === "chest-utilization"); // Utilization requires no filters, run immediately!

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