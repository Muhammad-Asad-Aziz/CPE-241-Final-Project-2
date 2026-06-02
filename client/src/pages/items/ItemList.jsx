import React from "react";
import { toast } from "react-toastify";
import { listItems, deleteItem } from "../../api/items.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function ItemList() {
    const fetchData = React.useCallback((params) => listItems(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null, force: false });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null, force: false });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id, force: false });

    const confirmDelete = async () => {
        try {
            await deleteItem(confirmModal.id, confirmModal.force);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success(confirmModal.force ? "Item, recipes, and related transfers deleted." : "Item deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            if (msg.includes("Cannot delete item because it is used in chests or recipes")) {
                setConfirmModal({ isOpen: true, id: confirmModal.id, force: true });
            } else {
                toast.error(msg);
                setAlertModal({ isOpen: true, message: "Error: " + msg });
                closeConfirm();
            }
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "item_name", label: "Item Name", render: v => <span className="font-bold">{v}</span> },
        { key: "item_type", label: "Type" },
        { key: "max_stack_size", label: "Max Stack", align: "right" },
        { key: "max_durability", label: "Durability", align: "right", render: v => v || "-" }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                closeOnConfirm={false}
                title="Delete Item"
                message={confirmModal.force 
                    ? "This item is used in crafting recipes or chest transfers! Do you want to FORCE delete it AND all records containing it?"
                    : "Are you sure you want to delete this item?"}
                confirmText="Delete"
            />
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ isOpen: false, message: "" })} title="Error" message={alertModal.message} />
            <DataList
                title="Minecraft Items"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search item name or type..."
                itemName="items"
                basePath="/items"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}