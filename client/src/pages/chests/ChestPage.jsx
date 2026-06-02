import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getChest, createChest, updateChest } from "../../api/chests.api.js";

const DIMENSIONS = ["Overworld", "Nether", "The End"];

export default function ChestPage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [form, setForm] = React.useState({ x_coordinates: 0, y_coordinates: 64, z_coordinates: 0, dimension: "Overworld" });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    getChest(id)
      .then((c) => {
        if (c) setForm({ 
            x_coordinates: c.x_coordinates, 
            y_coordinates: c.y_coordinates, 
            z_coordinates: c.z_coordinates, 
            dimension: c.dimension 
        });
        else setErr("Chest not found");
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
        x_coordinates: Number(form.x_coordinates), 
        y_coordinates: Number(form.y_coordinates), 
        z_coordinates: Number(form.z_coordinates),
        dimension: form.dimension
      };
      
      if (mode === "create") await createChest(payload);
      else await updateChest(id, payload);
      
      toast.success(`Chest ${mode === "create" ? "created" : "updated"}.`);
      nav("/chests");
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
        <h3 className="page-title">{ mode === "create" ? "Register Chest" : "Edit Chest Location" }</h3>
        <Link to="/chests" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
              <label className="form-label">Dimension <span className="required-marker">*</span></label>
              <select className="form-control" name="dimension" value={form.dimension} onChange={handleChange} required>
                  {DIMENSIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">X Coordinate <span className="required-marker">*</span></label>
              <input type="number" className="form-control" name="x_coordinates" value={form.x_coordinates} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Y Coordinate (Height) <span className="required-marker">*</span></label>
              <input type="number" className="form-control" name="y_coordinates" value={form.y_coordinates} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Z Coordinate <span className="required-marker">*</span></label>
              <input type="number" className="form-control" name="z_coordinates" value={form.z_coordinates} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Register Chest" : "Update Chest")}
          </button>
        </form>
      </div>
    </div>
  );
}