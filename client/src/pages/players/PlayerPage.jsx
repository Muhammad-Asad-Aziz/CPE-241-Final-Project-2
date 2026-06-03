import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPlayer, createPlayer, updatePlayer } from "../../api/players.api.js";

export default function PlayerPage({ mode: propMode }) {
  const { id } = useParams(); // actually player_code
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  const [autoCode, setAutoCode] = React.useState(true);
  const [form, setForm] = React.useState({ player_code: "", username: "", current_xp_level: 0, health_points: 20 });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    getPlayer(id)
      .then((p) => {
        if (p) setForm({ player_code: p.player_code, username: p.username, current_xp_level: p.current_xp_level, health_points: p.health_points });
        else setErr("Player not found");
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
        player_code: mode === "create" && autoCode ? "" : form.player_code.trim(),
        username: form.username.trim(), 
        current_xp_level: Number(form.current_xp_level), 
        health_points: Number(form.health_points) 
      };
      if (mode === "create") {
        await createPlayer(payload);
        toast.success("Player created.");
      } else {
        await updatePlayer(id, payload);
        toast.success("Player updated.");
      }
      nav("/players");
    } catch (e) { setErr(String(e.message || e)); toast.error(String(e.message || e)); } 
    finally { setSubmitting(false); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">{ mode === "create" ? "Create Player" : `Edit Player ${id}` }</h3>
        <Link to="/players" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Player Code <span className="required-marker">*</span></label>
            <div className="flex gap-2" style={{ maxWidth: "300px" }}>
              <input className="form-control" name="player_code" disabled={mode === "create" ? autoCode : true} placeholder="e.g. PLR-016" value={form.player_code} onChange={handleChange} required={!autoCode} />
              {mode === "create" && (
                <div className="form-inline-option">
                  <input type="checkbox" checked={autoCode} onChange={(e) => setAutoCode(e.target.checked)} id="p_auto" />
                  <label htmlFor="p_auto">Auto</label>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username <span className="required-marker">*</span></label>
            <input className="form-control" name="username" value={form.username} onChange={handleChange} required style={{ maxWidth: "400px" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Current XP Level</label>
              <input type="number" min="0" className="form-control" name="current_xp_level" value={form.current_xp_level} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Health Points (Max 20)</label>
              <input type="number" min="1" max="20" className="form-control" name="health_points" value={form.health_points} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Create Player" : "Update Player")}
          </button>
        </form>
      </div>
    </div>
  );
}