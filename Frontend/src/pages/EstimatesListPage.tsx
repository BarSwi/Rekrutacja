import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../lib/api";
import { CreateEstimateModal } from "../components/CreateEstimateModal";
import { EstimateCard } from "../components/EstimateCard";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const EstimatesListPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    estimateId?: string;
  }>({ isOpen: false });

  const {
    data: listData,
    isLoading,
    isError,
  } = useQuery(api.estimate.getPaginated(0, 100));
  const estimates = listData?.data || [];

  const createMutation = useMutation(
    api.estimate.create(t("toasts.estimates.created"))
  );

  const deleteMutation = useMutation(
    api.estimate.delete(t("toasts.estimates.deleted"))
  );
  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        {t("estimates.loadError")}
      </div>
    );
  }

  const handleCreateEstimate = async (name: string) => {
    await createMutation.mutateAsync({ data: { name, items: [] } });
    setIsModalOpen(false);
  };

  const handleDeleteEstimate = (id: string) => {
    setConfirmDialog({ isOpen: true, estimateId: id });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.estimateId) {
      deleteMutation.mutate({ id: confirmDialog.estimateId });
    }
    setConfirmDialog({ isOpen: false });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900 m-0">
          {t("estimates.title")}
        </h1>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          {t("estimates.newButton")}
        </button>
      </header>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">
          {t("common.loading")}
        </div>
      ) : estimates.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-4">
          <p className="text-gray-600">{t("estimates.noEstimates")}</p>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            {t("estimates.createFirst")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {estimates.map((estimate: any) => (
            <EstimateCard
              key={estimate.id}
              estimate={estimate}
              onDelete={() => handleDeleteEstimate(estimate.id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      <CreateEstimateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEstimate}
        isLoading={createMutation.isPending}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={t("estimates.deleteTitle")}
        message={t("estimates.deleteMessage")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false })}
        confirmLabel={t("common.delete")}
        isDangerous
      />
    </div>
  );
};
