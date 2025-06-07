import { useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function useLikes(loadPostsFromServer, selectedBoard) {
  const handleLikePost = useCallback(async (postId, isLiked) => {
    console.log('🔍 좋아요 처리:', { postId, isLiked });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;
    const userId = userInfo?.id;

    if (!token || !userId) return;

    const method = isLiked ? 'PATCH' : 'POST';
    const url = `${BASE_URL}/communities/like/${postId}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('좋아요 처리 실패:', result.message || res.status);
        alert('좋아요 처리 실패: ' + (result.message || '서버 에러'));
        return;
      }

      // ✅ 리스트 새로고침
      await loadPostsFromServer(selectedBoard);
    } catch (err) {
      console.error('좋아요 처리 중 오류 발생:', err);
    }
  }, [loadPostsFromServer, selectedBoard]);

  return { handleLikePost };
}

export default useLikes;
