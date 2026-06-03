import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getVillager, createVillager, updateVillager } from "../../api/villagers.api.js";

const PROFESSIONS = ["Nitwit", "Armorer", "Butcher", "Cartographer", "Cleric", "Farmer", "Fisherman", "Fletcher", "Leatherworker", "Librarian", "Mason", "Shepherd", "Toolsmith", "Weaponsmith"];
const BIOMES = ["Plains", "Desert", "Savanna", "Taiga", "Snowy Tundra", "Swamp", "Jungle"];

export default function VillagerPage({ mode: propMode }) {
  const { id } = useParams(); // 'id' here is actually the villager_code
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [autoCode, setAutoCode] = React.useState(true);
  const [form, setForm] = React.useState({ villager_code: "", villager_name: "", profession: "Nitwit", biome_type: "Plains" });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    getVillager(id)
      .then((v) => {
        if (v) setForm({ villager_code: v.villager_code, villager_name: v.villager_name, profession: v.profession, biome_type: v.biome_type });
        else setErr("Villager not found");
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
        villager_code: mode === "create" && autoCode ? "" : form.villager_code.trim(),
        villager_name: form.villager_name.trim(),
        profession: form.profession,
        biome_type: form.biome_type
      };
      
      if (mode === "create") {
        await createVillager(payload);
        toast.success("Villager created.");
      } else {
        await updateVillager(id, payload);
        toast.success("Villager updated.");
      }
      nav("/villagers");
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
        <h3 className="page-title">{ mode === "create" ? "Create Villager" : `Edit Villager ${id}` }</h3>
        <Link to="/villagers" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Villager Code <span className="required-marker">*</span></label>
            <div className="flex gap-2" style={{ maxWidth: "300px" }}>
              <input
                className="form-control"
                name="villager_code"
                disabled={mode === "create" ? autoCode : true}
                placeholder="e.g. VIL-016"
                value={form.villager_code}
                onChange={handleChange}
                required={!autoCode}
              />
              {mode === "create" && (
                <div className="form-inline-option">
                  <input type="checkbox" checked={autoCode} onChange={(e) => setAutoCode(e.target.checked)} id="v_auto" />
                  <label htmlFor="v_auto">Auto</label>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Villager Name <span className="required-marker">*</span></label>
            <input className="form-control" name="villager_name" value={form.villager_name} onChange={handleChange} required style={{ maxWidth: "400px" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Profession <span className="required-marker">*</span></label>
              <select className="form-control" name="profession" value={form.profession} onChange={handleChange} required>
                  {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Biome <span className="required-marker">*</span></label>
              <select className="form-control" name="biome_type" value={form.biome_type} onChange={handleChange} required>
                  {BIOMES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Create Villager" : "Update Villager")}
          </button>
        </form>
      </div>
    </div>
  );
}