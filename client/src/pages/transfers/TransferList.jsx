import React from "react";
import { toast } from "react-toastify";
import { listTransfers, deleteTransfer } from "../../api/transfers.api.js";
import { formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function TransferList() {
    const fetchData = React.useCallback((params) => listTransfers(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteTransfer(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Transfer record deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "Transfer ID", render: v => <span className="font-bold">TRN-{v}</span> },
        { key: "transfer_date", label: "Date", render: v => formatDate(v) },
        { key: "player_username", label: "Player", render: v => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{v}</span> },
        { key: "source_chest_id", label: "From Chest", render: (v, row) => v ? `Chest #${v} (${row.source_dimension})` : "Inventory" },
        { key: "destination_chest_id", label: "To Chest", render: (v, row) => v ? `Chest #${v} (${row.destination_dimension})` : "Inventory" }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Transfer"
                message="Are you sure you want to delete this transfer? The items will be wiped from the history."
                confirmText="Delete"
            />
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ isOpen: false, message: "" })} title="Error" message={alertModal.message} />
            <DataList
                title="Chest Transfers"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search by player username..."
                itemName="transfers"
                basePath="/transfers"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}