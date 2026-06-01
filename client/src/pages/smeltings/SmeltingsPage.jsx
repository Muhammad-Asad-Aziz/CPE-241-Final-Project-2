import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSmelting, createSmelting, updateSmelting } from "../../api/smeltings.api.js";
import { listPlayers } from "../../api/players.api.js";

export default function SmeltingsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        smelt_date: "",
        player_id: "",
        furnace_location_xyz: "",
        line_items: []
    });

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        listPlayers({ limit: 1000 })
            .then((res) => {
                if (Array.isArray(res)) setPlayers(res);
                else if (res && Array.isArray(res.data)) setPlayers(res.data);
                else if (res && res.data && Array.isArray(res.data.data)) setPlayers(res.data.data);
                else setPlayers([]);
            })
            .catch(err => console.error("Error fetching players:", err));
    }, []);

    useEffect(() => {
        if (isEdit) {
            getSmelting(id).then((data) => {
                const dateVal = data.smelt_date ? new Date(data.smelt_date).toISOString().slice(0, 16) : "";
                setFormData({ ...data, smelt_date: dateVal, line_items: data.line_items || [] });
            }).catch(err => alert("Error: " + err.message));
        }
    }, [id, isEdit]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await updateSmelting(id, formData);
            else await createSmelting(formData);
            navigate("/smeltings");
        } catch (error) {
            alert("Error saving: " + error.message);
        }
    };

    return (
        <div className="container max-w-md">
            <h2>{isEdit ? "Edit Smelting Job" : "New Smelting Job"}</h2>
            <form onSubmit={handleSubmit} className="card p-4 mt-3">
                <div className="mb-3">
                    <label className="form-label">Smelt Date</label>
                    <input type="datetime-local" name="smelt_date" className="form-control" value={formData.smelt_date} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Player</label>
                    <select 
                        name="player_id" 
                        className="form-control form-control-sm"
                        style={{ maxWidth: "300px" }}
                        className="form-control" 
                        value={formData.player_id || ""} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">-- Choose a Player --</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Furnace Location (X,Y,Z)</label>
                    <input type="text" name="furnace_location_xyz" placeholder="e.g., 100,64,250" className="form-control" value={formData.furnace_location_xyz} onChange={handleChange} required />
                </div>
                <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/smeltings")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}