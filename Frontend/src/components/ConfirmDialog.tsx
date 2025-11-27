import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Potwierdź",
  cancelLabel = "Anuluj",
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg max-w-md w-11/12 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 m-0">{title}</h2>
        </div>
        <div className="px-6 py-6">
          <p className="text-gray-700 m-0">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex gap-3 justify-end">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
