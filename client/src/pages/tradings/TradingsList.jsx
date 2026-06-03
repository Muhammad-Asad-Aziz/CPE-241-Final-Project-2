import React from "react";
import { toast } from "react-toastify";
import { listTradings, deleteTrading } from "../../api/tradings.api.js";
import { formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function TradingsList() {
    const fetchData = React.useCallback(async (params) => {
        try {
            const res = await listTradings(params);
            return { data: res.data || [], total: res.total || 0 };
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }, []);

    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const handleDelete = (code) => setConfirmModal({ isOpen: true, id: code });
    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

    const confirmDelete = async () => {
        try {
            await deleteTrading(confirmModal.id);
            closeConfirm();
            setRefreshTrigger(t => t + 1);
            toast.success("Trading session deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "trade_code", label: "Trade Code", render: v => <span className="font-bold">{v}</span> },
        { key: "trade_date", label: "Date", render: v => v ? formatDate(new Date(v)) : "-" },
        { key: "player_name", label: "Player", render: v => <span style={{ color: "var(--primary)", fontWeight: 600 }}>{v}</span> },
        { key: "villager_name", label: "Villager" },
        { key: "profession", label: "Profession" },
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Trading Session"
                message={`Are you sure you want to delete trading session ${confirmModal.id}? This action cannot be undone.`}
                confirmText="Delete"
            />
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ isOpen: false, message: "" })}
                title="Error"
                message={alertModal.message}
            />
            <DataList
                title="Villager Trades"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search by player name or trade code..."
                itemName="tradings"
                basePath="/tradings"
                itemKey="trade_code"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}
