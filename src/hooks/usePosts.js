import { useState, useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function usePosts(selectedBoard, userEmail) {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editModal, setEditModal] = useState({ visible: false, postId: null, title: '', content: '' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, postId: null });
  const [alertModal, setAlertModal] = useState({ visible: false, message: '', type: 'info' });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const showAlert = (message, type = 'info') => {
    setAlertModal({ visible: true, message, type });
    setTimeout(() => setAlertModal({ visible: false, message: '', type: 'info' }), 2000);
  };

  const loadPostsFromServer = useCallback(async (category = selectedBoard) => {
    const endpoint = category === '자유게시판' ? 'free' : 'info';
    try {
      const res = await fetch(`${BASE_URL}/communities/${endpoint}`);
      const data = await res.json();
      if (data.result) {
        setPosts(data.result);
        setIsSearching(false);
        setSearchResults([]);
      }
    } catch (e) {
      showAlert('게시글 불러오기 실패', 'error');
      console.error('[❌ fetch 오류]', e);
    }
  }, [selectedBoard]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadPostsFromServer(selectedBoard);
      return;
    }
    try {
      setIsSearching(true);
      const res = await fetch(`${BASE_URL}/communities/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data.result) {
        setSearchResults(data.result);
        showAlert(`${data.result.length}개의 검색 결과를 찾았습니다.`, 'success');
      } else {
        setSearchResults([]);
        showAlert('검색 결과가 없습니다.', 'info');
      }
    } catch {
      showAlert('검색 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleCreatePost = async () => {
    if (!titleInput.trim() || !contentInput.trim()) return;
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token) return showAlert('로그인 정보가 없습니다.', 'error');

    const formData = new FormData();
    formData.append('title', titleInput);
    formData.append('content', contentInput);
    formData.append('category', selectedBoard === '자유게시판' ? 'FREE' : 'INFO');
    formData.append('userId', userEmail);
    if (imageFile) formData.append('attachments', imageFile);

    try {
      const res = await fetch(`${BASE_URL}/communities/post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('게시글이 등록되었습니다.', 'success');
        setModalOpen(false);
        setTitleInput('');
        setContentInput('');
        setImageFile(null);
        setImagePreview(null);
        loadPostsFromServer(selectedBoard);
      } else {
        showAlert(data.message || '게시글 등록 실패', 'error');
      }
    } catch {
      showAlert('서버 오류로 게시글 등록 실패', 'error');
    }
  };

  const confirmEdit = async () => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    try {
      const res = await fetch(`${BASE_URL}/communities/${editModal.postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editModal.title,
          content: editModal.content,
          boardType: selectedBoard === '자유게시판' ? 'FREE' : 'INFO',
          attachments: [],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('게시글이 수정되었습니다.', 'success');
        setEditModal({ visible: false, postId: null, title: '', content: '' });
        loadPostsFromServer(selectedBoard);
      } else {
        showAlert(data.message || '수정 실패', 'error');
      }
    } catch {
      showAlert('서버 오류로 수정 실패', 'error');
    }
  };

  const confirmDelete = async () => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    try {
      const res = await fetch(`${BASE_URL}/communities/${confirmModal.postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 204) {
        showAlert('게시글이 삭제되었습니다.', 'success');
        loadPostsFromServer(selectedBoard);
      } else {
        showAlert('삭제 실패', 'error');
      }
    } catch {
      showAlert('서버 오류로 삭제 실패', 'error');
    } finally {
      setConfirmModal({ visible: false, postId: null });
    }
  };

  return {
    posts,
    isSearching,
    searchResults,
    loadPostsFromServer,
    handleSearch,
    handleCreatePost,
    confirmEdit,
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
    editModal,
    setEditModal,
    confirmModal,
    setConfirmModal,
    alertModal,
    showAlert,
  };
}

export default usePosts;
