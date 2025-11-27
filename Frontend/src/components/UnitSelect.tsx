import React from "react";
import { useTranslation } from "react-i18next";
import { Unit } from "../types";

interface UnitSelectProps {
  value: Unit;
  onChange: (unit: Unit) => void;
  disabled?: boolean;
  translationPrefix?: string;
}

export const UnitSelect: React.FC<UnitSelectProps> = ({
  value,
  onChange,
  disabled = false,
  translationPrefix = "addItemModal",
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="unit" className="block text-sm font-medium text-gray-900">
        {t(`${translationPrefix}.unit`)}
      </label>
      <select
        id="unit"
        value={value}
        onChange={(e) => onChange(e.target.value as Unit)}
        disabled={disabled}
        className="cursor-pointer px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
      >
        <option value={Unit.PCS}>{t(`${translationPrefix}.units.pcs`)}</option>
        <option value={Unit.SQM}>{t(`${translationPrefix}.units.sqm`)}</option>
        <option value={Unit.CUBM}>
          {t(`${translationPrefix}.units.cubm`)}
        </option>

        <option value={Unit.KG}>{t(`${translationPrefix}.units.kg`)}</option>
        <option value={Unit.BAG}>{t(`${translationPrefix}.units.bag`)}</option>
      </select>
    </div>
  );
};
