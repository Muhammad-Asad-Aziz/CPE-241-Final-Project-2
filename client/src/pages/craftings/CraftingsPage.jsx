import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCrafting, createCrafting, updateCrafting, listCraftings } from "../../api/craftings.api.js";
import { listPlayers } from "../../api/players.api.js";
import { listItems } from "../../api/items.api.js";
import { listRecipes } from "../../api/recipes.api.js"; 

import PlayerPickerModal from "../../components/pickers/PlayerPickerModal.jsx";
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";

function emptyLine() {
    return { 
        item_id: "", 
        item_name: "", 
        required_qty_per_unit: 1, 
        player_current_stock: 0, 
        craft_status: "Pending" 
    };
}

export default function CraftingsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        crafting_date: "",
        session_id: "",
        player_id: "",
        target_item_id: "",
        qty_wanted: 1
    });

    const [playerLabel, setPlayerLabel] = useState("");
    const [itemLabel, setItemLabel] = useState("");
    const [lines, setLines] = useState([emptyLine()]);
    
    const [allItems, setAllItems] = useState([]);

    const [playerModalOpen, setPlayerModalOpen] = useState(false);
    const [headerItemModalOpen, setHeaderItemModalOpen] = useState(false);
    const [lineItemModalOpen, setLineItemModalOpen] = useState(false);
    const [activeLineIdx, setActiveLineIdx] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [playersRes, itemsRes] = await Promise.all([
                    listPlayers({ limit: 1000 }),
                    listItems({ limit: 1000 })
                ]);
                const playersList = playersRes.data || [];
                const itemsList = itemsRes.data || [];
                
                setAllItems(itemsList);

                if (isEdit) {
                    const data = await getCrafting(id);
                    
                    const dateVal = data.crafting_date ? new Date(data.crafting_date).toISOString().slice(0, 16) : "";
                    setFormData({ ...data, crafting_date: dateVal, qty_wanted: data.qty_wanted || 1 });
                    
                    const player = playersList.find(p => p.id === data.player_id);
                    setPlayerLabel(player ? player.username : `Player #${data.player_id}`);
                    
                    if (data.target_item_id) {
                        const targetItem = itemsList.find(i => i.id === data.target_item_id);
                        setItemLabel(targetItem ? targetItem.item_name : `Item #${data.target_item_id}`);
                    }

                    if (data.line_items && data.line_items.length > 0) {
                        setLines(data.line_items.map(li => {
                            const lineItem = itemsList.find(i => i.id === li.item_id);
                            return {
                                item_id: li.item_id,
                                item_name: lineItem ? lineItem.item_name : (li.item_name || `Item #${li.item_id}`),
                                required_qty_per_unit: li.required_qty_per_unit || 1,
                                player_current_stock: li.player_current_stock || 0,
                                craft_status: li.craft_status || "Pending"
                            };
                        }));
                    }
                } else {

                    const now = new Date();
                    const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    

                    let nextSessionId = 1;
                    try {
                        const craftingsRes = await listCraftings({ sortBy: "session_id", sortDir: "desc", limit: 1 });
                        const latestCrafting = craftingsRes.data && craftingsRes.data.length > 0 ? craftingsRes.data[0] : null;
                        if (latestCrafting && latestCrafting.session_id) {
                            nextSessionId = Number(latestCrafting.session_id) + 1;
                        }
                    } catch (err) {
                        console.error("Could not fetch latest session id:", err);
                    }


                    setFormData(prev => ({ 
                        ...prev, 
                        session_id: nextSessionId,
                        crafting_date: localDatetime
                    }));
                }
            } catch (err) {
                alert("Error loading data: " + err.message);
            }
        };
        loadData();
    }, [id, isEdit]);

    const handleHeaderChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateLine = (index, field, value) => {
        setLines(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const removeLine = (index) => {
        setLines(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.player_id) return alert("Please select a Player!");
        if (lines.length === 0) return alert("Please add at least one ingredient.");
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].item_id) return alert(`Please select an item for row ${i + 1}`);
        }

        try {
            const payload = { 
                ...formData,
                target_item_id: formData.target_item_id || null,
                line_items: lines.map(l => ({
                    item_id: Number(l.item_id),
                    required_qty_per_unit: Number(l.required_qty_per_unit),
                    player_current_stock: Number(l.player_current_stock),
                    craft_status: l.craft_status
                }))
            };

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
            <PlayerPickerModal isOpen={playerModalOpen} onClose={() => setPlayerModalOpen(false)} onSelect={(p) => { setFormData({ ...formData, player_id: p.id }); setPlayerLabel(p.username); setPlayerModalOpen(false); }} />
            
            <ItemPickerModal 
                isOpen={headerItemModalOpen} 
                onClose={() => setHeaderItemModalOpen(false)} 
                onSelect={async (item) => { 
                    setFormData({ ...formData, target_item_id: item.id }); 
                    setItemLabel(item.item_name); 
                    setHeaderItemModalOpen(false); 

                    try {
                        const res = await listRecipes({ limit: 1000 });
                        const allRecipes = res.data || [];
                        
                        const recipeItems = allRecipes.filter(r => String(r.target_item_id) === String(item.id));
                        
                        if (recipeItems.length > 0) {
                            const newLines = recipeItems.map(recipe => {
                                const foundItem = allItems.find(i => String(i.id) === String(recipe.ingredient_item_id));
                                
                                const actualQty = recipe.amount_needed || recipe.quantity || recipe.qty || recipe.required_qty || recipe.amount || 1;

                                return {
                                    item_id: recipe.ingredient_item_id,
                                    item_name: foundItem ? foundItem.item_name : `Item #${recipe.ingredient_item_id}`, 
                                    required_qty_per_unit: actualQty,
                                    player_current_stock: 0,
                                    craft_status: "Pending"
                                };
                            });
                            setLines(newLines);
                        } else {
                            setLines([emptyLine()]);
                        }
                    } catch (error) {
                        console.error("Failed to load recipes:", error);
                        setLines([emptyLine()]);
                    }
                }} 
            />
            
            <ItemPickerModal isOpen={lineItemModalOpen} onClose={() => setLineItemModalOpen(false)} onSelect={(item) => { updateLine(activeLineIdx, "item_id", item.id); updateLine(activeLineIdx, "item_name", item.item_name); setLineItemModalOpen(false); }} />

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
                            <input type="datetime-local" name="crafting_date" className="form-control" value={formData.crafting_date} onChange={handleHeaderChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Session ID <span style={{color: "red"}}>*</span></label>
                            <input type="number" name="session_id" className="form-control" value={formData.session_id} onChange={handleHeaderChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Player <span style={{color: "red"}}>*</span></label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input className="form-control" value={playerLabel} placeholder="Select Player..." readOnly required />
                                <button type="button" className="btn btn-primary" onClick={() => setPlayerModalOpen(true)}>LoV</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Target Item to Craft</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input className="form-control" value={itemLabel || "-- None --"} readOnly />
                                <button type="button" className="btn btn-primary" onClick={() => setHeaderItemModalOpen(true)}>LoV</button>
                                {formData.target_item_id && (<button type="button" className="btn btn-outline" onClick={() => { setFormData({ ...formData, target_item_id: "" }); setItemLabel(""); setLines([emptyLine()]); }}>×</button>)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantity Wanted <span style={{color: "red"}}>*</span></label>
                            <input type="number" name="qty_wanted" min="1" className="form-control" value={formData.qty_wanted} onChange={handleHeaderChange} required />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h4 style={{ margin: 0 }}>Ingredients Needed</h4>
                        <button type="button" className="btn btn-outline" onClick={() => setLines(prev => [...prev, emptyLine()])}>+ Add Ingredient</button>
                    </div>

                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Ingredient Needed <span style={{color: "red"}}>*</span></th>
                                    <th className="text-right" style={{ width: "120px" }}>Qty / Unit</th>
                                    <th className="text-right" style={{ width: "120px" }}>Total Needed</th>
                                    <th className="text-right" style={{ width: "120px" }}>Current Stock</th>
                                    <th style={{ width: "150px" }}>Status</th>
                                    <th style={{ width: "80px" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((line, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <input className="form-control" value={line.item_name || ""} placeholder="Select Item..." readOnly required />
                                                <button type="button" className="btn btn-primary" onClick={() => { setActiveLineIdx(idx); setLineItemModalOpen(true); }}>LoV</button>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <input type="number" min="1" className="form-control text-right" value={line.required_qty_per_unit} onChange={(e) => updateLine(idx, "required_qty_per_unit", e.target.value)} required />
                                        </td>
                                        <td className="text-right" style={{ fontWeight: "bold", color: "var(--primary)", verticalAlign: "middle" }}>
                                            {line.required_qty_per_unit * (formData.qty_wanted || 1)}
                                        </td>
                                        <td className="text-right">
                                            <input type="number" min="0" className="form-control text-right" value={line.player_current_stock} onChange={(e) => updateLine(idx, "player_current_stock", e.target.value)} required />
                                        </td>
                                        <td>
                                            <select className="form-control" value={line.craft_status} onChange={(e) => updateLine(idx, "craft_status", e.target.value)}>
                                                <option value="Pending">Pending</option>
                                                <option value="Ready">Ready</option>
                                                <option value="Crafted">Crafted</option>
                                            </select>
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-outline" style={{ padding: "4px 8px", color: "#ef4444", borderColor: "#ef4444", fontSize: "0.75rem" }} onClick={() => removeLine(idx)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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