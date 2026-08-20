import { useState } from "react";

export function useEventosSelection(filtered, eliminarEvento) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((e) => e.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (
      window.confirm(
        `¿Estás seguro de eliminar ${selectedIds.length} eventos?`
      )
    ) {
      try {
        await Promise.all(
          selectedIds.map((id) => eliminarEvento(id))
        );

        setSelectedIds([]);
      } catch (err) {
        alert("Hubo un error al eliminar algunos eventos.");
      }
    }
  };

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    handleBulkDelete,
  };
}