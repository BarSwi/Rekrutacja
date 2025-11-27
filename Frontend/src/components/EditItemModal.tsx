import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import {
  CreateMaterialPayload,
  CreateServicePayload,
  EstimateItem,
  ItemType,
  Unit,
} from "../types";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMaterialPayload | CreateServicePayload) => void;
  item?: EstimateItem | null;
  isLoading?: boolean;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [itemType, setItemType] = useState<ItemType>(ItemType.MATERIAL);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<Unit>(Unit.PCS);
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const isFormValid = () => {
    if (!name.trim()) return false;

    if (itemType === ItemType.MATERIAL) {
      const qty = parseFloat(quantity);
      const price = parseFloat(unitPrice);
      return quantity && unitPrice && qty > 0 && price > 0;
    } else {
      const price = parseFloat(totalPrice);
      return totalPrice && price > 0;
    }
  };

  useEffect(() => {
    if (item && isOpen) {
      setName(item.name);
      setItemType(item.type as ItemType);
      if (item.type === ItemType.MATERIAL) {
        setQuantity(item.quantity?.toString() || "");
        setUnit(item.unit || Unit.PCS);
        setUnitPrice(item.unitPrice?.toString() || "");
      } else {
        setTotalPrice(item.totalPrice?.toString() || "");
      }
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (itemType === ItemType.MATERIAL) {
      if (name.trim() && quantity && unitPrice) {
        onSubmit({
          name: name.trim(),
          quantity: parseFloat(quantity),
          unit,
          unitPrice: parseFloat(unitPrice),
        });
        resetForm();
      }
    } else {
      if (name.trim() && totalPrice) {
        onSubmit({
          name: name.trim(),
          totalPrice: parseFloat(totalPrice),
        });
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setName("");
    setQuantity("");
    setUnit(Unit.PCS);
    setUnitPrice("");
    setTotalPrice("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={item ? t("editItemModal.title") : t("addItemModal.title")}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {!item && (
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-900">
              {t("editItemModal.itemType")}
            </label>
            <div className="flex gap-4">
              <label
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                  itemType === "material"
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <input
                  type="radio"
                  value="material"
                  checked={itemType === "material"}
                  onChange={(e) => setItemType(e.target.value as ItemType)}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <span className="text-sm font-medium">
                  {t("editItemModal.material")}
                </span>
              </label>
              <label
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                  itemType === "service"
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <input
                  type="radio"
                  value="service"
                  checked={itemType === "service"}
                  onChange={(e) => setItemType(e.target.value as ItemType)}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <span className="text-sm font-medium">
                  {t("editItemModal.service")}
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="item-name"
            className="block text-sm font-medium text-gray-900"
          >
            {t("editItemModal.name")}
          </label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("editItemModal.namePlaceholder")}
            disabled={isLoading}
            autoFocus
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
          />
        </div>

        {itemType === "material" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t("editItemModal.quantity")}
                </label>
                <input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t("editItemModal.unit")}
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  disabled={isLoading}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
                >
                  <option value={Unit.PCS}>
                    {t("editItemModal.units.pcs")}
                  </option>
                  <option value={Unit.SQM}>
                    {t("editItemModal.units.sqm")}
                  </option>
                  <option value={Unit.CUBM}>
                    {t("editItemModal.units.cubm")}
                  </option>
                  <option value={Unit.MB}>{t("editItemModal.units.mb")}</option>
                  <option value={Unit.KG}>{t("editItemModal.units.kg")}</option>
                  <option value={Unit.BAG}>
                    {t("editItemModal.units.bag")}
                  </option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="unit-price"
                className="block text-sm font-medium text-gray-900"
              >
                {t("editItemModal.unitPrice")}
              </label>
              <input
                id="unit-price"
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder={t("editItemModal.pricePlaceholder")}
                disabled={isLoading}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="total-price"
              className="block text-sm font-medium text-gray-900"
            >
              {t("editItemModal.totalPrice")}
            </label>
            <input
              id="total-price"
              type="number"
              step="0.01"
              min="0"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder={t("editItemModal.pricePlaceholder")}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading
              ? t("editItemModal.saving")
              : item
              ? t("editItemModal.submitButton")
              : t("addItemModal.submitButton")}
          </button>
        </div>
      </form>
    </Modal>
  );
};
