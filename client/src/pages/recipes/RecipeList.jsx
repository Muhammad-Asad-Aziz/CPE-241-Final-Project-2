import React from "react";
import { toast } from "react-toastify";
import { listRecipes, deleteRecipe } from "../../api/recipes.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function RecipeList() {
    const fetchData = React.useCallback((params) => listRecipes(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteRecipe(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Recipe deleted.");
        } catch (e) {
            toast.error(String(e.message || e));
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "Recipe ID" },
        { key: "target_item_name", label: "Crafts Into", render: v => <span className="font-bold">{v}</span> },
        { key: "ingredient_item_name", label: "Requires Item" },
        { key: "amount_needed", label: "Amount Needed", align: "right" }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Recipe"
                message="Are you sure you want to delete this recipe?"
                confirmText="Delete"
            />
            <DataList
                title="Crafting Recipes"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search target or ingredient name..."
                itemName="recipes"
                basePath="/recipes"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}