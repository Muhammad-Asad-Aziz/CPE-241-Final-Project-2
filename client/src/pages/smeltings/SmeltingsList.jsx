import React from "react";
import { toast } from "react-toastify";
import { listSmeltings, deleteSmelting } from "../../api/smeltings.api.js";
import { formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function SmeltingsList() {
    const fetchData = React.useCallback((params) => listSmeltings(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteSmelting(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Smelting record deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "Smelting ID", render: v => <span className="font-bold">SMLT-{v}</span> },
        { key: "smelt_date", label: "Date", render: v => formatDate(new Date(v)) },
        { key: "player_id", label: "Player ID", render: v => `Player ${v}` },
        { key: "furnace_location_xyz", label: "Location (X,Y,Z)", render: v => `[${v}]` }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen} onClose={closeConfirm} onConfirm={confirmDelete}
                title="Delete Smelting Job" message="Are you sure you want to delete this job?" confirmText="Delete"
            />
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ isOpen: false, message: "" })} title="Error" message={alertModal.message} />
            <DataList
                title="Smelting Jobs" fetchData={fetchData} columns={columns}
                searchPlaceholder="Search by ID or Location..." itemName="smeltings" basePath="/smeltings"
                itemKey="id" onDelete={handleDelete} refreshTrigger={refreshTrigger}
            />
        </>
    );
}