import React from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRecipe, createRecipe, updateRecipe } from "../../api/recipes.api.js";

// Import the LoV component we made earlier!
import ItemPickerModal from "../../components/pickers/ItemPickerModal.jsx";

export default function RecipePage({ mode: propMode }) {
  const { id } = useParams();
  const mode = propMode || (id ? "view" : "create");
  const nav = useNavigate();

  // Form state
  const [form, setForm] = React.useState({ target_item_id: "", ingredient_item_id: "", amount_needed: 1 });
  
  // Display names for the read-only inputs
  const [targetName, setTargetName] = React.useState("");
  const [ingredientName, setIngredientName] = React.useState("");

  // LoV Modal states
  const [targetModalOpen, setTargetModalOpen] = React.useState(false);
  const [ingredientModalOpen, setIngredientModalOpen] = React.useState(false);

  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(mode !== "create");

  React.useEffect(() => {
    if (mode === "create") return;
    
    getRecipe(id)
      .then((r) => {
        if (r) {
            setForm({ target_item_id: r.target_item_id, ingredient_item_id: r.ingredient_item_id, amount_needed: r.amount_needed });
            setTargetName(r.target_item_name);
            setIngredientName(r.ingredient_item_name);
        } else {
            setErr("Recipe not found");
        }
      })
      .catch((e) => setErr(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.target_item_id) return toast.error("Please select a Crafting Target.");
    if (!form.ingredient_item_id) return toast.error("Please select an Ingredient.");

    setErr(""); setSubmitting(true);
    try {
      const payload = { 
        target_item_id: Number(form.target_item_id), 
        ingredient_item_id: Number(form.ingredient_item_id), 
        amount_needed: Number(form.amount_needed) 
      };
      
      if (mode === "create") await createRecipe(payload);
      else await updateRecipe(id, payload);
      
      toast.success(`Recipe ${mode === "create" ? "created" : "updated"}.`);
      nav("/recipes");
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
      {/* LoV Modals */}
      <ItemPickerModal 
        isOpen={targetModalOpen} 
        onClose={() => setTargetModalOpen(false)} 
        onSelect={(item) => {
            setForm(f => ({ ...f, target_item_id: item.id }));
            setTargetName(item.item_name);
        }} 
      />
      <ItemPickerModal 
        isOpen={ingredientModalOpen} 
        onClose={() => setIngredientModalOpen(false)} 
        onSelect={(item) => {
            setForm(f => ({ ...f, ingredient_item_id: item.id }));
            setIngredientName(item.item_name);
        }} 
      />

      <div className="page-header">
        <h3 className="page-title">{ mode === "create" ? "Create Recipe" : "Edit Recipe" }</h3>
        <Link to="/recipes" className="btn btn-outline">← Back</Link>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            
            <div className="form-group">
              <label className="form-label">Crafting Target <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={targetName} placeholder="Select an Item..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setTargetModalOpen(true)}>LoV</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ingredient Required <span className="required-marker">*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-control" value={ingredientName} placeholder="Select an Item..." readOnly required />
                <button type="button" className="btn btn-primary" onClick={() => setIngredientModalOpen(true)}>LoV</button>
              </div>
            </div>

          </div>
          <div className="form-group">
            <label className="form-label">Amount Needed <span className="required-marker">*</span></label>
            <input type="number" min="1" max="64" className="form-control" name="amount_needed" value={form.amount_needed} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : (mode === "create" ? "Create Recipe" : "Update Recipe")}
          </button>
        </form>
      </div>
    </div>
  );
}