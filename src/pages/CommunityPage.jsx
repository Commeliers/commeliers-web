// src/pages/CommunityPage.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import PostList from '../components/community/PostList';
import PostFormModal from '../components/community/PostFormModal';
import PostEditModal from '../components/community/PostEditModal';
import PostDetailModal from '../components/community/PostDetailModal';
import ConfirmDeleteModal from '../components/community/ConfirmDeleteModal';
import AlertModal from '../components/community/AlertModal';
import usePosts from '../hooks/usePosts';
import useLikes from '../hooks/useLikes';
import { useUserStore } from '../store/useUserStore';

function CommunityPage() {
  const [selectedBoard, setSelectedBoard] = useState('자유게시판');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postDetailModal, setPostDetailModal] = useState({ visible: false, postId: null });
  const POSTS_PER_PAGE = 4;

  const {
    posts,
    isSearching,
    searchResults,
    loadPostsFromServer,
    handleSearch,
    handleCreatePost,
    editModal,
    setEditModal,
    confirmEdit,
    confirmModal,
    setConfirmModal,
    confirmDelete,
    modalOpen,
    setModalOpen,
    titleInput,
    setTitleInput,
    contentInput,
    setContentInput,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    alertModal,
  } = usePosts(selectedBoard);

  const { handleLikePost } = useLikes(loadPostsFromServer, selectedBoard);

  const user = useUserStore((state) => state.user);
  const userEmail = user?.id || null;
  const userRole = user?.role || null;

  const displayPosts = isSearching ? searchResults : posts;
  const paginatedPosts = displayPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    loadPostsFromServer(selectedBoard);
  }, [selectedBoard, loadPostsFromServer]);

  const handleOpenDetailModal = (postId) => {
    setPostDetailModal({ visible: true, postId });
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />
      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />
        <main className="flex-1 px-8">
          <div className="flex flex-col items-center mt-10 mb-10">
            <h2 className="w-full max-w-3xl flex justify-between items-center text-3xl font-bold mb-3 text-gray-800">
              커뮤니티
            </h2>

            <div className="w-full max-w-3xl mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  🔍 검색
                </button>
                {isSearching && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      loadPostsFromServer(selectedBoard);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
                  >
                    ✕ 취소
                  </button>
                )}
              </div>
            </div>

            <div className="w-full max-w-3xl flex justify-between items-center">
              <div className="flex gap-3">
                {['자유게시판', '정보게시판'].map((board) => (
                  <button
                    key={board}
                    onClick={() => setSelectedBoard(board)}
                    className={`px-6 py-2 border rounded-full font-medium ${
                      selectedBoard === board
                        ? 'border-blue-500 text-blue-600'
                        : 'border-blue-300 text-blue-500'
                    } hover:bg-blue-50`}
                  >
                    {board}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm"
              >
                ✏️ 작성하기
              </button>
            </div>
          </div>

          <PostList
            posts={paginatedPosts}
            onEdit={setEditModal}
            onDelete={setConfirmModal}
            onLike={handleLikePost}
            onDetail={handleOpenDetailModal}
            userEmail={userEmail}
            userRole={userRole}
          />

          {Math.ceil(displayPosts.length / POSTS_PER_PAGE) > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                이전
              </button>
              {[...Array(Math.ceil(displayPosts.length / POSTS_PER_PAGE))].map((_, index) => {
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
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(displayPosts.length / POSTS_PER_PAGE))
                  )
                }
                disabled={currentPage === Math.ceil(displayPosts.length / POSTS_PER_PAGE)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <PostFormModal
          setModalOpen={setModalOpen}
          titleInput={titleInput}
          setTitleInput={setTitleInput}
          contentInput={contentInput}
          setContentInput={setContentInput}
          imageFile={imageFile}
          setImageFile={setImageFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          handleCreatePost={handleCreatePost}
        />
      )}

      {editModal.visible && (
        <PostEditModal
          editModal={editModal}
          setEditModal={setEditModal}
          confirmEdit={confirmEdit}
        />
      )}

      {postDetailModal.visible && (
        <PostDetailModal
          postId={postDetailModal.postId}
          onClose={() => setPostDetailModal({ visible: false, postId: null })}
          userEmail={userEmail}
        />
      )}

      {confirmModal.visible && (
        <ConfirmDeleteModal
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          confirmDelete={confirmDelete}
        />
      )}

      {alertModal.visible && (
        <AlertModal
          message={alertModal.message}
          type={alertModal.type}
          onClose={alertModal.onClose}
        />
      )}
    </div>
  );
}

export default CommunityPage;