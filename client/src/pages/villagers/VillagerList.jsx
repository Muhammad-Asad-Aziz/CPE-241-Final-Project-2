import React from "react";
import { toast } from "react-toastify";
import { listVillagers, deleteVillager } from "../../api/villagers.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function VillagerList() {
    const fetchData = React.useCallback((params) => listVillagers(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteVillager(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Villager deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "villager_name", label: "Name", render: v => <span className="font-bold">{v}</span> },
        { key: "profession", label: "Profession" },
        { key: "biome_type", label: "Biome" }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Villager"
                message="Are you sure you want to delete this villager?"
                confirmText="Delete"
            />
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ isOpen: false, message: "" })} title="Error" message={alertModal.message} />
            <DataList
                title="Villagers"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search name, profession, or biome..."
                itemName="villagers"
                basePath="/villagers"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}