import React from 'react';

function PostEditModal({ editModal, setEditModal, confirmEdit }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 space-y-4">
        <h3 className="text-lg font-medium text-gray-800">게시글 수정</h3>
        <input
          type="text"
          value={editModal.title}
          onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
          className="w-full p-2 border rounded-md"
        />
        <textarea
          value={editModal.content}
          onChange={(e) => setEditModal({ ...editModal, content: e.target.value })}
          className="w-full p-2 border rounded-md min-h-[100px]"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditModal({ visible: false, postId: null, title: '', content: '' })}
            className="px-4 py-2 border rounded-md"
          >
            취소
          </button>
          <button
            onClick={confirmEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostEditModal;
