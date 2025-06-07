import React from 'react';

function AlertModal({ message, type }) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-lg px-6 py-3 z-50 border border-gray-300">
      <span className={`text-${type === 'error' ? 'red' : 'green'}-600`}>
        {message}
      </span>
    </div>
  );
}

export default AlertModal;
