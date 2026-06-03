import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMining, createMining, updateMining } from "../../api/minings.api.js";
import { formatDate } from "../../utils.js";
import Loading from "../../components/Loading.jsx";

// Import our new LoV Pickers
import PlayerPickerModal from "../../components/pickers/PlayerPickerModal.jsx";
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";

function emptyLine() {
  return { block_mined_id: "", quantity_mined: 1, tool_used_id: "", durability_lost: 1, tool_status: "Usable" };
}

export default function MiningPage({ mode: propMode }) {
  const { id } = useParams(); // actually the mining_code from URL
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  // Form State
  const [autoCode, setAutoCode] = React.useState(true);
  const [miningCode, setMiningCode] = React.useState("");
  const [miningDate, setMiningDate] = React.useState(new Date().toISOString().slice(0, 10));
  
  const [playerID, setPlayerID] = React.useState("");
  const [playerLabel, setPlayerLabel] = React.useState("");
  const [biome, setBiome] = React.useState("");
  
  const [lines, setLines] = React.useState([emptyLine()]);

  // View State & UI State
  const [viewData, setViewData] = React.useState(null);
  const [loading, setLoading] = React.useState(mode !== "create");
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState("");

  // Modal LoV states
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [blockMinedModalOpen, setBlockMinedModalOpen] = React.useState(false);
  const [toolUsedModalOpen, setToolUsedModalOpen] = React.useState(false);
  const [activeLineIdx, setActiveLineIdx] = React.useState(null);

  React.useEffect(() => {
    if (mode === "create") return;
    
    getMining(id)
      .then((m) => {
        if (!m) { setErr("Mining trip not found."); return; }
        setViewData(m);

        if (mode === "edit") {
          setMiningCode(m.header.mining_code || "");
          setMiningDate(m.header.mining_date ? new Date(m.header.mining_date).toISOString().slice(0, 10) : "");
          setPlayerID(m.header.player_id || "");
          setPlayerLabel(m.header.player_username ? `Player #${m.header.player_id} (${m.header.player_username})` : `Player #${m.header.player_id}`);
          setBiome(m.header.biome_name || "");
          
          if (m.line_items && m.line_items.length > 0) {
            setLines(m.line_items.map(li => ({
              block_mined_id: li.block_mined_id,
              block_mined_name: li.block_mined_name,
              quantity_mined: li.quantity_mined, 
              tool_used_id: li.tool_used_id,
              tool_used_name: li.tool_used_name || "Hands",
              durability_lost: li.durability_lost,
              tool_status: li.tool_status
            })));
          }
        }
      })
      .catch((error) => setErr(String(error.message || error)))
      .finally(() => setLoading(false));
  }, [id, mode]);

  function updateLine(index, field, value) {
    setLines(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function removeLine(index) {
    setLines(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!playerID) return toast.error("Player is required!");
    if (lines.length === 0) return toast.error("Please add at least one block mined.");
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].block_mined_id) return toast.error(`Please select a block for row ${i + 1}`);
    }

    setSubmitting(true);
    setErr("");

    try {
      const payload = {
        mining_code: mode === "create" && autoCode ? "" : miningCode.trim(),
        mining_date: miningDate,
        player_id: Number(playerID),
        biome_name: biome,
        line_items: lines.map(l => ({
          block_mined_id: Number(l.block_mined_id),
          quantity_mined: Number(l.quantity_mined),
          tool_used_id: l.tool_used_id ? Number(l.tool_used_id) : null,
          durability_lost: Number(l.durability_lost),
          tool_status: l.tool_status || "Usable"
        }))
      };

      if (mode === "create") {
        const res = await createMining(payload);
        toast.success("Mining trip created successfully!");
        nav(`/minings/${res.mining_code}`);
      } else {
        const res = await updateMining(id, payload);
        toast.success("Mining trip updated successfully!");
        nav(`/minings/${res.mining_code}`);
      }
    } catch (error) {
      setErr(String(error.message || error));
      toast.error("Failed to save mining trip.");
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
          <h3 className="page-title">Mining Record {h.mining_code}</h3>
          <div className="flex gap-4">
            <Link to="/minings" className="btn btn-outline">← Back</Link>
            <Link to={`/minings/${h.mining_code}/edit`} className="btn btn-outline">Edit</Link>
            <button onClick={() => window.print()} className="btn btn-primary">Print Record</button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between mb-4">
            <div>
              <div className="brand mb-4">CraftLess Inventory</div>
              <div className="font-bold">
                Player: {h.player_username || `Player #${h.player_id}`}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <span className="font-bold">Biome: </span> 
                {h.biome_name}
              </div>
            </div>
            <div className="text-right">
              <h2 className="mb-4">Mining Trip</h2>
              <div><span className="font-bold">Date:</span> {formatDate(h.mining_date)}</div>
              <div><span className="font-bold">Record Code:</span> {h.mining_code}</div>
              <div style={{ marginTop: "1rem", display: "inline-block", padding: "4px 12px", background: "#f3f4f6", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>
                {lineItems.reduce((totalBlocks, lineItem) => totalBlocks + parseInt(lineItem.quantity_mined, 10), 0)} Blocks Mined
              </div> 
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Block Mined</th>
                  <th className="text-right">Qty Mined</th>
                  <th>Tool Used</th>
                  <th className="text-right">Durability Lost</th>
                  <th>Tool Status</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((li) => (
                  <tr key={li.id}>
                    <td style={{ fontWeight: 600 }}>{li.block_mined_name}</td>
                    <td className="text-right font-bold" style={{ color: "var(--primary)" }}>{li.quantity_mined}x</td>
                    <td>{li.tool_used_name || "Hands"}</td>
                    <td className="text-right font-bold" style={{ color: "red" }}>-{li.durability_lost}</td>
                    <td>{li.tool_status}</td>
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
      <PlayerPickerModal isOpen={playerModalOpen} onClose={() => setPlayerModalOpen(false)} onSelect={(p) => { setPlayerID(p.id); setPlayerLabel(`Player #${p.id} (${p.username})`); }} />

      <ItemPickerModal isOpen={blockMinedModalOpen} onClose={() => setBlockMinedModalOpen(false)} onSelect={(item) => {
          updateLine(activeLineIdx, "block_mined_id", item.id);
          updateLine(activeLineIdx, "block_mined_name", item.item_name);
      }} />

      <ItemPickerModal isOpen={toolUsedModalOpen} onClose={() => setToolUsedModalOpen(false)} onSelect={(item) => {
          updateLine(activeLineIdx, "tool_used_id", item.id);
          updateLine(activeLineIdx, "tool_used_name", item.item_name);
      }} />     

      <div className="page-header">
        <h3 className="page-title">{mode === "create" ? "Record New Mining Trip" : `Edit Mining Trip ${id}`}</h3>
        <Link to="/minings" className="btn btn-outline">← Back</Link>
      </div>

      {err && <div className="alert alert-error">{err}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h4>Mining Details</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            
            <div className="form-group">
              <label className="form-label">Mining Code <span className="required-marker">*</span></label>
              <div className="flex gap-2">
                <input
                  className="form-control"
                  disabled={mode === "create" ? autoCode : true}
                  placeholder="e.g. MIN-016"
                  value={miningCode}
                  onChange={(e) => setMiningCode(e.target.value)}
                  required={!autoCode}
                />
                {mode === "create" && (
                  <div className="form-inline-option">
                    <input type="checkbox" checked={autoCode} onChange={(e) => setAutoCode(e.target.checked)} id="m_auto" />
                    <label htmlFor="m_auto">Auto</label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mining Date <span className="required-marker">*</span></label>
              <input type="date" className="form-control" value={miningDate} onChange={(e) => setMiningDate(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Player <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={playerLabel || playerID} placeholder="Select Player..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Biome <span className="required-marker">*</span></label>
              <input className="form-control" name="biome" value={biome} onChange={(e) => setBiome(e.target.value)} placeholder="Biome name..." required />
            </div>

          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h4 style={{ margin: 0 }}>Blocks Mined</h4>
            <button type="button" className="btn btn-outline" onClick={() => setLines(prev => [...prev, emptyLine()])}>+ Add Item</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Block Mined <span className="required-marker">*</span></th>
                  <th className="text-right" style={{ width: "150px" }}>Quantity <span className="required-marker">*</span></th>
                  <th>Tool Used</th>
                  <th className="text-right" style={{ width: "150px" }}>Durability Lost <span className="required-marker">*</span></th>
                  <th>Tool Status <span className="required-marker">*</span></th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="form-control" value={line.block_mined_name || ""} placeholder="Select a block..." readOnly required />
                        <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(idx); setBlockMinedModalOpen(true); }}>LoV</button>
                      </div>
                    </td>
                    <td className="text-right">
                      <input type="number" min="1" className="form-control" style={{ textAlign: "right" }} value={line.quantity_mined} onChange={(e) => updateLine(idx, "quantity_mined", e.target.value)} required />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="form-control" value={line.tool_used_name || ""} placeholder="Select a Tool..." readOnly />
                        <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(idx); setToolUsedModalOpen(true); }}>LoV</button>
                        {line.tool_used_id && <button type="button" className="btn btn-outline" onClick={() => { updateLine(idx, "tool_used_id", ""); updateLine(idx, "tool_used_name", ""); }}>×</button>}
                      </div>
                    </td>                    
                    <td className="text-right">
                      <input type="number" min="0" className="form-control" style={{ textAlign: "right" }} value={line.durability_lost} onChange={(e) => updateLine(idx, "durability_lost", e.target.value)} required />
                    </td>
                    <td>
                      <select 
                        className="form-control" 
                        value={line.tool_status || "Usable"} 
                        onChange={(e) => updateLine(idx, "tool_status", e.target.value)} required
                      >
                        <option value="Usable">Usable</option>
                        <option value="Broken">Broken</option>
                      </select>
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
              {submitting ? "Saving..." : (mode === "create" ? "Save Mining Record" : "Update Mining Record")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}