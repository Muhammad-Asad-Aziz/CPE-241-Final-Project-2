import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getEnchantment, createEnchantment, updateEnchantment } from "../../api/enchantments.api.js";

export default function EnchantmentPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [autoCode, setAutoCode] = React.useState(true);
  const [form, setForm] = React.useState({ enchantment_code: "", enchantment_name: "", max_level: 1 });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    getEnchantment(id)
      .then((e) => {
        if (e) setForm({ enchantment_code: e.enchantment_code, enchantment_name: e.enchantment_name, max_level: e.max_level });
        else setErr("Enchantment not found");
        setLoading(false);
      })
      .catch((err) => { setErr(String(err.message || err)); setLoading(false); });
  }, [id, mode]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setSubmitting(true);
    try {
      const payload = { 
        enchantment_code: mode === "create" && autoCode ? "" : form.enchantment_code.trim(),
        enchantment_name: form.enchantment_name.trim(), 
        max_level: Number(form.max_level) 
      };
      
      if (mode === "create") {
        const res = await createEnchantment(payload);
        toast.success("Enchantment created.");
        nav(`/enchantments/${res.enchantment_code}`);
      } else {
        const res = await updateEnchantment(id, payload);
        toast.success("Enchantment updated.");
        nav(`/enchantments/${res.enchantment_code}`);
      }
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
        <h3 className="page-title">{ mode === "create" ? "Create Enchantment" : `Edit Enchantment ${id}` }</h3>
        <Link to="/enchantments" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Enchantment Code <span className="required-marker">*</span></label>
            <div className="flex gap-2" style={{ maxWidth: "300px" }}>
              <input
                className="form-control"
                name="enchantment_code"
                disabled={mode === "create" ? autoCode : true}
                placeholder="e.g. ENC-016"
                value={form.enchantment_code}
                onChange={handleChange}
                required={!autoCode}
              />
              {mode === "create" && (
                <div className="form-inline-option">
                  <input type="checkbox" checked={autoCode} onChange={(e) => setAutoCode(e.target.checked)} id="e_auto" />
                  <label htmlFor="e_auto">Auto</label>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Enchantment Name <span className="required-marker">*</span></label>
              <input className="form-control" name="enchantment_name" value={form.enchantment_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Max Level <span className="required-marker">*</span></label>
              <input type="number" min="1" max="10" className="form-control" name="max_level" value={form.max_level} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Create Enchantment" : "Update Enchantment")}
          </button>
        </form>
      </div>
    </div>
  );
}