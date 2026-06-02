import React from "react";
import { toast } from "react-toastify";
import { listPlayers, deletePlayer } from "../../api/players.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function PlayerList() {
    const fetchData = React.useCallback((params) => listPlayers(params), []);
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null, force: false });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null, force: false });

    const handleDelete = (id) => {
        setConfirmModal({ isOpen: true, id, force: false });
    };

    const confirmDelete = async () => {
        try {
            await deletePlayer(confirmModal.id, confirmModal.force);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success(confirmModal.force ? "Player and related transfers deleted." : "Player deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            if (msg.includes("Cannot delete player because they have existing chest transfers")) {
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
        { key: "username", label: "Username", render: v => <span className="font-bold">{v}</span> },
        { key: "current_xp_level", label: "XP Level", align: "right" },
        { key: "health_points", label: "Health Points", align: "right", render: v => <span style={{ color: '#ef4444' }}>{v} ♥</span> }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                closeOnConfirm={false}
                title="Delete Player"
                message={confirmModal.force 
                    ? "This player has chest transfers. Do you want to delete the player AND all their transfers?"
                    : "Are you sure you want to delete this player?"}
                confirmText="Delete"
            />
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ isOpen: false, message: "" })}
                title="Error"
                message={alertModal.message}
            />
            <DataList
                title="Players"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search username..."
                itemName="players"
                basePath="/players"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}