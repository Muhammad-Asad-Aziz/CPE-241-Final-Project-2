import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCrafting, createCrafting, updateCrafting } from "../../api/craftings.api.js";

//LoV Pickers
import PlayerPickerModal from "../../components/pickers/PlayerPickerModal.jsx";
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";

export default function CraftingsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        crafting_date: "",
        session_id: "",
        player_id: "",
        target_item_id: "",
        qty_wanted: ""
    });

    const [playerLabel, setPlayerLabel] = useState("");
    const [itemLabel, setItemLabel] = useState("");

    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [itemModalOpen, setItemModalOpen] = useState(false);

    useEffect(() => {
        if (isEdit) {
            getCrafting(id).then((data) => {
                const dateVal = data.crafting_date ? new Date(data.crafting_date).toISOString().slice(0, 16) : "";
                setFormData({ ...data, crafting_date: dateVal });
                
                setPlayerLabel(data.player_username || `Player #${data.player_id}`);
                if (data.target_item_id) {
                    setItemLabel(data.target_item_name || `Item #${data.target_item_id}`);
                }
            }).catch(err => alert("Error: " + err.message));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.player_id) {
            alert("Please select a Player!");
            return;
        }

        try {
            const payload = { ...formData };
            if (!payload.target_item_id) payload.target_item_id = null;

            if (isEdit) {
                await updateCrafting(id, payload);
            } else {
                await createCrafting(payload);
            }
            navigate("/craftings");
        } catch (error) {
            alert("Error saving: " + error.message);
        }
    };

    return (
        <div>
            <PlayerPickerModal 
                isOpen={playerModalOpen} 
                onClose={() => setPlayerModalOpen(false)} 
                onSelect={(p) => {
                    setFormData({ ...formData, player_id: p.id });
                    setPlayerLabel(p.username);
                    setPlayerModalOpen(false);
                }} 
            />
            <ItemPickerModal 
                isOpen={itemModalOpen} 
                onClose={() => setItemModalOpen(false)} 
                onSelect={(item) => {
                    setFormData({ ...formData, target_item_id: item.id });
                    setItemLabel(item.item_name);
                    setItemModalOpen(false);
                }} 
            />

            <div className="page-header">
                <h3 className="page-title">{isEdit ? `Edit Crafting #CRF-${id}` : "Record New Crafting"}</h3>
                <Link to="/craftings" className="btn btn-outline">← Back</Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "1rem" }}>
                    <h4>Crafting Details</h4>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                        
                        <div className="form-group">
                            <label className="form-label">Crafting Date <span style={{color: "red"}}>*</span></label>
                            <input type="datetime-local" name="crafting_date" className="form-control" value={formData.crafting_date} onChange={handleChange} required />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Session ID <span style={{color: "red"}}>*</span></label>
                            <input type="number" name="session_id" className="form-control" value={formData.session_id} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Player <span style={{color: "red"}}>*</span></label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input className="form-control" value={playerLabel} placeholder="Select Player..." readOnly required />
                                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Target Item (Optional)</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input className="form-control" value={itemLabel || "-- None --"} readOnly />
                                <button type="button" className="btn btn-primary" onClick={() => setItemModalOpen(true)}>LoV</button>
                                {formData.target_item_id && (
                                    <button type="button" className="btn btn-outline" onClick={() => { 
                                        setFormData({ ...formData, target_item_id: "" }); 
                                        setItemLabel(""); 
                                    }}>×</button>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Qty Wanted <span style={{color: "red"}}>*</span></label>
                            <input type="number" name="qty_wanted" className="form-control" value={formData.qty_wanted} onChange={handleChange} required />
                        </div>

                    </div>

                    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/craftings")}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? "Update Crafting Record" : "Save Crafting Record"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}