import React from 'react';

function CommentModal({
  commentModal,
  setCommentModal,
  commentInput,
  setCommentInput,
  handleCreateComment,
  handleEditComment,
  handleDeleteComment,
  editCommentModal,
  setEditCommentModal,
  confirmEditComment,
  userEmail
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] max-h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">댓글</h3>
          <button
            onClick={() => setCommentModal({ visible: false, postId: null, comments: [] })}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {commentModal.comments.map((comment, index) => (
            <div key={index} className="border-b pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{comment.content}</p>
                  <span className="text-xs text-gray-400">{comment.time || '방금 전'}</span>
                </div>
                {comment.userId === userEmail && (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEditComment(comment)}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            placeholder="댓글을 입력하세요..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[60px] resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreateComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              댓글 등록
            </button>
          </div>
        </div>

        {editCommentModal.visible && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">댓글 수정</h3>
              <textarea
                value={editCommentModal.content}
                onChange={(e) => setEditCommentModal({ ...editCommentModal, content: e.target.value })}
                className="w-full p-2 border rounded-md min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditCommentModal({ visible: false, commentId: null, content: '' })}
                  className="px-4 py-2 border rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={confirmEditComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentModal;
