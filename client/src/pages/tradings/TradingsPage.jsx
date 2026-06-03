import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTrading, createTrading, updateTrading } from "../../api/tradings.api.js";
import { listVillagers } from "../../api/villagers.api.js";
import { listItems } from "../../api/items.api.js";
import { listPlayers } from "../../api/players.api.js";

function emptyLine() {
    return {
        item_given_id: "",
        item_given_name: "",
        quantity_given: 1,
        item_received_id: "",
        item_received_name: "",
        quantity_received: 1,
        trade_uses_remaining: 10,
    };
}

export default function TradingsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({ trade_code: "", trade_date: "", player_name: "", villager_id: "" });
    const [villagerLabel, setVillagerLabel] = useState("");
    const [lines, setLines] = useState([emptyLine()]);
    const [allVillagers, setAllVillagers] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);

    const [itemPickerOpen, setItemPickerOpen] = useState(false);
    const [villagerPickerOpen, setVillagerPickerOpen] = useState(false);
    const [playerPickerOpen, setPlayerPickerOpen] = useState(false);
    const [activeLineIdx, setActiveLineIdx] = useState(null);
    const [activeField, setActiveField] = useState(null);
    const [searchItem, setSearchItem] = useState("");
    const [searchVillager, setSearchVillager] = useState("");
    const [searchPlayer, setSearchPlayer] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const [villagersRes, itemsRes, playersRes] = await Promise.all([
                listVillagers({ limit: 1000 }),
                listItems({ limit: 1000 }),
                listPlayers({ limit: 1000 }),
            ]);
            setAllVillagers(villagersRes.data || []);
            setAllItems(itemsRes.data || []);
            setAllPlayers(playersRes.data || []);

            if (isEdit) {
                const data = await getTrading(id);
                const dateVal = data.trade_date
                    ? new Date(data.trade_date).toISOString().slice(0, 16)
                    : "";
                setFormData({ trade_code: data.trade_code || "", trade_date: dateVal, player_name: data.player_name, villager_id: data.villager_id });
                setVillagerLabel(data.villager_name ? `${data.villager_name} (${data.profession})` : `Villager #${data.villager_id}`);
                if (data.line_items && data.line_items.length > 0) {
                    setLines(data.line_items.map(li => ({
                        item_given_id: li.item_given_id,
                        item_given_name: li.item_given_name || "",
                        quantity_given: li.quantity_given,
                        item_received_id: li.item_received_id,
                        item_received_name: li.item_received_name || "",
                        quantity_received: li.quantity_received,
                        trade_uses_remaining: li.trade_uses_remaining,
                    })));
                }
            } else {
                const now = new Date();
                const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                setFormData(prev => ({ ...prev, trade_date: localDatetime }));
            }
        };
        loadData().catch(err => alert("Error loading data: " + err.message));
    }, [id, isEdit]);

    const handleHeaderChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const updateLine = (index, field, value) => {
        setLines(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.player_name) return alert("Please enter Player Name!");
        if (!formData.villager_id) return alert("Please select a Villager!");
        if (lines.length === 0) return alert("Please add at least one trade line.");
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].item_given_id) return alert(`Please select Item Given for row ${i + 1}`);
            if (!lines[i].item_received_id) return alert(`Please select Item Received for row ${i + 1}`);
        }
        try {
            const payload = {
                ...formData,
                trade_code: formData.trade_code || undefined,
                villager_id: Number(formData.villager_id),
                line_items: lines.map(l => ({
                    item_given_id: Number(l.item_given_id),
                    quantity_given: Number(l.quantity_given),
                    item_received_id: Number(l.item_received_id),
                    quantity_received: Number(l.quantity_received),
                    trade_uses_remaining: Number(l.trade_uses_remaining),
                })),
            };
            if (isEdit) {
                await updateTrading(id, payload);
            } else {
                await createTrading(payload);
            }
            navigate("/tradings");
        } catch (error) {
            alert("Error saving: " + error.message);
        }
    };

    const filteredItems = allItems.filter(i =>
        i.item_name.toLowerCase().includes(searchItem.toLowerCase())
    );
    const filteredVillagers = allVillagers.filter(v =>
        v.villager_name.toLowerCase().includes(searchVillager.toLowerCase())
    );
    const filteredPlayers = allPlayers.filter(p =>
        p.username.toLowerCase().includes(searchPlayer.toLowerCase())
    );

    const modalStyle = {
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
    };
    const modalBoxStyle = {
        background: "var(--bg-surface)", borderRadius: 12, padding: 0,
        width: 420, maxHeight: "75vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)", overflow: "hidden"
    };

    return (
        <div>
            {/* Item Picker Modal */}
            {itemPickerOpen && (
                <div style={modalStyle} onClick={() => { setItemPickerOpen(false); setSearchItem(""); }}>
                    <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h4 style={{ margin: 0, fontSize: "1rem" }}>Select Item</h4>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)", lineHeight: 1 }}
                                onClick={() => { setItemPickerOpen(false); setSearchItem(""); }}>✕</button>
                        </div>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                            <input
                                className="form-control"
                                placeholder="Search item..."
                                value={searchItem}
                                onChange={e => setSearchItem(e.target.value)}
                                autoFocus
                                style={{ margin: 0 }}
                            />
                        </div>
                        <div style={{ overflowY: "auto", flex: 1 }}>
                            {filteredItems.length === 0 && (
                                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No items found.</div>
                            )}
                            {filteredItems.map(item => (
                                <div key={item.id}
                                    style={{ padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-body)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    onClick={() => {
                                        if (activeField === "given") {
                                            updateLine(activeLineIdx, "item_given_id", item.id);
                                            updateLine(activeLineIdx, "item_given_name", item.item_name);
                                        } else {
                                            updateLine(activeLineIdx, "item_received_id", item.id);
                                            updateLine(activeLineIdx, "item_received_name", item.item_name);
                                        }
                                        setItemPickerOpen(false);
                                        setSearchItem("");
                                    }}>
                                    <span style={{ fontWeight: 500, color: "var(--text-main)" }}>{item.item_name}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", background: "var(--bg-body)", padding: "2px 8px", borderRadius: 4 }}>
                                        {item.item_type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Villager Picker Modal */}
            {villagerPickerOpen && (
                <div style={modalStyle} onClick={() => { setVillagerPickerOpen(false); setSearchVillager(""); }}>
                    <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h4 style={{ margin: 0, fontSize: "1rem" }}>Select Villager</h4>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)", lineHeight: 1 }}
                                onClick={() => { setVillagerPickerOpen(false); setSearchVillager(""); }}>✕</button>
                        </div>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                            <input
                                className="form-control"
                                placeholder="Search villager..."
                                value={searchVillager}
                                onChange={e => setSearchVillager(e.target.value)}
                                autoFocus
                                style={{ margin: 0 }}
                            />
                        </div>
                        <div style={{ overflowY: "auto", flex: 1 }}>
                            {filteredVillagers.length === 0 && (
                                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No villagers found.</div>
                            )}
                            {filteredVillagers.map(v => (
                                <div key={v.id}
                                    style={{ padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-body)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, villager_id: v.id }));
                                        setVillagerLabel(`${v.villager_name} (${v.profession})`);
                                        setVillagerPickerOpen(false);
                                        setSearchVillager("");
                                    }}>
                                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{v.villager_name}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", background: "var(--bg-body)", padding: "2px 8px", borderRadius: 4 }}>
                                        {v.profession}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Player Picker Modal */}
            {playerPickerOpen && (
                <div style={modalStyle} onClick={() => { setPlayerPickerOpen(false); setSearchPlayer(""); }}>
                    <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h4 style={{ margin: 0, fontSize: "1rem" }}>Select Player</h4>
                            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)", lineHeight: 1 }}
                                onClick={() => { setPlayerPickerOpen(false); setSearchPlayer(""); }}>✕</button>
                        </div>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                            <input
                                className="form-control"
                                placeholder="Search player..."
                                value={searchPlayer}
                                onChange={e => setSearchPlayer(e.target.value)}
                                autoFocus
                                style={{ margin: 0 }}
                            />
                        </div>
                        <div style={{ overflowY: "auto", flex: 1 }}>
                            {filteredPlayers.length === 0 && (
                                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No players found.</div>
                            )}
                            {filteredPlayers.map(p => (
                                <div key={p.id}
                                    style={{ padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-body)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, player_name: p.username }));
                                        setPlayerPickerOpen(false);
                                        setSearchPlayer("");
                                    }}>
                                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{p.username}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", background: "var(--bg-body)", padding: "2px 8px", borderRadius: 4 }}>
                                        XP: {p.current_xp_level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <h3 className="page-title">
                    {isEdit ? `Edit Trade Session ${id}` : "Record New Villager Trade"}
                </h3>
                <Link to="/tradings" className="btn btn-outline">← Back to List</Link>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Header Section */}
                <div className="card" style={{ marginBottom: "1rem" }}>
                    <h4 style={{ marginTop: 0 }}>Trade Session Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Trade Code {!isEdit && <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>(Auto-generated if blank)</span>}</label>
                            <input name="trade_code" className="form-control" value={formData.trade_code} onChange={handleHeaderChange}
                                placeholder="e.g. TRD-0016" readOnly={isEdit} disabled={isEdit}
                                style={isEdit ? { background: "var(--bg-body)", color: "var(--text-muted)", cursor: "not-allowed" } : {}} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Trade Date <span style={{ color: "red" }}>*</span></label>
                            <input type="datetime-local" name="trade_date" className="form-control"
                                value={formData.trade_date} onChange={handleHeaderChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Player Name <span style={{ color: "red" }}>*</span></label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input type="text" name="player_name" className="form-control"
                                    value={formData.player_name} onChange={handleHeaderChange}
                                    placeholder="Enter player name..." required />
                                <button type="button" className="btn btn-primary"
                                    onClick={() => setPlayerPickerOpen(true)}>
                                    LoV
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Villager <span style={{ color: "red" }}>*</span></label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input className="form-control" value={villagerLabel}
                                    placeholder="Click LoV to select..." readOnly />
                                <button type="button" className="btn btn-primary"
                                    onClick={() => setVillagerPickerOpen(true)}>
                                    LoV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h4 style={{ margin: 0 }}>Trade Items</h4>
                        <button type="button" className="btn btn-outline"
                            onClick={() => setLines(prev => [...prev, emptyLine()])}>
                            + Add Trade Line
                        </button>
                    </div>

                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item Given by Player <span style={{ color: "red" }}>*</span></th>
                                    <th style={{ width: 90 }}>Qty Given</th>
                                    <th>Item Received <span style={{ color: "red" }}>*</span></th>
                                    <th style={{ width: 90 }}>Qty Received</th>
                                    <th style={{ width: 110 }}>Uses Remaining</th>
                                    <th style={{ width: 90 }}>Status</th>
                                    <th style={{ width: 80 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((line, idx) => {
                                    const status = Number(line.trade_uses_remaining) === 0 ? "Locked" : "Open";
                                    const statusColor = status === "Locked" ? "#ef4444" : "#22c55e";
                                    return (
                                        <tr key={idx}>
                                            <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>{idx + 1}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <input className="form-control" value={line.item_given_name || ""}
                                                        placeholder="Select..." readOnly style={{ minWidth: 0 }} />
                                                    <button type="button" className="btn btn-primary"
                                                        style={{ whiteSpace: "nowrap", padding: "0 10px", fontSize: "0.8rem" }}
                                                        onClick={() => { setActiveLineIdx(idx); setActiveField("given"); setItemPickerOpen(true); }}>
                                                        LoV
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input type="number" min="1" className="form-control"
                                                    value={line.quantity_given}
                                                    onChange={e => updateLine(idx, "quantity_given", e.target.value)} />
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <input className="form-control" value={line.item_received_name || ""}
                                                        placeholder="Select..." readOnly style={{ minWidth: 0 }} />
                                                    <button type="button" className="btn btn-primary"
                                                        style={{ whiteSpace: "nowrap", padding: "0 10px", fontSize: "0.8rem" }}
                                                        onClick={() => { setActiveLineIdx(idx); setActiveField("received"); setItemPickerOpen(true); }}>
                                                        LoV
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input type="number" min="1" className="form-control"
                                                    value={line.quantity_received}
                                                    onChange={e => updateLine(idx, "quantity_received", e.target.value)} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" className="form-control"
                                                    value={line.trade_uses_remaining}
                                                    onChange={e => updateLine(idx, "trade_uses_remaining", e.target.value)} />
                                            </td>
                                            <td style={{ textAlign: "center", fontWeight: "bold", color: statusColor }}>
                                                {status}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button type="button" className="btn btn-outline"
                                                    style={{ padding: "4px 8px", color: "#ef4444", borderColor: "#ef4444", fontSize: "0.75rem" }}
                                                    onClick={() => setLines(prev => prev.filter((_, i) => i !== idx))}>
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {lines.length === 0 && (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                                            No trade lines yet. Click "+ Add Trade Line" to begin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/tradings")}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? "Update Trade" : "Save Trade"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
