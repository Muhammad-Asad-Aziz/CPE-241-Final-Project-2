import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSmelting, createSmelting, updateSmelting } from "../../api/smeltings.api.js";
import { listPlayers } from "../../api/players.api.js";
import { listItems } from "../../api/items.api.js";

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
    const [items, setItems] = useState([]);

    useEffect(() => {
        listPlayers({ limit: 1000 })
            .then((res) => {
                if (Array.isArray(res)) setPlayers(res);
                else if (res && Array.isArray(res.data)) setPlayers(res.data);
                else if (res?.data?.data) setPlayers(res.data.data);
            }).catch(err => console.error("Error fetching players:", err));

        listItems({ limit: 1000 })
            .then((res) => {
                if (Array.isArray(res)) setItems(res);
                else if (res && Array.isArray(res.data)) setItems(res.data);
                else if (res?.data?.data) setItems(res.data.data);
            }).catch(err => console.error("Error fetching items:", err));
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

    const addLineItem = () => {
        setFormData({
            ...formData,
            line_items: [
                ...formData.line_items, 
                { raw_input_item_id: "", quantity_inserted: "", fuel_item_id: "", fuel_consumed: "", output_item_id: "", output_quantity: "" }
            ]
        });
    };

    const handleLineItemChange = (index, field, value) => {
        const newLineItems = [...formData.line_items];
        newLineItems[index][field] = value;
        setFormData({ ...formData, line_items: newLineItems });
    };

    const removeLineItem = (index) => {
        const newLineItems = formData.line_items.filter((_, i) => i !== index);
        setFormData({ ...formData, line_items: newLineItems });
    };

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
        <div className="container mt-4" style={{ maxWidth: "900px" }}>
            <h2 className="mb-4">{isEdit ? "Edit Smelting Job" : "New Smelting Job"}</h2>
            
            <form onSubmit={handleSubmit} className="card p-4">
                
                <h4 className="mb-3">Job Details</h4>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Smelt Date</label>
                        <input type="datetime-local" name="smelt_date" className="form-control" value={formData.smelt_date} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Player</label>
                        <select name="player_id" className="form-control" value={formData.player_id || ""} onChange={handleChange} required>
                            <option value="">-- Choose a Player --</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>{p.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label className="form-label">Furnace Location</label>
                        <input type="text" name="furnace_location_xyz" placeholder="100,64,250" className="form-control" value={formData.furnace_location_xyz} onChange={handleChange} required />
                    </div>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Smelted Items</h4>
                    <button type="button" className="btn btn-outline-primary" onClick={addLineItem}>
                        + Add Item
                    </button>
                </div>

                {formData.line_items.length === 0 ? (
                    <div className="alert alert-secondary text-center">No items added yet. Click "+ Add Item".</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Raw Ore</th>
                                    <th style={{ width: "100px" }}>Qty In</th>
                                    <th>Fuel Used</th>
                                    <th style={{ width: "100px" }}>Fuel Qty</th>
                                    <th>Output Item</th>
                                    <th style={{ width: "100px" }}>Qty Out</th>
                                    <th className="text-center" style={{ width: "80px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.line_items.map((item, index) => (
                                    <tr key={index}>

                                        <td>
                                            <select className="form-control" value={item.raw_input_item_id || ""} onChange={(e) => handleLineItemChange(index, "raw_input_item_id", e.target.value)} required>
                                                <option value="">Select Ore...</option>
                                                {items.map(i => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <input type="number" className="form-control" placeholder="0" value={item.quantity_inserted} onChange={(e) => handleLineItemChange(index, "quantity_inserted", e.target.value)} required />
                                        </td>
                                        
                                        <td>
                                            <select className="form-control" value={item.fuel_item_id || ""} onChange={(e) => handleLineItemChange(index, "fuel_item_id", e.target.value)} required>
                                                <option value="">Select Fuel...</option>
                                                {items.map(i => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <input type="number" className="form-control" placeholder="0" value={item.fuel_consumed} onChange={(e) => handleLineItemChange(index, "fuel_consumed", e.target.value)} required />
                                        </td>

                                        <td>
                                            <select className="form-control" value={item.output_item_id || ""} onChange={(e) => handleLineItemChange(index, "output_item_id", e.target.value)} required>
                                                <option value="">Select Output...</option>
                                                {items.map(i => <option key={i.id} value={i.id}>{i.item_name}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <input type="number" className="form-control" placeholder="0" value={item.output_quantity} onChange={(e) => handleLineItemChange(index, "output_quantity", e.target.value)} required />
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-danger" onClick={() => removeLineItem(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="d-flex gap-2 mt-4 border-top pt-4">
                    <button type="submit" className="btn btn-success px-4">Save Job</button>
                    <button type="button" className="btn btn-secondary px-4" onClick={() => navigate("/smeltings")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}