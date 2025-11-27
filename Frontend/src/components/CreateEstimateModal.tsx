import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";

interface CreateEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

export const CreateEstimateModal: React.FC<CreateEstimateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName("");
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t("createEstimateModal.title")}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="estimate-name"
            className="block text-sm font-medium text-gray-900"
          >
            {t("createEstimateModal.label")}
          </label>
          <input
            id="estimate-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("createEstimateModal.placeholder")}
            disabled={isLoading}
            autoFocus
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-600"
          />
        </div>
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
            disabled={isLoading || !name.trim()}
          >
            {isLoading
              ? t("createEstimateModal.creating")
              : t("createEstimateModal.submitButton")}
          </button>
        </div>
      </form>
    </Modal>
  );
};
