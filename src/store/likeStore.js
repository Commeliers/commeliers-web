import { create } from 'zustand';

export const useLikeStore = create((set) => ({
  likedPosts: [],

  // ✅ 좋아요 토글
  toggleLike: (post, nickname) =>
    set((state) => {
      const key = `likedPosts_${nickname}`;
      const exists = state.likedPosts.find((p) => p.title === post.title);
      const updated = exists
        ? state.likedPosts.filter((p) => p.title !== post.title)
        : [...state.likedPosts, post];

      localStorage.setItem(key, JSON.stringify(updated));
      return { likedPosts: updated };
    }),

  // ✅ 초기 로딩
  loadLikes: (nickname) => {
    const key = `likedPosts_${nickname}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    set({ likedPosts: stored });
  },

  // ✅ 좋아요 취소
  removeLike: (title, nickname) =>
    set((state) => {
      const key = `likedPosts_${nickname}`;
      const updated = state.likedPosts.filter((p) => p.title !== title);
      localStorage.setItem(key, JSON.stringify(updated));
      return { likedPosts: updated };
    }),
}));
