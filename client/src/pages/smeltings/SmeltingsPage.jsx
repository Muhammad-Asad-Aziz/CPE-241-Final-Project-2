import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSmelting, createSmelting, updateSmelting } from "../../api/smeltings.api.js";
import { listPlayers } from "../../api/players.api.js";
import { listItems } from "../../api/items.api.js"; 

export default function SmeltingsPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [form, setForm] = React.useState({
    smelt_date: "",
    player_id: "",
    furnace_location_xyz: "",
    line_items: []
  });

  const [players, setPlayers] = React.useState([]);
  const [items, setItems] = React.useState([]); 
  
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(true); 

  React.useEffect(() => {
    Promise.all([
      listPlayers({ limit: 1000 }),
      listItems({ limit: 1000 })
    ])
    .then(([playersRes, itemsRes]) => {
      if (Array.isArray(playersRes)) setPlayers(playersRes);
      else if (playersRes?.data && Array.isArray(playersRes.data)) setPlayers(playersRes.data);
      else if (playersRes?.data?.data) setPlayers(playersRes.data.data);

      if (Array.isArray(itemsRes)) setItems(itemsRes);
      else if (itemsRes?.data && Array.isArray(itemsRes.data)) setItems(itemsRes.data);
      else if (itemsRes?.data?.data) setItems(itemsRes.data.data);
    })
    .catch((e) => setErr("Failed to load dropdown data: " + String(e.message || e)))
    .finally(() => {
      if (mode === "create") {
        setLoading(false);
      } else {
        getSmelting(id)
          .then((s) => {
            if (s) {
              const dateVal = s.smelt_date ? new Date(s.smelt_date).toISOString().slice(0, 16) : "";
              setForm({ 
                smelt_date: dateVal, 
                player_id: s.player_id, 
                furnace_location_xyz: s.furnace_location_xyz, 
                line_items: s.line_items || [] 
              });
            } else {
              setErr("Smelting Job not found");
            }
            setLoading(false);
          })
          .catch((e) => { 
            setErr(String(e.message || e)); 
            setLoading(false); 
          });
      }
    });
  }, [id, mode]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addLineItem = () => {
    setForm((f) => ({
      ...f,
      line_items: [
        ...f.line_items, 
        { raw_input_item_id: "", quantity_inserted: "", fuel_item_id: "", fuel_consumed: "", output_item_id: "", output_quantity: "" }
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
      if (mode === "create") await createSmelting(form);
      else await updateSmelting(id, form);
      
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
      <div className="page-header">
        <h3 className="page-title">{ mode === "create" ? "Register Smelting Job" : "Edit Smelting Job" }</h3>
        <Link to="/smeltings" className="btn btn-outline">← Back</Link>
      </div>
      
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          
          <h4 style={{ marginBottom: "1.5rem", color: "inherit" }}>Job Details</h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div className="form-group">
              <label className="form-label">Smelt Date <span className="required-marker">*</span></label>
              <input type="datetime-local" className="form-control" name="smelt_date" value={form.smelt_date} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Player <span className="required-marker">*</span></label>
              <select className="form-control" name="player_id" value={form.player_id || ""} onChange={handleChange} required>
                  <option value="">-- Choose a Player --</option>
                  {players.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
              </select>
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
                                      <select className="form-control" value={item.raw_input_item_id || ""} onChange={(e) => handleLineItemChange(index, "raw_input_item_id", e.target.value)} required>
                                          <option value="">Select Ore...</option>
                                          {items.map(i => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                      </select>
                                  </td>
                                  <td style={{ padding: "0.5rem" }}>
                                      <input type="number" className="form-control" placeholder="0" value={item.quantity_inserted} onChange={(e) => handleLineItemChange(index, "quantity_inserted", e.target.value)} required />
                                  </td>
                                  
                                  <td style={{ padding: "0.5rem" }}>
                                      <select className="form-control" value={item.fuel_item_id || ""} onChange={(e) => handleLineItemChange(index, "fuel_item_id", e.target.value)} required>
                                          <option value="">Select Fuel...</option>
                                          {items.map(i => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                      </select>
                                  </td>
                                  <td style={{ padding: "0.5rem" }}>
                                      <input type="number" className="form-control" placeholder="0" value={item.fuel_consumed} onChange={(e) => handleLineItemChange(index, "fuel_consumed", e.target.value)} required />
                                  </td>

                                  <td style={{ padding: "0.5rem" }}>
                                      <select className="form-control" value={item.output_item_id || ""} onChange={(e) => handleLineItemChange(index, "output_item_id", e.target.value)} required>
                                          <option value="">Select Output...</option>
                                          {items.map(i => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                      </select>
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

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Register Smelting Job" : "Update Smelting Job")}
          </button>

        </form>
      </div>
    </div>
  );
}