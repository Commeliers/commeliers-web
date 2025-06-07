import { create } from 'zustand';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const useUserStore = create((set) => ({
  user: null, // 사용자 상태 (예: { user_id, id, email, ... })

  // 사용자 설정
  setUser: (userData) => set({ user: userData }),

  // 사용자 프로필 조회
  fetchUserProfile: async (token) => {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`프로필 조회 실패: ${res.status}`);
      }

      const data = await res.json();
      set({ user: data });
    } catch (error) {
      console.error('fetchUserProfile error:', error);
      set({ user: null });
    }
  },

  // 로그아웃 등에서 사용자 초기화
  clearUser: () => set({ user: null }),
}));
