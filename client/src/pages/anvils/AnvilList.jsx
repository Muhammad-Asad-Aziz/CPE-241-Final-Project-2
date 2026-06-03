import React from "react";
import { toast } from "react-toastify";
import { listAnvils, deleteAnvil } from "../../api/anvils.api.js";
import DataList from "../../components/DataList.jsx";
import { ConfirmModal } from "../../components/Modal.jsx";

export default function AnvilList() {
  const fetchData = React.useCallback((params) => listAnvils(params), []);
  
  const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, id: null });
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleDelete = (id) => setConfirmModal({ isOpen: true, id });
  const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

  const confirmDelete = async () => {
    try {
      await deleteAnvil(confirmModal.id);
      closeConfirm();
      setRefreshTrigger((t) => t + 1); 
      toast.success("Anvil log deleted successfully.");
    } catch (e) {
      toast.error(String(e.message || e));
      closeConfirm();
    }
  };

  const columns = [
    { key: "id", label: "Anvil ID", render: v => <span className="font-bold">ANV-{v}</span> },
    { key: "player_username", label: "Player" },
    { key: "anvil_date", label: "Anvil Date", render: (v) => (v ? v.slice(0, 10) : "-") },
    { key: "total_xp_cost", label: "XP Cost", render: (v) => (v !== null ? `${v} Levels` : "0 Levels") },
    //{ key: "player_xp_before", label: "XP Before" },
    //{ key: "player_xp_after", label: "XP After" },
  ];

  return (
    <>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title="Delete Anvil Log"
        message={`Are you sure you want to delete anvil log record #${confirmModal.id}?`}
      />
      
      <DataList
        title="Anvil Jobs"
        fetchData={fetchData}
        columns={columns}
        searchPlaceholder="Search anvil ID, player username..."
        itemName="anvils"
        basePath="/anvils"  
        itemKey="id"           
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />
    </>
  );
}