import React from "react";
import { toast } from "react-toastify";
import { listChests, deleteChest } from "../../api/chests.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function ChestList() {
    const fetchData = React.useCallback((params) => listChests(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteChest(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Chest location deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "Chest ID", render: v => <span className="font-bold">Chest #{v}</span> },
        { key: "dimension", label: "Dimension" },
        { key: "x_coordinates", label: "X", align: "right" },
        { key: "y_coordinates", label: "Y", align: "right" },
        { key: "z_coordinates", label: "Z", align: "right" }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Chest"
                message="Are you sure you want to delete this chest location?"
                confirmText="Delete"
            />
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ isOpen: false, message: "" })} title="Error" message={alertModal.message} />
            <DataList
                title="Storage Chests"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search dimension..."
                itemName="chests"
                basePath="/chests"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}