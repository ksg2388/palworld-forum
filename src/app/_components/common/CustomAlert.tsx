import React from "react";

interface AdditionalButtonProps {
  text: string;
  onClick: () => void;
}

interface CustomAlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  additionalButton?: AdditionalButtonProps;
  secondAdditionalButton?: AdditionalButtonProps;
}

const CustomAlert = ({
  isOpen,
  message,
  onClose,
  additionalButton,
  secondAdditionalButton,
}: CustomAlertProps) => {
  if (!isOpen) return null;

  // \n 문자를 실제 줄바꿈으로 변환
  const formattedMessage = message.replace(/\\n/g, "\n");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <p className="text-center text-gray-800 mb-6 whitespace-pre-wrap">
          {formattedMessage}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 whitespace-nowrap"
          >
            확인
          </button>
          {additionalButton && (
            <button
              onClick={additionalButton.onClick}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 whitespace-nowrap"
            >
              {additionalButton.text}
            </button>
          )}
          {secondAdditionalButton && (
            <button
              onClick={secondAdditionalButton.onClick}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 whitespace-nowrap"
            >
              {secondAdditionalButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
