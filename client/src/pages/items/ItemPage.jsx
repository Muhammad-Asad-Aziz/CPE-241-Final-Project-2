import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getItem, createItem, updateItem } from "../../api/items.api.js";

const ITEM_TYPES = ["Block", "Ingredient", "Tool", "Food", "Armor"];

export default function ItemPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [form, setForm] = React.useState({ item_name: "", max_stack_size: 64, item_type: "Ingredient", max_durability: "" });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    getItem(id)
      .then((p) => {
        if (p) setForm({ 
            item_name: p.item_name, 
            max_stack_size: p.max_stack_size, 
            item_type: p.item_type, 
            max_durability: p.max_durability || "" 
        });
        else setErr("Item not found");
        setLoading(false);
      })
      .catch((e) => { setErr(String(e.message || e)); setLoading(false); });
  }, [id, mode]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setSubmitting(true);
    try {
      const payload = { 
        item_name: form.item_name.trim(), 
        max_stack_size: Number(form.max_stack_size), 
        item_type: form.item_type,
        max_durability: form.max_durability ? Number(form.max_durability) : null
      };
      
      if (mode === "create") await createItem(payload);
      else await updateItem(id, payload);
      
      toast.success(`Item ${mode === "create" ? "created" : "updated"}.`);
      nav("/items");
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
        <h3 className="page-title">{ mode === "create" ? "Create Item" : "Edit Item" }</h3>
        <Link to="/items" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div className="form-group">
                <label className="form-label">Item Name <span className="required-marker">*</span></label>
                <input className="form-control" name="item_name" value={form.item_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label className="form-label">Item Type <span className="required-marker">*</span></label>
                <select className="form-control" name="item_type" value={form.item_type} onChange={handleChange} required>
                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Max Stack Size <span className="required-marker">*</span></label>
              <input type="number" min="1" max="64" className="form-control" name="max_stack_size" value={form.max_stack_size} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Max Durability (Optional)</label>
              <input type="number" min="1" className="form-control" name="max_durability" value={form.max_durability} onChange={handleChange} placeholder="e.g. 1561 for Diamond" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Create Item" : "Update Item")}
          </button>
        </form>
      </div>
    </div>
  );
}