import { create } from 'zustand';

export const useSupportStore = create((set) => ({
  policies: [],

  // ✅ 정책 추가
  addPolicy: (item, nickname) =>
    set((state) => {
      const key = `savedPolicies_${nickname}`;
      const exists = state.policies.some((i) => i.title === item.title);
      if (exists) return state;

      const updated = [...state.policies, item];
      localStorage.setItem(key, JSON.stringify(updated));
      return { policies: updated };
    }),

  // ✅ 정책 삭제
  removePolicy: (title, nickname) =>
    set((state) => {
      const key = `savedPolicies_${nickname}`;
      const updated = state.policies.filter((i) => i.title !== title);
      localStorage.setItem(key, JSON.stringify(updated));
      return { policies: updated };
    }),

  // ✅ 초기 로딩
  load: (nickname) => {
    const key = `savedPolicies_${nickname}`;
    const pol = JSON.parse(localStorage.getItem(key) || '[]');
    set({ policies: pol });
  },
}));
