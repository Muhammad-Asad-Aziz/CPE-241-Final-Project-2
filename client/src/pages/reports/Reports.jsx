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
  }
  // (GUIDE) #3.7 ADD YOUR REPORT
};

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