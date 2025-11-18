// src/components/common/Modal.tsx

import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;