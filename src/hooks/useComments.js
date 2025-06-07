import { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function useComments() {
  const [commentModal, setCommentModal] = useState({ visible: false, postId: null, comments: [] });
  const [commentInput, setCommentInput] = useState('');
  const [editCommentModal, setEditCommentModal] = useState({ visible: false, commentId: null, content: '' });

  const handleShowComments = async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/communities/${postId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setCommentModal({ visible: true, postId, comments: data.result || [] });
      } else {
        alert('댓글을 불러올 수 없습니다.');
      }
    } catch {
      alert('댓글 불러오기 실패');
    }
  };

  const handleCreateComment = async () => {
    if (!commentInput.trim()) return;
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token) return alert('로그인 정보가 없습니다.');

    try {
      const res = await fetch(`${BASE_URL}/communities/comments/${commentModal.postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentInput }),
      });

      if (res.ok) {
        setCommentInput('');
        handleShowComments(commentModal.postId);
      } else {
        alert('댓글 등록 실패');
      }
    } catch {
      alert('서버 오류로 댓글 등록 실패');
    }
  };

  const handleEditComment = (comment) => {
    setEditCommentModal({ visible: true, commentId: comment.commentId, content: comment.content });
  };

  const confirmEditComment = async () => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    try {
      const res = await fetch(`${BASE_URL}/communities/comments/${editCommentModal.commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editCommentModal.content }),
      });

      if (res.ok) {
        setEditCommentModal({ visible: false, commentId: null, content: '' });
        handleShowComments(commentModal.postId);
      } else {
        alert('댓글 수정 실패');
      }
    } catch {
      alert('서버 오류로 댓글 수정 실패');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    try {
      const res = await fetch(`${BASE_URL}/communities/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        handleShowComments(commentModal.postId);
      } else {
        alert('댓글 삭제 실패');
      }
    } catch {
      alert('서버 오류로 댓글 삭제 실패');
    }
  };

  return {
    commentModal,
    setCommentModal,
    commentInput,
    setCommentInput,
    editCommentModal,
    setEditCommentModal,
    handleShowComments,
    handleCreateComment,
    handleEditComment,
    confirmEditComment,
    handleDeleteComment,
  };
}

export default useComments;
