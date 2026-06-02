import React from "react";
import { toast } from "react-toastify";
import { listMinings, deleteMining } from "../../api/minings.api.js";
import { formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function MiningList() {
    const fetchData = React.useCallback((params) => listMinings(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteMining(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Mining record deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "Mining ID", render: v => <span className="font-bold">MN-{v}</span> },
        { key: "mining_date", label: "Date", render: v => formatDate(v) },
        { key: "player_id", label: "Player_id", render: v => <span style={{ color: "var(--primary)", fontWeight: 600 }}>Player {v}</span> },
        { key: "biome_name", label: "Biome", render: v => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{v}</span> },
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Mining Record"
                message="Are you sure you want to delete this mining trip? The items will be wiped from the history."
                confirmText="Delete"
            />
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ isOpen: false, message: "" })} title="Error" message={alertModal.message} />
            <DataList
                title="Mining Trips"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search by player id..."
                itemName="minings"
                basePath="/minings"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}