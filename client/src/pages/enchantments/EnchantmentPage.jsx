import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getEnchantment, createEnchantment, updateEnchantment } from "../../api/enchantments.api.js";

export default function EnchantmentPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [form, setForm] = React.useState({ enchantment_name: "", max_level: 1 });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    getEnchantment(id)
      .then((e) => {
        if (e) setForm({ enchantment_name: e.enchantment_name, max_level: e.max_level });
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
        enchantment_name: form.enchantment_name.trim(), 
        max_level: Number(form.max_level) 
      };
      
      if (mode === "create") await createEnchantment(payload);
      else await updateEnchantment(id, payload);
      
      toast.success(`Enchantment ${mode === "create" ? "created" : "updated"}.`);
      nav("/enchantments");
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
        <h3 className="page-title">{ mode === "create" ? "Create Enchantment" : "Edit Enchantment" }</h3>
        <Link to="/enchantments" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Enchantment Name <span className="required-marker">*</span></label>
            <input className="form-control" name="enchantment_name" value={form.enchantment_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Max Level <span className="required-marker">*</span></label>
            <input type="number" min="1" max="10" className="form-control" name="max_level" value={form.max_level} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Create Enchantment" : "Update Enchantment")}
          </button>
        </form>
      </div>
    </div>
  );
}