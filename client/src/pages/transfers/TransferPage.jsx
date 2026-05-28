import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getTransfer, createTransfer, updateTransfer } from "../../api/transfers.api.js";
import { formatDate } from "../../utils.js";
import Loading from "../../components/Loading.jsx";

// Import our new LoV Pickers
import PlayerPickerModal from "../../components/pickers/PlayerPickerModal.jsx";
import ChestPickerModal from "../../components/pickers/ChestPickerModal.jsx";
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";

function emptyLine() {
  return { item_id: "", item_name: "", quantity_transferred: 1, destination_slot_number: 1 };
}

export default function TransferPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  // Form State (includes labels for display, since inputs are read-only)
  const [transferDate, setTransferDate] = React.useState(new Date().toISOString().slice(0, 10));
  
  const [playerUsername, setPlayerUsername] = React.useState("");
  
  const [sourceChestId, setSourceChestId] = React.useState("");
  const [sourceChestLabel, setSourceChestLabel] = React.useState("");
  
  const [destinationChestId, setDestinationChestId] = React.useState("");
  const [destinationChestLabel, setDestinationChestLabel] = React.useState("");
  
  const [lines, setLines] = React.useState([emptyLine()]);

  // View State & UI State
  const [viewData, setViewData] = React.useState(null);
  const [loading, setLoading] = React.useState(mode !== "create");
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState("");

  // Modal LoV states
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [srcChestModalOpen, setSrcChestModalOpen] = React.useState(false);
  const [dstChestModalOpen, setDstChestModalOpen] = React.useState(false);
  const [itemModalOpen, setItemModalOpen] = React.useState(false);
  const [activeLineIdx, setActiveLineIdx] = React.useState(null);

  React.useEffect(() => {
    if (mode === "create") return;
    
    getTransfer(id)
      .then((t) => {
        if (!t) { setErr("Transfer not found."); return; }
        setViewData(t);

        if (mode === "edit") {
          setTransferDate(t.header.transfer_date ? new Date(t.header.transfer_date).toISOString().slice(0, 10) : "");
          setPlayerUsername(t.header.player_username || "");
          
          setSourceChestId(t.header.source_chest_id || "");
          setSourceChestLabel(t.header.source_chest_id ? `Chest #${t.header.source_chest_id} (${t.header.src_dim})` : "");
          
          setDestinationChestId(t.header.destination_chest_id || "");
          setDestinationChestLabel(t.header.destination_chest_id ? `Chest #${t.header.destination_chest_id} (${t.header.dst_dim})` : "");
          
          if (t.line_items && t.line_items.length > 0) {
            setLines(t.line_items.map(li => ({
              item_id: li.item_id,
              item_name: li.item_name,
              quantity_transferred: li.quantity_transferred,
              destination_slot_number: li.destination_slot_number
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
    if (!playerUsername) return toast.error("Player is required!");
    if (lines.length === 0) return toast.error("Please add at least one item to transfer.");
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].item_id) return toast.error(`Please select an item for row ${i + 1}`);
    }

    setSubmitting(true);
    setErr("");

    try {
      const payload = {
        transfer_date: transferDate,
        player_username: playerUsername,
        source_chest_id: sourceChestId ? Number(sourceChestId) : null,
        destination_chest_id: destinationChestId ? Number(destinationChestId) : null,
        line_items: lines.map(l => ({
          item_id: Number(l.item_id),
          quantity_transferred: Number(l.quantity_transferred),
          destination_slot_number: Number(l.destination_slot_number)
        }))
      };

      if (mode === "create") {
        const res = await createTransfer(payload);
        toast.success("Transfer created successfully!");
        nav(`/transfers/${res.id}`);
      } else {
        await updateTransfer(id, payload);
        toast.success("Transfer updated successfully!");
        nav(`/transfers/${id}`);
      }
    } catch (error) {
      setErr(String(error.message || error));
      toast.error("Failed to save transfer.");
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
          <h3 className="page-title">Transfer Record #TRN-{h.id}</h3>
          <div className="flex gap-4">
            <Link to="/transfers" className="btn btn-outline">← Back</Link>
            <Link to={`/transfers/${h.id}/edit`} className="btn btn-outline">Edit</Link>
            <button onClick={() => window.print()} className="btn btn-primary">Print Record</button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between mb-4">
            <div>
              <div className="brand mb-4">CraftLess Inventory</div>
              <div className="font-bold" style={{ color: "var(--primary)", fontSize: "1.2rem" }}>
                Player: {h.player_username}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <span className="font-bold">From: </span> 
                {h.source_chest_id ? `Chest #${h.source_chest_id} (${h.src_dim} | X:${h.src_x}, Y:${h.src_y}, Z:${h.src_z})` : "Player Inventory"}
              </div>
              <div>
                <span className="font-bold">To: </span> 
                {h.destination_chest_id ? `Chest #${h.destination_chest_id} (${h.dst_dim} | X:${h.dst_x}, Y:${h.dst_y}, Z:${h.dst_z})` : "Player Inventory"}
              </div>
            </div>
            <div className="text-right">
              <h2 className="mb-4">TRANSFER</h2>
              <div><span className="font-bold">Date:</span> {formatDate(h.transfer_date)}</div>
              <div><span className="font-bold">Record ID:</span> TRN-{h.id}</div>
              <div style={{ marginTop: "1rem", display: "inline-block", padding: "4px 12px", background: "#f3f4f6", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>
                {lineItems.length} Items Moved
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Item Moved</th>
                  <th>Item Type</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Destination Slot</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((li) => (
                  <tr key={li.id}>
                    <td style={{ fontWeight: 600 }}>{li.item_name}</td>
                    <td>{li.item_type}</td>
                    <td className="text-right font-bold" style={{ color: "var(--primary)" }}>{li.quantity_transferred}x</td>
                    <td className="text-right">Slot {li.destination_slot_number}</td>
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
      <ChestPickerModal isOpen={srcChestModalOpen} onClose={() => setSrcChestModalOpen(false)} onSelect={(c) => { setSourceChestId(c.id); setSourceChestLabel(`Chest #${c.id} (${c.dimension})`); }} />
      <ChestPickerModal isOpen={dstChestModalOpen} onClose={() => setDstChestModalOpen(false)} onSelect={(c) => { setDestinationChestId(c.id); setDestinationChestLabel(`Chest #${c.id} (${c.dimension})`); }} />
      <ItemPickerModal isOpen={itemModalOpen} onClose={() => setItemModalOpen(false)} onSelect={(item) => {
          updateLine(activeLineIdx, "item_id", item.id);
          updateLine(activeLineIdx, "item_name", item.item_name);
      }} />

      <div className="page-header">
        <h3 className="page-title">{mode === "create" ? "Record New Transfer" : `Edit Transfer #TRN-${id}`}</h3>
        <Link to="/transfers" className="btn btn-outline">← Back</Link>
      </div>

      {err && <div className="alert alert-error">{err}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h4>Transfer Details</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            
            <div className="form-group">
              <label className="form-label">Transfer Date <span className="required-marker">*</span></label>
              <input type="date" className="form-control" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Player <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={playerUsername} placeholder="Select Player..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Source Chest (Empty = Player Inventory)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={sourceChestLabel || "-- Player Inventory --"} readOnly />
                <button type="button" className="btn btn-primary" onClick={() => setSrcChestModalOpen(true)}>LoV</button>
                {sourceChestId && <button type="button" className="btn btn-outline" onClick={() => { setSourceChestId(""); setSourceChestLabel(""); }}>×</button>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Destination Chest (Empty = Player Inventory)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={destinationChestLabel || "-- Player Inventory --"} readOnly />
                <button type="button" className="btn btn-primary" onClick={() => setDstChestModalOpen(true)}>LoV</button>
                {destinationChestId && <button type="button" className="btn btn-outline" onClick={() => { setDestinationChestId(""); setDestinationChestLabel(""); }}>×</button>}
              </div>
            </div>

          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h4 style={{ margin: 0 }}>Items Transferred</h4>
            <button type="button" className="btn btn-outline" onClick={() => setLines(prev => [...prev, emptyLine()])}>+ Add Item</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Item <span className="required-marker">*</span></th>
                  <th className="text-right" style={{ width: "150px" }}>Quantity <span className="required-marker">*</span></th>
                  <th className="text-right" style={{ width: "150px" }}>Dest. Slot <span className="required-marker">*</span></th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="form-control" value={line.item_name || ""} placeholder="Select an Item..." readOnly required />
                        <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(idx); setItemModalOpen(true); }}>LoV</button>
                      </div>
                    </td>
                    <td className="text-right">
                      <input type="number" min="1" className="form-control" style={{ textAlign: "right" }} value={line.quantity_transferred} onChange={(e) => updateLine(idx, "quantity_transferred", e.target.value)} required />
                    </td>
                    <td className="text-right">
                      <input type="number" min="1" max="27" className="form-control" style={{ textAlign: "right" }} value={line.destination_slot_number} onChange={(e) => updateLine(idx, "destination_slot_number", e.target.value)} required />
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
              {submitting ? "Saving..." : (mode === "create" ? "Save Transfer Record" : "Update Transfer Record")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}