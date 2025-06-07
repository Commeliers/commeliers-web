import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PostDetailModal({ postId, onClose, userEmail }) {
  const [post, setPost] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const res = await fetch(`${BASE_URL}/communities/detail/${postId}`);
        const data = await res.json();
        setPost(data.result);
      } catch (err) {
        console.error('게시글 상세 조회 실패:', err);
      }
    };
    fetchPostDetail();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/communities/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentInput }),
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prev) => ({
          ...prev,
          comments: [...prev.comments, data.result],
          commentCount: (prev.commentCount || 0) + 1,
        }));
        setCommentInput('');
        window.location.reload(); // ❗ 필요 시 제거 가능
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  if (!post) return null;

  const formatExactTime = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    let utcString = dateString;
    if (!dateString.endsWith('Z')) utcString += 'Z';
    const date = new Date(utcString);
    if (isNaN(date.getTime())) return '날짜 정보 없음';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-1">{post.title}</h3>
        <div className="text-xs text-gray-500 mb-4">
          작성 시간: {formatExactTime(post.createdAt)}
        </div>

        <p className="text-gray-700 mb-4">{post.content}</p>

        {post.attachments &&
          post.attachments.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`attachment-${i}`}
              className="mb-4 max-h-80 w-full object-contain rounded"
            />
          ))}

        <div className="mt-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">
            💬 댓글 ({post.commentCount ?? 0})
          </h4>
        </div>

        <div className="space-y-2 mb-3 mt-2">
          {post.comments?.map((cmt) => (
            <div key={cmt.commentId} className="border p-2 rounded bg-gray-100">
              <div className="text-sm font-medium text-gray-700">
                {cmt.userId}
              </div>
              <div className="text-sm text-gray-600">{cmt.content}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="댓글을 입력하세요"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetailModal;
