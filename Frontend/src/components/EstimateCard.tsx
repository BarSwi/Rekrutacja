import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Estimate } from "../types";
import {
  formatCurrency,
  formatDate,
  calculateEstimateTotal,
} from "../utils/formatting";

interface EstimateCardProps {
  estimate: Estimate;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const EstimateCard: React.FC<EstimateCardProps> = ({
  estimate,
  onDelete,
  isDeleting = false,
}) => {
  const { t } = useTranslation();
  const total = estimate.total;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link
        to={`/estimate/${estimate._id}`}
        className="flex-1 p-5 text-gray-900 no-underline flex flex-col gap-2"
      >
        <h3 className="text-lg font-semibold text-gray-900 m-0">
          {estimate.name}
        </h3>
        <p className="text-sm text-gray-600 m-0">
          {formatDate(estimate.createdAt)}
        </p>
        <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold mt-auto">
          <span className="text-gray-600">{t("estimateCard.total")}</span>
          <span className="text-blue-600 text-base">
            {formatCurrency(total)}
          </span>
        </div>
      </Link>
      <button
        className="mx-3 mb-3 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        onClick={onDelete}
        disabled={isDeleting}
        title={t("estimateCard.deleteTitle")}
      >
        {isDeleting ? "..." : "✕"}
      </button>
    </div>
  );
};
