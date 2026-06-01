import React from "react";
import { toast } from "react-toastify";
import { listCraftings, deleteCrafting } from "../../api/craftings.api.js";
import { listPlayers } from "../../api/players.api.js"; 
import { formatDate } from "../../utils.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal, AlertModal } from "../../components/Modal.jsx";

export default function CraftingsList() {

    const fetchData = React.useCallback(async (params) => {
        try {
            const res = await listCraftings(params);
            const data = res.data || res || [];

            const total = res.total || data.length || 0; 
            
            return { data, total };
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }, []);

    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, message: "" });
    const [refreshTrigger, setRefreshTrigger] = React.useState(0);

    const [players, setPlayers] = React.useState([]);

    React.useEffect(() => {
        listPlayers({ limit: 1000 })
            .then(res => setPlayers(res.data || []))
            .catch(err => console.error("Failed to load players", err));
    }, []);

    const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });
    const handleDelete = (id) => setConfirmModal({ isOpen: true, id });

    const confirmDelete = async () => {
        try {
            await deleteCrafting(confirmModal.id);
            closeConfirm();
            setRefreshTrigger((t) => t + 1);
            toast.success("Crafting record deleted.");
        } catch (e) {
            const msg = String(e.message || e);
            toast.error(msg);
            setAlertModal({ isOpen: true, message: "Error: " + msg });
            closeConfirm();
        }
    };

    const columns = [
        { key: "id", label: "Crafting ID", render: v => <span className="font-bold">CRF-{v}</span> },
        { key: "crafting_date", label: "Date", render: v => formatDate(new Date(v)) },
        { 
            key: "player_id", 
            label: "Player", 
            render: v => {
                const foundPlayer = players.find(p => p.id === v);
                const displayName = foundPlayer ? foundPlayer.username : `Player ${v}`;
                return <span style={{ color: "var(--primary)", fontWeight: 600 }}>{displayName}</span>;
            } 
        },
        { key: "session_id", label: "Session ID", render: v => `Session ${v}` },
        { key: "qty_wanted", label: "Qty Wanted", render: v => `${v} units` }
    ];

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmDelete}
                title="Delete Crafting"
                message="Are you sure you want to delete this crafting record? This action cannot be undone."
                confirmText="Delete"
            />
            <AlertModal 
                isOpen={alertModal.isOpen} 
                onClose={() => setAlertModal({ isOpen: false, message: "" })} 
                title="Error" 
                message={alertModal.message} 
            />
            <DataList
                title="Craftings"
                fetchData={fetchData}
                columns={columns}
                searchPlaceholder="Search by ID..."
                itemName="craftings"
                basePath="/craftings"
                itemKey="id"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </>
    );
}