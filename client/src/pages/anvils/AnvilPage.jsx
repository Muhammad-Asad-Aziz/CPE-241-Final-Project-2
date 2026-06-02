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
    sacrifice_item_id: "",
    sacrifice_item_name: "",
    sacrifice_max_durability: 0,
    restored_durability: "",
    enchantment_id: "",
    enchantment_name: "",
    enchantment_max_level: 0
  };
}

export default function AnvilPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  // Form Header State
  const [anvilDate, setAnvilDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [playerId, setPlayerId] = React.useState("");
  const [playerUsername, setPlayerUsername] = React.useState("");
  const [targetToolId, setTargetToolId] = React.useState("");
  const [targetToolName, setTargetToolName] = React.useState("");
  const [targetMaxDurability, setTargetMaxDurability] = React.useState(0);
  const [currentDurability, setCurrentDurability] = React.useState("");
  const [playerXpBefore, setPlayerXpBefore] = React.useState("");
  
  // Table Rows State
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

  // Fetch initial data if view/edit
  React.useEffect(() => {
    if (mode === "create") return;
    
    getAnvil(id)
      .then((t) => {
        if (!t) { setErr("Anvil log not found."); return; }
        setViewData(t); 

        if (mode === "edit") {
          setAnvilDate(t.header.anvil_date ? new Date(t.header.anvil_date).toISOString().slice(0, 10) : "");
          setPlayerId(t.header.player_id || "");
          setPlayerUsername(t.header.player_username || "");
          setPlayerXpBefore(t.header.player_xp_before ?? 0);
          
          if (t.line_items && t.line_items.length > 0) {
            const first = t.line_items[0];
            setTargetToolId(first.target_tool_id || "");
            setTargetToolName(first.target_tool_name || `Tool Item #${first.target_tool_id}`);
            setTargetMaxDurability(first.target_max_durability || 0);
            setCurrentDurability(first.current_durability ?? "");

            setLines(t.line_items.map(li => ({
              sacrifice_item_id: li.sacrifice_item_id || "",
              sacrifice_item_name: li.sacrifice_item_name || (li.sacrifice_item_id ? `Sacrifice Item #${li.sacrifice_item_id}` : ""),
              sacrifice_max_durability: li.sacrifice_max_durability || 0,
              restored_durability: li.restored_durability ?? "",
              enchantment_id: li.enchantment_id || "",
              enchantment_name: li.enchantment_name || (li.enchantment_id ? `Enchantment #${li.enchantment_id}` : ""),
              enchantment_max_level: li.enchantment_max_level || 0
            })));
          }
        }
      })
      .catch((error) => setErr(String(error.message || error)))
      .finally(() => setLoading(false));
  }, [id, mode]);

// --- CALCULATION LOGIC ENGINES ---

  function calculateRestored(sacrificeMax, targetMax, hasSacrifice) {
    if (!hasSacrifice) return "";
    
    const sacMax = Number(sacrificeMax) || 0;
    const tMax = Number(targetMax) || 0;

    // Condition A: Sacrificed item is the same as the target tool
    // Returns *just* the repair bonus value to be added: 10% of sacrifice max + 12% of target max
    return Math.floor((0.10 * sacMax) + (0.12 * tMax));
  }

  function calculatePenalty(lineNumber) {
    if (!lineNumber || lineNumber <= 0) return 0;
    return Math.pow(2, lineNumber) - 1;
  }

  // Derived Reactive Calculations
  const { totalXpCost, playerXpAfter, finalToolDurability, isDurabilityMaxed } = React.useMemo(() => {
    let totalCost = 0;
    const maxTargetDur = Number(targetMaxDurability) || 0;
    const baseDurability = Number(currentDurability) || 0;
    
    // Start with the initial current durability
    let currentRunningDurability = currentDurability !== "" ? baseDurability : null;
    let overflowDetected = false;

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const hasSacrifice = !!line.sacrifice_item_id;
      const hasEnchantment = !!line.enchantment_id;

      if (!hasSacrifice && !hasEnchantment) return; 

      // 1. Compute Cost Parameters
      const targetPenalty = calculatePenalty(lineNum);
      const sacrificePenalty = hasSacrifice ? calculatePenalty(lineNum) : 0;
      const countOfSacrificedSelected = hasSacrifice ? 1 : 0;
      const enchantmentCost = hasEnchantment ? ((Number(line.enchantment_max_level) || 0) * lineNum) : 0;

      totalCost += targetPenalty + sacrificePenalty + countOfSacrificedSelected + enchantmentCost;

      // 2. Simply add up the restored durabilities onto the current durability base
      if (hasSacrifice && currentRunningDurability !== null) {
        const lineOutput = Number(line.restored_durability) || 0;
        let nextDurability = currentRunningDurability + lineOutput;

        // If the calculated mathematical sum goes over max, flag it to block transaction
        if (nextDurability > maxTargetDur) {
          overflowDetected = true;
        }

        currentRunningDurability = nextDurability;
      }
    });

    const startingXp = Number(playerXpBefore) || 0;
    const finalBalance = Math.max(0, startingXp - totalCost);
    
    let displayDurability = currentDurability === "" ? "—" : (currentRunningDurability ?? baseDurability);

    return {
      totalXpCost: totalCost,
      playerXpAfter: finalBalance,
      finalToolDurability: displayDurability,
      // Block the transaction if total sum is greater than max target durability
      isDurabilityMaxed: overflowDetected || (typeof displayDurability === "number" && displayDurability >= maxTargetDur)
    };
  }, [lines, playerXpBefore, currentDurability, targetMaxDurability]);

  // Global validation flags
  const isXpDeficient = totalXpCost > (Number(playerXpBefore) || 0);

  const refreshLineDurabilities = (updatedLines, updatedCurrentDur, updatedTargetMax, updatedTargetName) => {
    const tMax = Number(updatedTargetMax) || 0;

    return updatedLines.map(line => {
      const hasSacrifice = !!line.sacrifice_item_id;
      let lineRestored = "";

      if (hasSacrifice) {
        const isSameItem = updatedTargetName && line.sacrifice_item_name && 
                           updatedTargetName.trim().toLowerCase() === line.sacrifice_item_name.trim().toLowerCase();

        if (isSameItem) {
          // Condition A: Same item bonus formula
          lineRestored = calculateRestored(line.sacrifice_max_durability, tMax, true);
        } else {
          // Condition B: Unit of repair (different item) flat 25% value
          lineRestored = Math.floor(0.25 * tMax);
        }
      }

      return {
        ...line,
        restored_durability: lineRestored
      };
    });
  };

  function updateLine(index, field, value) {
    setLines(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return refreshLineDurabilities(copy, currentDurability, targetMaxDurability, targetToolName);
    });
  }

  function addLine() {
    if (isXpDeficient) {
      toast.error("Your XP level is insufficient to add more items!");
      return;
    }
    setLines(prev => [...prev, emptyLine()]);
  }

  function removeLine(index) {
    setLines(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return refreshLineDurabilities(filtered, currentDurability, targetMaxDurability, targetToolName);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!playerUsername) return toast.error("Player user is required!");
    if (lines.length === 0) return toast.error("Please add at least one item modification line transaction row.");
    if (isXpDeficient) return toast.error("Too Expensive! You do not have enough XP Levels for this action configuration.");

    setSubmitting(true);
    setErr("");

    try {
      const payload = {
        anvil_date: anvilDate,
        player_username: playerUsername,
        total_xp_cost: Number(totalXpCost),
        player_xp_before: Number(playerXpBefore),
        player_xp_after: Number(playerXpAfter),
        line_items: lines.map((l, idx) => ({
          anvil_line_number: idx + 1,
          target_tool_id: targetToolId ? Number(targetToolId) : null,
          target_tool_name: targetToolName,
          target_max_durability: Number(targetMaxDurability),
          current_durability: currentDurability !== "" ? Number(currentDurability) : null,
          sacrifice_item_id: l.sacrifice_item_id ? Number(l.sacrifice_item_id) : null,
          sacrifice_item_name: l.sacrifice_item_name || null,
          sacrifice_max_durability: l.sacrifice_item_id ? Number(l.sacrifice_max_durability) : 0,
          restored_durability: l.restored_durability !== "" ? Number(l.restored_durability) : null,
          enchantment_id: l.enchantment_id ? Number(l.enchantment_id) : null,
          enchantment_name: l.enchantment_name || null,
          enchantment_max_level: l.enchantment_id ? Number(l.enchantment_max_level) : 0
        }))
      };

      if (mode === "create") {
        const res = await createAnvil(payload);
        toast.success("Anvil actions saved successfully!");
        nav(`/anvils/${res.id}`);
      } else {
        await updateAnvil(id, payload);
        toast.success("Anvil transaction updated successfully!");
        nav(`/anvils/${id}`);
      }
    } catch (error) {
      setErr(String(error.message || error));
      toast.error("Failed to save anvil transaction.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading size="large" />;

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  if (mode === "view" && viewData) {
    const h = viewData.header;          
    const lineItems = viewData.line_items || [];

    const lastRepairLine = [...lineItems].reverse().find(li => li.restored_durability !== null && li.restored_durability !== "");
    const initialStartingDur = lineItems[0]?.current_durability ?? "—";
    const viewFinalDurability = lastRepairLine ? lastRepairLine.restored_durability : initialStartingDur;
    const viewTargetMaxDurability = lineItems[0]?.target_max_durability || 0;

    return (
      <div className="invoice-preview">
        <div className="page-header no-print">
          <h3 className="page-title">Anvil Workorder #ANV-{h.id}</h3>
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
                <span className="font-bold">Previous XP Levels: </span> {h.player_xp_before} Levels
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
                    <td>{li.sacrifice_item_id ? (li.sacrifice_item_name || `Sacrifice Item #${li.sacrifice_item_id}`) : "—"}</td>
                    <td className="text-right font-bold" style={{ color: "var(--primary)" }}>{li.restored_durability ?? "—"}</td>
                    <td>{li.enchantment_id ? (li.enchantment_name || `Enchantment ID: ${li.enchantment_id}`) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1.25rem 1.75rem", 
              backgroundColor: "#f9fafb", 
              borderTop: "2px solid #e5e7eb", 
              borderRadius: "0 0 6px 6px",
              display: "flex", 
              justifyContent: "flex-end" 
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem 2.5rem", width: "320px", alignItems: "center" }}>
                <span style={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>Final Tool Durability:</span>
                <span style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: "600", color: "var(--primary)" }}>
                  {viewFinalDurability} {viewTargetMaxDurability > 0 && typeof viewFinalDurability === "number" ? `/ ${viewTargetMaxDurability}` : ""}
                </span>
                
                <span style={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>Total XP Cost:</span>
                <span style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: "600", color: "#ef4444" }}>
                  {h.total_xp_cost ?? 0} XP Levels
                </span>
                
                <span style={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>Player's Final XP Balance:</span>
                <span style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: "600", color: "#10b981" }}>
                  {h.player_xp_after ?? 0} XP Levels
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── CREATE / EDIT MODE ─────────────────────────────────────────────────────
  return (
    <div>
      <PlayerPickerModal 
        isOpen={playerModalOpen} 
        onClose={() => setPlayerModalOpen(false)} 
        onSelect={(p) => {
          setPlayerId(p.id);
          setPlayerUsername(p.username);
          setPlayerXpBefore(p.current_xp_level ?? 0); 
        }} 
      />
      
      <ItemPickerModal isOpen={targetToolModalOpen} onClose={() => setTargetToolModalOpen(false)} allowedTypes={["Tool"]} onSelect={(item) => {
          setTargetToolId(item.id);
          setTargetToolName(item.item_name);
          setTargetMaxDurability(Number(item.max_durability) || 0);
          setLines(prev => refreshLineDurabilities(prev, currentDurability, Number(item.max_durability) || 0, item.item_name));
      }} />

      <ItemPickerModal isOpen={sacrificeItemModalOpen} onClose={() => setSacrificeItemModalOpen(false)} allowedTypes={["Tool", "Ingredient"]} onSelect={(item) => {
          setLines(prev => {
            const copy = [...prev];
            copy[activeLineIdx].sacrifice_item_id = item.id;
            copy[activeLineIdx].sacrifice_item_name = item.item_name;
            copy[activeLineIdx].sacrifice_max_durability = Number(item.max_durability) || 0;
            return refreshLineDurabilities(copy, currentDurability, targetMaxDurability, targetToolName);
          });
      }} />

      <EnchantmentPickerModal isOpen={enchantmentModalOpen} onClose={() => setEnchantmentModalOpen(false)} onSelect={(ench) => {
          setLines(prev => {
            const copy = [...prev];
            copy[activeLineIdx].enchantment_id = ench.id;
            copy[activeLineIdx].enchantment_name = ench.enchantment_name;
            copy[activeLineIdx].enchantment_max_level = Number(ench.enchantment_max_level) || 0;
            return copy;
          });
      }} />

      <div className="page-header">
        <h3 className="page-title">{mode === "create" ? "New Anvil Record" : `Edit Anvil Interaction #ANV-${id}`}</h3>
        <Link to="/anvils" className="btn btn-outline">← Back</Link>
      </div>

      {err && <div className="alert alert-error">{err}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h4>Anvil Session Details</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            
            <div className="form-group" style={{ gridColumn: "1" }}>
              <label className="form-label">Date <span className="required-marker">*</span></label>
              <input type="date" className="form-control" value={anvilDate} onChange={(e) => setAnvilDate(e.target.value)} required />
            </div>
            <div style={{ gridColumn: "2" }}></div>
            
            <div className="form-group" style={{ gridColumn: "1" }}>
              <label className="form-label">Player Username <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={playerUsername} placeholder="Select Player Username..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
                {playerId && <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { setPlayerId(""); setPlayerUsername(""); setPlayerXpBefore("");}}>×</button>}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: "2" }}>
              <label className="form-label">Player's Current XP Level</label>
              <input type="number" className="form-control" style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }} value={playerXpBefore} 
                readOnly 
                disabled
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1" }}>
              <label className="form-label">Target Tool <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={targetToolName || ""} placeholder="Select Tool..." readOnly required/>
                <button type="button" className="btn btn-primary" onClick={() => setTargetToolModalOpen(true)}>LoV</button>
                {targetToolId && <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { setTargetToolId(""); setTargetToolName(""); setTargetMaxDurability(0); setCurrentDurability(""); setLines(prev => refreshLineDurabilities(prev, "", 0, "")); }}>×</button>}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: "2" }}>
              <label className="form-label">Current Durability <span className="required-marker">*</span></label>
              <input type="number" min="0" className="form-control" style={{ textAlign: "right" }} value={currentDurability} 
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentDurability(val);
                  setLines(prev => refreshLineDurabilities(prev, val, targetMaxDurability, targetToolName));
                }} 
                required
              />
            </div>

          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h4 style={{ margin: 0 }}>Tool Modification</h4>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={addLine}
              disabled={lines.length >= 5 || isXpDeficient}
              style={(lines.length >= 5 || isXpDeficient) ? { cursor: "not-allowed", opacity: 0.5 } : {}}
            >
              {lines.length >= 5 ? "Max Items Added" : isXpDeficient ? "Insufficient XP" : "+ Add Item"}
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>Line</th>
                  <th>Sacrificed Item</th>
                  <th style={{ width: "120px" }}>Restored Durability</th>
                  <th>Enchantment</th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => {
                  const hasSelectionOnRow = !!line.sacrifice_item_id || !!line.enchantment_id;
                  
                  // Global XP lockdown applies if player has a negative level balance
                  const isRowLockedByXp = isXpDeficient && !hasSelectionOnRow;

                  // ✨ FIX: Decoupled selection blocks. 
                  // If durability is maxed out, only the sacrifice field locks down. 
                  // The enchantment column remains unlocked unless an item is already selected on this row.
                  const isSacrificeDisabled = !!line.enchantment_id || isRowLockedByXp || (isDurabilityMaxed && !line.sacrifice_item_id);
                  const isEnchantmentDisabled = !!line.sacrifice_item_id || isRowLockedByXp;

                  return (
                    <tr key={idx}>
                      <td style={{ textAlign: "center", fontWeight: "600", color: "var(--text-muted)", verticalAlign: "middle" }}>
                        {idx + 1}
                      </td>
                      
                      {/* Sacrifice Column */}
                      <td>
                        <div style={{ display: "flex", gap: 4, opacity: isSacrificeDisabled ? 0.5 : 1 }}>
                          <input 
                            className="form-control" 
                            value={line.sacrifice_item_name || ""} 
                            placeholder={
                              !!line.enchantment_id 
                                ? "Enchantment Already Selected..." 
                                : isDurabilityMaxed 
                                ? "Tool Durability Maxed..." 
                                : isRowLockedByXp 
                                ? "XP Deficit Locked..." 
                                : "Select Item..."
                            } 
                            disabled={isSacrificeDisabled}
                            readOnly 
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            style={{ padding: "4px 8px", cursor: isSacrificeDisabled ? "not-allowed" : "pointer" }} 
                            onClick={() => { if (!isSacrificeDisabled) { setActiveLineIdx(idx); setSacrificeItemModalOpen(true); } }}
                            disabled={isSacrificeDisabled}
                          >
                            LoV
                          </button>
                          {line.sacrifice_item_id && (
                            <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { setLines(prev => { const c = [...prev]; c[idx].sacrifice_item_id = ""; c[idx].sacrifice_item_name = ""; c[idx].sacrifice_max_durability = 0; return refreshLineDurabilities(c, currentDurability, targetMaxDurability, targetToolName); }); }}>×</button>
                          )}
                        </div>
                      </td>

                      {/* Restored Durability Output */}
                      <td>
                        <input 
                          type="text" 
                          className="form-control" 
                          style={{ textAlign: "right", backgroundColor: "#f3f4f6", cursor: "not-allowed", fontWeight: "bold", opacity: isSacrificeDisabled ? 0.5 : 1 }} 
                          value={line.restored_durability} 
                          placeholder="—"
                          readOnly 
                          disabled 
                        />
                      </td>

                      {/* Enchantment Column */}
                      <td>
                        <div style={{ display: "flex", gap: 4, opacity: isEnchantmentDisabled ? 0.5 : 1 }}>
                          <input 
                            className="form-control" 
                            value={line.enchantment_name || ""} 
                            placeholder={
                              !!line.sacrifice_item_id 
                                ? "Sacrifice Item Already Selected..." 
                                : isRowLockedByXp 
                                ? "XP Deficit Locked..." 
                                : "Select Enchantment..."
                            } 
                            disabled={isEnchantmentDisabled}
                            readOnly 
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            style={{ padding: "4px 8px", cursor: isEnchantmentDisabled ? "not-allowed" : "pointer" }} 
                            onClick={() => { if (!isEnchantmentDisabled) { setActiveLineIdx(idx); setEnchantmentModalOpen(true); } }}
                            disabled={isEnchantmentDisabled}
                          >
                            LoV
                          </button>
                          {line.enchantment_id && (
                            <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => { updateLine(idx, "enchantment_id", ""); updateLine(idx, "enchantment_name", ""); updateLine(idx, "enchantment_max_level", 0); }}>×</button>
                          )}
                        </div>
                      </td>

                      <td className="text-center">
                        <button type="button" className="btn btn-outline" style={{ padding: "4px 8px", color: "#ef4444", borderColor: "#ef4444", fontSize: "0.75rem" }} onClick={() => removeLine(idx)}>Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1.25rem 1.75rem", 
            backgroundColor: "#f9fafb", 
            borderTop: "2px solid #e5e7eb", 
            borderRadius: "0 0 6px 6px",
            display: "flex", 
            justifyContent: "flex-end" 
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem 2.5rem", width: "320px", alignItems: "center" }}>
              <span style={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>Final Tool Durability:</span>
              <span style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: "600", color: isDurabilityMaxed ? "#10b981" : "var(--primary)" }}>
                {finalToolDurability} {targetMaxDurability > 0 && typeof finalToolDurability === "number" ? `/ ${targetMaxDurability}` : ""}
              </span>
              
              <span style={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>Total XP Cost:</span>
              <span style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: "600", color: "#ef4444" }}>
                {totalXpCost} XP Levels
              </span>
              
              <span style={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 500 }}>Player's Final XP Balance:</span>
              <span style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: "600", color: isXpDeficient ? "#ef4444" : "#10b981" }}>
                {isXpDeficient ? "Too Expensive!" : `${playerXpAfter} XP Levels`}
              </span>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting || isXpDeficient}
              style={isXpDeficient ? { cursor: "not-allowed", opacity: 0.5 } : {}}
            >
              {submitting ? "Saving..." : isXpDeficient ? "Insufficient XP Level" : (mode === "create" ? "Save Anvil Record" : "Update Anvil Record")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}