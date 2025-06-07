import React from 'react';

function ConfirmDeleteModal({ confirmModal, setConfirmModal, confirmDelete }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 text-center space-y-4">
        <p className="text-lg font-medium text-gray-800">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setConfirmModal({ visible: false, postId: null })}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={confirmDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
