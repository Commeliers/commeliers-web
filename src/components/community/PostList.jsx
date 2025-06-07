// src/components/community/PostList.jsx
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useState, useEffect } from 'react';

function PostList({ posts, onEdit, onDelete, onLike, onDetail, userEmail, userRole }) {
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    const saved = localStorage.getItem('likedPosts');
    if (saved) {
      setLikedPosts(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleLike = (postId, isLiked) => {
    const newLikedPosts = new Set(likedPosts);
    isLiked ? newLikedPosts.delete(postId) : newLikedPosts.add(postId);
    setLikedPosts(newLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify([...newLikedPosts]));
    onLike(postId, isLiked);
  };

  // ───────────────────────────────────────────────────────────────────────
  // getRelativeTime: UTC 기준으로 내려온 createdAt을 "몇분 전/몇시간 전/며칠 전"으로 표시
  const getRelativeTime = (dateString) => {
    if (!dateString) return '날짜 정보 없음';

    let utcString = dateString;
    if (!dateString.endsWith('Z')) {
      utcString = dateString + 'Z';
    }
    const postDate = new Date(utcString);
    if (isNaN(postDate.getTime())) return '날짜 정보 없음';

    const now = new Date();
    const diffMs = now - postDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) {
      return '방금 전';
    }
    if (diffMin < 60) {
      return `${diffMin}분 전`;
    }
    if (diffHour < 24) {
      return `${diffHour}시간 전`;
    }
    if (diffDay < 7) {
      return `${diffDay}일 전`;
    }

    const yyyy = postDate.getFullYear();
    const mm = String(postDate.getMonth() + 1).padStart(2, '0');
    const dd = String(postDate.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };
  // ───────────────────────────────────────────────────────────────────────

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="flex flex-col h-full">
      {/* 게시글 리스트: flex-grow 로 가변적 높이를 차지하며 스크롤 가능 */}
      <div className="flex-grow overflow-auto space-y-4 w-full max-w-4xl mx-auto py-6">
        {currentPosts.map((post) => {
          const postLocal = post.userId?.includes('@')
            ? post.userId.split('@')[0]
            : post.userId;
          const userLocal = userEmail?.includes('@')
            ? userEmail.split('@')[0]
            : userEmail;
          const isOwner = postLocal === userLocal;
          const isLiked = likedPosts.has(post.postId);

          return (
            <div
              key={post.postId}
              onClick={() => onDetail(post.postId)}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer group flex flex-row justify-between items-start gap-4"
            >
              {post.attachments?.length > 0 && (
                <img
                  src={post.attachments[0]}
                  alt="attachment"
                  className="w-[120px] h-[120px] object-cover rounded"
                />
              )}

              <div className="flex-1 space-y-2">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex justify-end gap-2"
                >
                  {isOwner && (
                    <>
                      <button
                        onClick={() =>
                          onEdit({
                            visible: true,
                            postId: post.postId,
                            title: post.title,
                            content: post.content,
                          })
                        }
                        className="text-sm text-blue-500 hover:underline"
                      >
                        ✏️ 수정
                      </button>
                      <button
                        onClick={() =>
                          onDelete({ visible: true, postId: post.postId })
                        }
                        className="text-sm text-red-500 hover:underline"
                      >
                        🗑️ 삭제
                      </button>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-blue-800 group-hover:underline">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {post.content}
                </p>

                <div className="text-xs text-gray-500 flex justify-between">
                  <span>작성자: {post.userId}</span>
                  <span>{getRelativeTime(post.createdAt)}</span>
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="pt-2 flex justify-between items-center border-t"
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleLike(post.postId, isLiked)}
                      className={`text-lg p-1 rounded-full border transition-all ${
                        isLiked
                          ? 'bg-red-100 border-red-500 text-red-500'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                    <span className="text-sm text-gray-700">
                      {post.likeCount || 0}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    💬 {post.commentCount ?? 0}개의 댓글
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 바: 항상 컨테이너 하단에 배치 */}
      <div className="w-full max-w-4xl mx-auto py-4 border-t border-gray-200">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostList;
