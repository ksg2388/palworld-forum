import React from "react";

interface CustomAlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlert = ({ isOpen, message, onClose }: CustomAlertProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <p className="text-center text-gray-800 mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
