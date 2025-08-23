import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Icons theo type
const icons = {
  success: (className) => <CheckCircleIcon className={className} />,
  error: (className) => <XCircleIcon className={className} />,
};

const Alert = ({ message, type = "success", duration = 4000, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!duration) return; // Nếu muốn Alert không auto-ẩn
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!show) return null;

  const baseStyle =
    "fixed top-20 right-6 w-80 sm:w-96 p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform z-[9999]";
  const typeStyles = {
    success:
      "bg-green-50 text-gray-800 border-l-4 border-green-500 dark:bg-green-900/90 dark:text-gray-100 dark:border-green-300",
    error:
      "bg-red-50 text-gray-800 border-l-4 border-red-500 dark:bg-red-900/90 dark:text-gray-100 dark:border-red-300",
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          80% { transform: translateX(-5%); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>

      <div
        className={`${baseStyle} ${typeStyles[type]} animate-slide-in-right backdrop-blur-sm`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]("h-6 w-6 text-green-500 dark:text-green-300")}
          </div>

          {/* Message */}
          <div className="flex-1 text-sm font-semibold break-words">
            {message}
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
            aria-label="Close alert"
          >
            <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-200" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Alert;
