import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSmelting, createSmelting, updateSmelting } from "../../api/smeltings.api.js";

// Import our reusable LoV Pickers
import PlayerPickerModal from "../../components/pickers/PlayerPickerModal.jsx";
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";

export default function SmeltingsPage({ mode: propMode }) {
  const { id } = useParams(); // actually the smelting_code from URL
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [autoCode, setAutoCode] = React.useState(true);
  const [form, setForm] = React.useState({
    smelting_code: "",
    smelt_date: "",
    player_id: "",
    furnace_location_xyz: "",
    line_items: []
  });

  const [playerLabel, setPlayerLabel] = React.useState("");
  
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create"); 

  // Modal open states
  const [playerModalOpen, setPlayerModalOpen] = React.useState(false);
  const [rawOreModalOpen, setRawOreModalOpen] = React.useState(false);
  const [fuelUsedModalOpen, setFuelUsedModalOpen] = React.useState(false);
  const [outputItemModalOpen, setOutputItemModalOpen] = React.useState(false);
  const [activeLineIdx, setActiveLineIdx] = React.useState(null);

  React.useEffect(() => {
    if (mode === "create") {
      const today = new Date().toISOString().slice(0, 10);
      setForm((f) => ({ ...f, smelt_date: today }));
      return;
    }
    
    getSmelting(id)
      .then((s) => {
        if (s) {
          const dateVal = s.smelt_date ? new Date(s.smelt_date).toISOString().slice(0, 10) : "";
          setForm({ 
            smelting_code: s.smelting_code || "",
            smelt_date: dateVal, 
            player_id: s.player_id, 
            furnace_location_xyz: s.furnace_location_xyz, 
            line_items: s.line_items || [] 
          });
          setPlayerLabel(s.player_name ? `Player #${s.player_id} (${s.player_name})` : `Player #${s.player_id}`);
        } else {
          setErr("Smelting Job not found");
        }
      })
      .catch((e) => setErr(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addLineItem = () => {
    setForm((f) => ({
      ...f,
      line_items: [
        ...f.line_items, 
        { 
          raw_input_item_id: "", 
          raw_input_item_name: "", 
          quantity_inserted: "", 
          fuel_item_id: "", 
          fuel_item_name: "", 
          fuel_consumed: "", 
          output_item_id: "", 
          output_item_name: "", 
          output_quantity: "" 
        }
      ]
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    setForm((f) => {
      const newLineItems = [...f.line_items];
      newLineItems[index][field] = value;
      return { ...f, line_items: newLineItems };
    });
  };

  const removeLineItem = (index) => {
    setForm((f) => ({
      ...f,
      line_items: f.line_items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); 
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        smelting_code: mode === "create" && autoCode ? "" : form.smelting_code.trim(),
        line_items: form.line_items.map(item => ({
          raw_input_item_id: Number(item.raw_input_item_id),
          quantity_inserted: Number(item.quantity_inserted),
          fuel_item_id: Number(item.fuel_item_id),
          fuel_consumed: Number(item.fuel_consumed),
          output_item_id: Number(item.output_item_id),
          output_quantity: Number(item.output_quantity)
        }))
      };

      if (mode === "create") await createSmelting(payload);
      else await updateSmelting(id, payload);
      
      toast.success(`Smelting Job ${mode === "create" ? "created" : "updated"}.`);
      nav("/smeltings");
    } catch (e) { 
      setErr(String(e.message || e)); 
      toast.error(String(e.message || e));
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PlayerPickerModal isOpen={playerModalOpen} onClose={() => setPlayerModalOpen(false)} onSelect={(p) => { setForm(f => ({ ...f, player_id: p.id })); setPlayerLabel(`Player #${p.id} (${p.username})`); }} />

      <ItemPickerModal isOpen={rawOreModalOpen} onClose={() => setRawOreModalOpen(false)} onSelect={(item) => {
          handleLineItemChange(activeLineIdx, "raw_input_item_id", item.id);
          handleLineItemChange(activeLineIdx, "raw_input_item_name", item.item_name);
      }} />

      <ItemPickerModal isOpen={fuelUsedModalOpen} onClose={() => setFuelUsedModalOpen(false)} onSelect={(item) => {
          handleLineItemChange(activeLineIdx, "fuel_item_id", item.id);
          handleLineItemChange(activeLineIdx, "fuel_item_name", item.item_name);
      }} />     

      <ItemPickerModal isOpen={outputItemModalOpen} onClose={() => setOutputItemModalOpen(false)} onSelect={(item) => {
          handleLineItemChange(activeLineIdx, "output_item_id", item.id);
          handleLineItemChange(activeLineIdx, "output_item_name", item.item_name);
      }} />     

      <div className="page-header">
        <h3 className="page-title">{ mode === "create" ? "Register Smelting Job" : "Edit Smelting Job" }</h3>
        <Link to="/smeltings" className="btn btn-outline">← Back</Link>
      </div>
      
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          
          <h4 style={{ marginBottom: "1.5rem", color: "inherit" }}>Job Details</h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div className="form-group">
              <label className="form-label">Smelting Code <span className="required-marker">*</span></label>
              <div className="flex gap-2">
                <input
                  className="form-control"
                  name="smelting_code"
                  disabled={mode === "create" ? autoCode : true}
                  placeholder="e.g. SML-016"
                  value={form.smelting_code}
                  onChange={handleChange}
                  required={!autoCode}
                />
                {mode === "create" && (
                  <div className="form-inline-option" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <input type="checkbox" checked={autoCode} onChange={(e) => setAutoCode(e.target.checked)} id="s_auto" />
                    <label htmlFor="s_auto" style={{ margin: 0 }}>Auto</label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Smelt Date <span className="required-marker">*</span></label>
              <input type="date" className="form-control" name="smelt_date" value={form.smelt_date} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Player <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={playerLabel || form.player_id} placeholder="Select Player..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Furnace Location (X,Y,Z) <span className="required-marker">*</span></label>
              <input type="text" className="form-control" name="furnace_location_xyz" placeholder="100,64,250" value={form.furnace_location_xyz} onChange={handleChange} required />
            </div>
          </div>

          <hr style={{ margin: "2rem 0", border: "0", borderTop: "1px solid rgba(0,0,0,0.1)" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ margin: 0, color: "inherit" }}>Smelted Items</h4>
              <button type="button" className="btn btn-outline" onClick={addLineItem}>+ Add Item</button>
          </div>

          {form.line_items.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "4px", marginBottom: "1.5rem" }}>
                  No items added yet. Click "+ Add Item".
              </div>
          ) : (
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                      <thead>
                          <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)", textAlign: "left" }}>
                              <th style={{ padding: "0.5rem" }}>Raw Ore</th>
                              <th style={{ padding: "0.5rem", width: "90px" }}>Qty In</th>
                              <th style={{ padding: "0.5rem" }}>Fuel Used</th>
                              <th style={{ padding: "0.5rem", width: "90px" }}>Fuel Qty</th>
                              <th style={{ padding: "0.5rem" }}>Output Item</th>
                              <th style={{ padding: "0.5rem", width: "90px" }}>Qty Out</th>
                              <th style={{ padding: "0.5rem", width: "80px", textAlign: "center" }}>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {form.line_items.map((item, index) => (
                              <tr key={index} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                                  <td style={{ padding: "0.5rem" }}>
                                      <div style={{ display: "flex", gap: 8 }}>
                                          <input className="form-control" value={item.raw_input_item_name || ""} placeholder="Select Ore..." readOnly required />
                                          <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(index); setRawOreModalOpen(true); }}>LoV</button>
                                      </div>
                                  </td>
                                  <td style={{ padding: "0.5rem" }}>
                                      <input type="number" className="form-control" placeholder="0" value={item.quantity_inserted} onChange={(e) => handleLineItemChange(index, "quantity_inserted", e.target.value)} required />
                                  </td>
                                  
                                  <td style={{ padding: "0.5rem" }}>
                                      <div style={{ display: "flex", gap: 8 }}>
                                          <input className="form-control" value={item.fuel_item_name || ""} placeholder="Select Fuel..." readOnly required />
                                          <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(index); setFuelUsedModalOpen(true); }}>LoV</button>
                                      </div>
                                  </td>
                                  <td style={{ padding: "0.5rem" }}>
                                      <input type="number" className="form-control" placeholder="0" value={item.fuel_consumed} onChange={(e) => handleLineItemChange(index, "fuel_consumed", e.target.value)} required />
                                  </td>

                                  <td style={{ padding: "0.5rem" }}>
                                      <div style={{ display: "flex", gap: 8 }}>
                                          <input className="form-control" value={item.output_item_name || ""} placeholder="Select Output..." readOnly required />
                                          <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(index); setOutputItemModalOpen(true); }}>LoV</button>
                                      </div>
                                  </td>
                                  <td style={{ padding: "0.5rem" }}>
                                      <input type="number" className="form-control" placeholder="0" value={item.output_quantity} onChange={(e) => handleLineItemChange(index, "output_quantity", e.target.value)} required />
                                  </td>
                                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                                      <button type="button" className="btn btn-outline" style={{ color: "red", borderColor: "red", padding: "0.25rem 0.5rem" }} onClick={() => removeLineItem(index)}>Delete</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : (mode === "create" ? "Register Smelting Job" : "Update Smelting Job")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}