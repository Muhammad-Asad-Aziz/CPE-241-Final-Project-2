import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAnvil, createAnvil, updateAnvil } from "../../api/anvils.api.js";
import { formatDate } from "../../utils.js";
import Loading from "../../components/Loading.jsx";

// Import LoV Pickers
import PlayerPickerModal from "../../components/pickers/PlayerPickerModal.jsx";
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";
import EnchantmentPickerModal from "../../components/pickers/EnchantmentPickerModal.jsx";

function emptyLine() {
  return {
    target_tool_id: "",
    target_tool_name: "",
    current_durability: 0,
    target_max_durability: 0,
    sacrifice_item_id: "",
    sacrifice_item_name: "",
    sacrifice_max_durability: 0,
    restored_durability: 0,
    enchantment_id: "",
    enchantment_name: "",
    enchantment_max_level: 0
  };
}

export default function AnvilPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  // Form State
  const [anvilDate, setAnvilDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [playerUsername, setPlayerUsername] = React.useState("");
  const [totalXpCost, setTotalXpCost] = React.useState(0);
  const [playerXpBefore, setPlayerXpBefore] = React.useState(0);
  const [playerXpAfter, setPlayerXpAfter] = React.useState(0);
  
  const [lines, setLines] = React.useState([emptyLine()]);

  // View State & UI State
  const [viewData, setViewData] = React.useState(null);
  const [loading, setLoading] = React.useState(mode !== "create");
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState("");

  // Modal LoV states
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [targetToolModalOpen, setTargetToolModalOpen] = React.useState(false);
  const [sacrificeItemModalOpen, setSacrificeItemModalOpen] = React.useState(false);
  const [enchantmentModalOpen, setEnchantmentModalOpen] = React.useState(false);
  const [activeLineIdx, setActiveLineIdx] = React.useState(null);

  React.useEffect(() => {
    if (mode === "create") return;
    
    getAnvil(id)
      .then((t) => {
        if (!t) { setErr("Anvil log not found."); return; }
        setViewData(t);

        if (mode === "edit") {
          setAnvilDate(t.header.anvil_date ? new Date(t.header.anvil_date).toISOString().slice(0, 10) : "");
          setPlayerUsername(t.header.player_username || "");
          setTotalXpCost(t.header.total_xp_cost ?? 0);
          setPlayerXpBefore(t.header.player_xp_before ?? 0);
          setPlayerXpAfter(t.header.player_xp_after ?? 0);
          
          if (t.line_items && t.line_items.length > 0) {
            setLines(t.line_items.map(li => ({
              target_tool_id: li.target_tool_id || "",
              target_tool_name: li.target_tool_name || `Tool Item #${li.target_tool_id}`,
              current_durability: li.current_durability ?? 0,
              sacrifice_item_id: li.sacrifice_item_id || "",
              sacrifice_item_name: li.sacrifice_item_name || (li.sacrifice_item_id ? `Sacrifice Item #${li.sacrifice_item_id}` : ""),
              restored_durability: li.restored_durability ?? 0,
              enchantment_id: li.enchantment_id || "",
              enchantment_name: li.enchantment_name || (li.enchantment_id ? `Enchantment #${li.enchantment_id}` : "")
            })));
          }
        }
      })
      .catch((error) => setErr(String(error.message || error)))
      .finally(() => setLoading(false));
  }, [id, mode]);

  // Calculate restored durability -- Formula: restored_durability = current durability + sacrificed item durability + floor(target max durability/20)
  function calculateRestored(current, sacrificeMax, targetMax) {
    const current_dur = Number(current) || 0;
    const sac = Number(sacrificeMax) || 0;
    const max_target = Number(targetMax) || 0;

    if (!current_dur && !sac) return 0; // Default current durability aka no change if no sacrificed item
    
    return current_dur + sac + Math.floor(max_target / 20);
  }

  // Calculate Penalty -- Formula: Penalty = 2^(use_count) - 1
  function calculatePenalty(useCount) {
    if (useCount <= 0) return 0;
    return Math.pow(2, useCount) - 1;
  }

  function updateLine(index, field, value) {
    setLines(prev => {
      const copy = [...prev];

      // Apply extra metadata fields passed from our LoV select Modals
      if (Object.keys(extraData).length > 0) {
        updatedRow = { ...updatedRow, ...extraData };
      }

      // Automatically compute state if tracking dependencies shift
      if (
        field === "current_durability" || 
        field === "target_tool_id" || 
        field === "sacrifice_item_id"
      ) {
        updatedRow.restored_durability = calculateRestored(
          field === "current_durability" ? value : updatedRow.current_durability,
          updatedRow.sacrifice_max_durability,
          updatedRow.target_max_durability
        );
      }

      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addLine() {
    setLines(prev => {
      // 5 max limit for modifications
      if (prev.length >= 5) {
        toast.error("Anvil interactions are restricted to a maximum of 5 modifications per session!");
        return prev;
      }
      return [...prev, emptyLine()];
    });
  }

  function removeLine(index) {
    setLines(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!playerUsername) return toast.error("Player identity tracking is required!");
    if (lines.length === 0) return toast.error("Please append at least one item modification line transaction row.");

    setSubmitting(true);
    setErr("");

    try {
      const payload = {
        anvil_date: anvilDate,
        player_username: playerUsername,
        total_xp_cost: Number(totalXpCost),
        player_xp_before: Number(playerXpBefore),
        player_xp_after: Number(playerXpAfter),
        line_items: lines.map(l => ({
          target_tool_id: l.target_tool_id ? Number(l.target_tool_id) : null,
          current_durability: l.current_durability !== "" ? Number(l.current_durability) : null,
          sacrifice_item_id: l.sacrifice_item_id ? Number(l.sacrifice_item_id) : null,
          restored_durability: l.restored_durability !== "" ? Number(l.restored_durability) : null,
          enchantment_id: l.enchantment_id ? Number(l.enchantment_id) : null
        }))
      };

      if (mode === "create") {
        const res = await createAnvil(payload);
        toast.success("Anvil actions logged safely!");
        nav(`/anvils/${res.id}`);
      } else {
        await updateAnvil(id, payload);
        toast.success("Anvil transaction logs committed successfully!");
        nav(`/anvils/${id}`);
      }
    } catch (error) {
      setErr(String(error.message || error));
      toast.error("Failed to accurately save anvil data logs.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading size="large" />;

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  if (mode === "view" && viewData) {
    const h = viewData.header;
    const lineItems = viewData.line_items || [];

    return (
      <div className="invoice-preview">
        <div className="page-header no-print">
          <h3 className="page-title">Anvil Action Workorder #ANV-{h.id}</h3>
          <div className="flex gap-4">
            <Link to="/anvils" className="btn btn-outline">← Back</Link>
            <Link to={`/anvils/${h.id}/edit`} className="btn btn-outline">Edit</Link>
            <button onClick={() => window.print()} className="btn btn-primary">Print Record</button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between mb-4">
            <div>
              <div className="brand mb-4">CraftLess Inventory</div>
              <div className="font-bold" style={{ color: "var(--primary)", fontSize: "1.2rem" }}>
                Player: {h.player_username || `Account ID: ${h.player_id}`}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <span className="font-bold">XP Levels Prior: </span> {h.player_xp_before} Levels
              </div>
              <div>
                <span className="font-bold">XP Levels Post: </span> {h.player_xp_after} Levels
              </div>
            </div>
            <div className="text-right">
              <h2 className="mb-4">ANVIL LOG</h2>
              <div><span className="font-bold">Date:</span> {formatDate(h.anvil_date)}</div>
              <div><span className="font-bold">Record ID:</span> ANV-{h.id}</div>
              <div style={{ marginTop: "1rem", display: "inline-block", padding: "4px 12px", background: "#ef4444", color: "white", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>
                Cost: {h.total_xp_cost} XP Levels
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Line No.</th>
                  <th>Target Tool Item</th>
                  <th className="text-right">Starting Durability</th>
                  <th>Sacrifice Item Modification</th>
                  <th className="text-right">Restored Durability</th>
                  <th>Applied Enchantment</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((li, idx) => (
                  <tr key={li.id || idx}>
                    <td>{li.anvil_line_number}</td>
                    <td style={{ fontWeight: 600 }}>{li.target_tool_name || `Tool Item #${li.target_tool_id}`}</td>
                    <td className="text-right">{li.current_durability ?? "-"}</td>
                    <td>{li.sacrifice_item_id ? (li.sacrifice_item_name || `Sacrifice Item #${li.sacrifice_item_id}`) : "-- None --"}</td>
                    <td className="text-right font-bold" style={{ color: "var(--primary)" }}>{li.restored_durability ?? "-"}</td>
                    <td>{li.enchantment_id ? (li.enchantment_name || `Enchantment ID: ${li.enchantment_id}`) : "-- None --"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── CREATE / EDIT MODE ─────────────────────────────────────────────────────
  return (
    <div>
      <PlayerPickerModal isOpen={playerModalOpen} onClose={() => setPlayerModalOpen(false)} onSelect={(p) => setPlayerUsername(p.username)} />
      
      <ItemPickerModal isOpen={targetToolModalOpen} onClose={() => setTargetToolModalOpen(false)} onSelect={(item) => {
          updateLine(activeLineIdx, "target_tool_id", item.id);
          updateLine(activeLineIdx, "target_tool_name", item.item_name);
      }} />

      <ItemPickerModal isOpen={sacrificeItemModalOpen} onClose={() => setSacrificeItemModalOpen(false)} onSelect={(item) => {
          updateLine(activeLineIdx, "sacrifice_item_id", item.id);
          updateLine(activeLineIdx, "sacrifice_item_name", item.item_name);
      }} />

      <EnchantmentPickerModal isOpen={enchantmentModalOpen} onClose={() => setEnchantmentModalOpen(false)} onSelect={(ench) => {
          updateLine(activeLineIdx, "enchantment_id", ench.id);
          updateLine(activeLineIdx, "enchantment_name", ench.enchantment_name);
          updateLine(activeLineIdx, "enchantment_max_level", ench.enchantment_max_level);
      }} />

      <div className="page-header">
        <h3 className="page-title">{mode === "create" ? "Record New Anvil Action" : `Edit Anvil Interaction #ANV-${id}`}</h3>
        <Link to="/anvils" className="btn btn-outline">← Back</Link>
      </div>

      {err && <div className="alert alert-error">{err}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h4>Anvil Interaction Header Registry</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            
            <div className="form-group">
              <label className="form-label">Interaction Date <span className="required-marker">*</span></label>
              <input type="date" className="form-control" value={anvilDate} onChange={(e) => setAnvilDate(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Active Player Account <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={playerUsername} placeholder="Select Player context..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Total Level Cost (XP)</label>
              <input type="number" min="0" className="form-control" value={totalXpCost} onChange={(e) => setTotalXpCost(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">XP Before</label>
                <input type="number" min="0" className="form-control" value={playerXpBefore} onChange={(e) => setPlayerXpBefore(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">XP After</label>
                <input type="number" min="0" className="form-control" value={playerXpAfter} onChange={(e) => setPlayerXpAfter(e.target.value)} />
              </div>
            </div>

          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h4 style={{ margin: 0 }}>Item Customization Action Items</h4>
            <button type="button" className="btn btn-outline" onClick={() => setLines(prev => [...prev, emptyLine()])}>+ Add Modification Line</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Target Tool</th>
                  <th style={{ width: "120px" }}>Cur. Durability</th>
                  <th>Sacrifice Item Component</th>
                  <th style={{ width: "120px" }}>Rest. Durability</th>
                  <th>Enchantment Block</th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <input className="form-control" value={line.target_tool_name || ""} placeholder="Select Tool..." readOnly />
                        <button type="button" className="btn btn-primary" style={{ padding: "4px 8px" }} onClick={() => { setActiveLineIdx(idx); setTargetToolModalOpen(true); }}>LoV</button>
                        {line.target_tool_id && <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { updateLine(idx, "target_tool_id", ""); updateLine(idx, "target_tool_name", ""); }}>×</button>}
                      </div>
                    </td>
                    <td>
                      <input type="number" min="0" className="form-control" style={{ textAlign: "right" }} value={line.current_durability} onChange={(e) => updateLine(idx, "current_durability", e.target.value)} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <input className="form-control" value={line.sacrifice_item_name || ""} placeholder="Select Material..." readOnly />
                        <button type="button" className="btn btn-primary" style={{ padding: "4px 8px" }} onClick={() => { setActiveLineIdx(idx); setSacrificeItemModalOpen(true); }}>LoV</button>
                        {line.sacrifice_item_id && <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { updateLine(idx, "sacrifice_item_id", ""); updateLine(idx, "sacrifice_item_name", ""); }}>×</button>}
                      </div>
                    </td>
                    <td>
                      <input type="number" min="0" className="form-control" style={{ textAlign: "right" }} value={line.restored_durability} onChange={(e) => updateLine(idx, "restored_durability", e.target.value)} />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <input className="form-control" value={line.enchantment_name || ""} placeholder="Select Ench..." readOnly />
                        <button type="button" className="btn btn-primary" style={{ padding: "4px 8px" }} onClick={() => { setActiveLineIdx(idx); setEnchantmentModalOpen(true); }}>LoV</button>
                        {line.enchantment_id && <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { updateLine(idx, "enchantment_id", ""); updateLine(idx, "enchantment_name", ""); }}>×</button>}
                      </div>
                    </td>
                    <td className="text-center">
                      <button type="button" className="btn btn-outline" style={{ padding: "4px 8px", color: "#ef4444", borderColor: "#ef4444", fontSize: "0.75rem" }} onClick={() => removeLine(idx)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : (mode === "create" ? "Save Anvil Record" : "Update Anvil Record")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}