import React from "react";
import { createPortal } from "react-dom";
import { listPlayers } from "../../api/players.api.js";

export default function PlayerPickerModal({ isOpen, onClose, onSelect }) {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    listPlayers({ search, limit: 50 })
      .then((res) => { if (!cancelled) setData(res.data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isOpen, search]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 24 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "var(--radius)", width: "100%", maxWidth: 600, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Select Player</h3>
          <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <input className="form-control" placeholder="Search username..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>

        <div style={{ overflow: "auto", flex: 1, padding: "0 20px" }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Username</th>
                <th className="text-right">Level</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr> : 
               data.length === 0 ? <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>No players found.</td></tr> :
               data.map((row) => (
                <tr key={row.id}>
                  <td className="font-bold">{row.username}</td>
                  <td className="text-right">{row.current_xp_level}</td>
                  <td className="text-center">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => { onSelect(row); onClose(); }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body
  );
}