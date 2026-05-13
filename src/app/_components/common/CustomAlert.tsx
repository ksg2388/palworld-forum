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
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <p className="text-center text-gray-800 mb-6 whitespace-pre-wrap">
          {formattedMessage}
        </p>
        <div className="flex justify-center gap-3">
          {secondAdditionalButton && (
            <button
              onClick={secondAdditionalButton.onClick}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 whitespace-nowrap"
            >
              {secondAdditionalButton.text}
            </button>
          )}
          {additionalButton && (
            <button
              onClick={additionalButton.onClick}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 whitespace-nowrap"
            >
              {additionalButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
