import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../lib/api";
import { ItemsTable } from "../components/ItemsTable";
import { AddItemModal } from "../components/AddItemModal";
import { EditItemModal } from "../components/EditItemModal";
import {
  CreateMaterialPayload,
  CreateServicePayload,
  EstimateItem,
  ItemType,
} from "../types";
import { formatCurrency, calculateEstimateTotal } from "../utils/formatting";
import { ConfirmDialog } from "../components/ConfirmDialog";

export const EstimateDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EstimateItem | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    itemId?: string;
    estimateId?: string;
  }>({ isOpen: false });

  const { data: estimateData, isLoading } = useQuery(
    api.estimate.getSingle(id || "")
  );
  const estimate = estimateData?.data;
  const updateEstimateMutation = useMutation(
    api.estimate.update(t("toasts.estimates.updated"))
  );
  const createItemMutation = useMutation(
    api.singleItem.create(t("toasts.items.created"))
  );
  const updateItemMutation = useMutation(
    api.singleItem.update(t("toasts.items.updated"))
  );
  const deleteItemMutation = useMutation(
    api.singleItem.delete(t("toasts.items.deleted"))
  );

  if (!id) {
    return (
      <div className="text-center py-12 text-red-600">
        {t("estimates.notFound")}
      </div>
    );
  }

  if (isLoading || !estimate) {
    return (
      <div className="text-center py-12 text-gray-600">
        {t("common.loading")}
      </div>
    );
  }

  const handleStartEditingName = () => {
    setNewName(estimate.name);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (newName.trim() && newName !== estimate.name) {
      updateEstimateMutation.mutate({
        id: estimate._id,
        name: newName,
      });
    }
    setIsEditingName(false);
  };

  const handleAddItem = async (
    payload: CreateMaterialPayload | CreateServicePayload
  ) => {
    const isMaterial = "quantity" in payload;

    createItemMutation.mutate({
      id: estimate._id,
      name: payload.name,
      type: isMaterial ? ItemType.MATERIAL : ItemType.SERVICE,
      ...(isMaterial
        ? {
            quantity: (payload as CreateMaterialPayload).quantity,
            unit: (payload as CreateMaterialPayload).unit,
            unitPrice: (payload as CreateMaterialPayload).unitPrice,
            totalPrice:
              (payload as CreateMaterialPayload).quantity *
              (payload as CreateMaterialPayload).unitPrice,
          }
        : {
            totalPrice: (payload as CreateServicePayload).totalPrice,
          }),
    });
    setIsAddItemModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmDialog({ isOpen: true, itemId, estimateId: estimate._id });
  };

  const handleConfirmDeleteItem = () => {
    if (confirmDialog.itemId && confirmDialog.estimateId) {
      deleteItemMutation.mutate({
        itemId: confirmDialog.itemId,
        estimateId: confirmDialog.estimateId,
      });
    }
    console.log(confirmDialog);
    setConfirmDialog({ isOpen: false });
  };

  const handleConfirmEditItem = async (
    payload: CreateMaterialPayload | CreateServicePayload
  ) => {
    if (editingItem) {
      const isMaterial = "quantity" in payload;

      updateItemMutation.mutate({
        itemId: editingItem._id,
        estimateId: estimate._id,
        name: payload.name,
        type: isMaterial ? ItemType.MATERIAL : ItemType.SERVICE,
        ...(isMaterial
          ? {
              quantity: (payload as CreateMaterialPayload).quantity,
              unit: (payload as CreateMaterialPayload).unit,
              unitPrice: (payload as CreateMaterialPayload).unitPrice,
              totalPrice:
                (payload as CreateMaterialPayload).quantity *
                (payload as CreateMaterialPayload).unitPrice,
            }
          : {
              totalPrice: (payload as CreateServicePayload).totalPrice,
            }),
      });
      setIsEditItemModalOpen(false);
      setEditingItem(null);
    }
  };

  const total = calculateEstimateTotal(estimate.items);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all"
          onClick={() => navigate("/")}
        >
          {t("common.back")}
        </button>

        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") setIsEditingName(false);
              }}
              autoFocus
              className="px-3 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 transition-all"
              onClick={handleSaveName}
              disabled={updateEstimateMutation.isPending}
            >
              {t("common.save")}
            </button>
            <button
              className="px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-60 transition-all"
              onClick={() => setIsEditingName(false)}
              disabled={updateEstimateMutation.isPending}
            >
              {t("common.cancel")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 m-0">
              {estimate.name}
            </h1>
            <button
              className="px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all"
              onClick={handleStartEditingName}
            >
              {t("estimateDetail.editName")}
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 m-0">
                {t("estimateDetail.itemsTitle")}
              </h2>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                onClick={() => setIsAddItemModalOpen(true)}
              >
                {t("estimateDetail.addItem")}
              </button>
            </div>

            <ItemsTable
              items={estimate.items}
              onDelete={handleDeleteItem}
              onEdit={(item) => {
                setEditingItem(item);
                setIsEditItemModalOpen(true);
              }}
              isDeleting={deleteItemMutation.isPending ? "" : null}
            />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                {t("common.total")}
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        isLoading={createItemMutation.isPending}
      />

      {editingItem && (
        <EditItemModal
          isOpen={isEditItemModalOpen}
          item={editingItem}
          onClose={() => {
            setIsEditItemModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleConfirmEditItem}
          isLoading={updateItemMutation.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={t("estimateDetail.deleteItemTitle")}
        message={t("estimateDetail.deleteItemMessage")}
        onConfirm={handleConfirmDeleteItem}
        onCancel={() => setConfirmDialog({ isOpen: false })}
        confirmLabel={t("common.delete")}
        isDangerous
      />
    </div>
  );
};
