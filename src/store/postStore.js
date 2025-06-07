import { create } from 'zustand';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const usePostStore = create((set) => ({
  posts: [],
  postDetail: null,

  // 게시글 목록 불러오기
  loadPostsFromServer: async (category = '자유게시판') => {
    const url =
      category === '정보게시판'
        ? `${API_BASE}/communities/info`
        : `${API_BASE}/communities/free`;

    try {
      const res = await fetch(url);
      const result = await res.json();

      if (Array.isArray(result.result)) {
        set({ posts: result.result });
      } else {
        console.error('예상치 못한 응답 구조:', result);
        set({ posts: [] });
      }
    } catch (err) {
      console.error('게시글 로드 실패:', err);
      set({ posts: [] });
    }
  },

  // 게시글 상세 보기
  loadPostDetail: async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/communities/detail/${postId}`);
      const result = await res.json();
      set({ postDetail: result.data });
    } catch (err) {
      console.error('상세 조회 실패:', err);
    }
  },

  // 로컬 저장 - 추가
  addPostLocal: (post, nickname) =>
    set((state) => {
      const key = `myPosts_${nickname}`;
      const updated = [post, ...state.posts];
      localStorage.setItem(key, JSON.stringify(updated));
      return { posts: updated };
    }),

  // 로컬 저장 - 삭제
  removePostLocal: (title, nickname) =>
    set((state) => {
      const key = `myPosts_${nickname}`;
      const updated = state.posts.filter((p) => p.title !== title);
      localStorage.setItem(key, JSON.stringify(updated));
      return { posts: updated };
    }),

  // 로컬 저장 - 불러오기
  loadPostsFromLocal: (nickname) => {
    const key = `myPosts_${nickname}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    set({ posts: stored });
  },
}));
