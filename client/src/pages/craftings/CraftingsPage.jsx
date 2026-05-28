import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCrafting, createCrafting, updateCrafting } from "../../api/craftings.api.js";

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

    useEffect(() => {
        if (isEdit) {
            getCrafting(id).then((data) => {
                // ฟอร์แมตวันที่ให้ใส่ใน input type="datetime-local" ได้
                const dateVal = data.crafting_date ? new Date(data.crafting_date).toISOString().slice(0, 16) : "";
                setFormData({ ...data, crafting_date: dateVal });
            }).catch(err => alert("Error: " + err.message));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // แปลงค่าว่างให้เป็น null สำหรับ target_item_id
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
        <div className="container max-w-md">
            <h2>{isEdit ? "Edit Crafting" : "New Crafting"}</h2>
            <form onSubmit={handleSubmit} className="card p-4 mt-3">
                <div className="mb-3">
                    <label className="form-label">Crafting Date</label>
                    <input type="datetime-local" name="crafting_date" className="form-control" value={formData.crafting_date} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Session ID</label>
                    <input type="number" name="session_id" className="form-control" value={formData.session_id} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Player ID</label>
                    <input type="number" name="player_id" className="form-control" value={formData.player_id} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Target Item ID (Optional)</label>
                    <input type="number" name="target_item_id" className="form-control" value={formData.target_item_id || ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Qty Wanted</label>
                    <input type="number" name="qty_wanted" className="form-control" value={formData.qty_wanted} onChange={handleChange} required />
                </div>
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/craftings")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}