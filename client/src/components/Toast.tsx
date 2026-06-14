import React, { useEffect, useState } from 'react';

interface Props {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
}

const Toast = ({ message, type, isOpen, onClose }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose(), 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
      }`}
    >
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl min-w-72 border ${
        type === 'success'
          ? 'bg-gray-800 border-green-500/50'
          : 'bg-gray-800 border-red-500/50'
      }`}>
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {type === 'success' ? (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wide ${
            type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {type === 'success' ? 'Success' : 'Error'}
          </p>
          <p className="text-white text-sm mt-0.5">{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => { setVisible(false); setTimeout(() => onClose(), 300); }}
          className="text-gray-500 hover:text-white transition ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className={`h-1 rounded-b-xl mt-0.5 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } ${visible ? 'animate-shrink' : ''}`}
        style={{
          animation: visible ? 'shrink 3s linear forwards' : 'none'
        }}
      />

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;