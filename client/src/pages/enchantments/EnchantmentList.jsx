import React from "react";
import { toast } from "react-toastify";
import { listEnchantments, deleteEnchantment } from "../../api/enchantments.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal } from "../../components/Modal.jsx";

export default function EnchantmentList() {
    const fetchData = React.useCallback((params) => listEnchantments(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteEnchantment(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Enchantment deleted.");
        } catch (e) {
            toast.error(String(e.message || e));
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "enchantment_name", label: "Enchantment Name", render: v => <span className="font-bold" style={{ color: "#a855f7" }}>{v}</span> },
        { key: "max_level", label: "Max Level", align: "right" }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Enchantment"
                message="Are you sure you want to delete this enchantment?"
                confirmText="Delete"
            />
            <DataList
                title="Enchantments"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search enchantment name..."
                itemName="enchantments"
                basePath="/enchantments"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}