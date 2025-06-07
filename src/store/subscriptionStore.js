import { create } from 'zustand';

export const useSubscriptionStore = create((set) => ({
  saved: [],

  // ✅ nickname 기반 데이터 로딩
  load: (nickname) => {
    const key = `savedSubscriptions_${nickname}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    set({ saved: data });
  },

  // ✅ nickname 기반 저장
  add: (item, nickname) =>
    set((state) => {
      const key = `savedSubscriptions_${nickname}`;
      const exists = state.saved.some((i) => i.title === item.title);
      if (exists) return state;
      const updated = [...state.saved, item];
      localStorage.setItem(key, JSON.stringify(updated));
      return { saved: updated };
    }),

  // ✅ nickname 기반 삭제
  remove: (title, nickname) =>
    set((state) => {
      const key = `savedSubscriptions_${nickname}`;
      const updated = state.saved.filter((i) => i.title !== title);
      localStorage.setItem(key, JSON.stringify(updated));
      return { saved: updated };
    }),
}));
