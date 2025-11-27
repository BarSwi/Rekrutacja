import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EstimateItem } from "../types";
import { formatCurrency } from "../utils/formatting";

interface ItemsTableProps {
  items: EstimateItem[];
  onDelete: (itemId: string) => void;
  onEdit: (item: EstimateItem) => void;
  isDeleting?: string | null;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onDelete,
  onEdit,
  isDeleting,
}) => {
  const { t } = useTranslation();
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-600 py-8">
        {t("itemsTable.noItems")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              {t("itemsTable.number")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              {t("itemsTable.type")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              {t("itemsTable.name")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              {t("itemsTable.quantity")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
              {t("itemsTable.unitPrice")}
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
              {t("itemsTable.value")}
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
              {t("itemsTable.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item._id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === "material"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.type === "material"
                    ? t("itemsTable.material")
                    : t("itemsTable.service")}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {item.quantity && item.unit ? (
                  <>
                    {item.quantity} {item.unit}
                  </>
                ) : (
                  "–"
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {item.unitPrice ? formatCurrency(item.unitPrice) : "–"}
              </td>
              <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                {formatCurrency(item.totalPrice)}
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2 justify-center">
                  <button
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    onClick={() => onEdit(item)}
                    disabled={isDeleting === item._id}
                  >
                    {t("itemsTable.edit")}
                  </button>
                  <button
                    className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    onClick={() => onDelete(item._id)}
                    disabled={isDeleting === item._id}
                  >
                    {isDeleting === item._id ? "..." : t("itemsTable.delete")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
