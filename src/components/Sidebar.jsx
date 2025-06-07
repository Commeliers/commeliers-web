import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Bot,
  Mail,
  Pencil,
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function Sidebar() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const displayName =
    user?.id && user.id.includes('@')
      ? user.id.split('@')[0]
      : user?.id || '사용자';

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      const token = user?.token || null;
      if (token) {
        const res = await fetch(`${API_BASE}/user/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error('로그아웃 API 응답 에러:', res.status);
        }
      }
      localStorage.removeItem('userInfo');
      localStorage.removeItem('kakaoUserInfo');
      clearUser();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      alert('로그아웃 중 문제가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const stored = localStorage.getItem('userInfo');
      const token = stored ? JSON.parse(stored).token : null;

      if (!token) {
        alert('로그인 토큰이 없습니다.');
        return;
      }

      const res = await fetch(`${API_BASE}/user/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('서버 응답:', errorData);
        throw new Error('회원 탈퇴에 실패했습니다.');
      }

      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('kakaoUserInfo');
      clearUser();
      setDropdownOpen(false);
      setIsDeleteModalOpen(false);
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('❌ 회원 탈퇴 실패: ' + error.message);
    }
  };

  return (
    <>
      <aside className="w-64 h-[90vh] bg-white shadow-xl flex flex-col justify-between px-4 py-6">
        <div>
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <Home size={24} />
              <span>Homeprotect</span>
            </div>
          </div>

          <div className="w-full border border-blue-200 rounded-lg p-4 space-y-4 mb-6">
            <Link to="/main" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
              <Home size={20} /> <span>시작하기</span>
            </Link>
            <Link to="/community" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
              <MessageCircle size={20} /> <span>커뮤니티</span>
            </Link>
            <Link to="/scam-detect" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
              <Bot size={20} /> <span>전세 사기</span>
            </Link>
            <Link to="/news" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
              <Mail size={20} /> <span>소식</span>
            </Link>
            <Link to="/guide" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
              <Pencil size={20} /> <span>내 집 마련 가이드</span>
            </Link>
          </div>

          {user ? (
            <div className="relative w-full">
              <button
                onClick={toggleDropdown}
                className="w-full flex items-center justify-center gap-2 border border-blue-300 text-blue-600 px-4 py-2 rounded-lg bg-blue-50 font-semibold"
              >
                <User size={18} />
                {displayName}님
                <ChevronDown size={16} className={dropdownOpen ? 'rotate-180 transition' : 'transition'} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10"
                  >
                    <Link to="/mypage/edit" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                      내 정보 수정하기
                    </Link>
                    <Link to="/mypage/saved" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                      내가 저장한 정보
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      회원 탈퇴하기
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="w-full border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full mt-6 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        )}
      </aside>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[360px] text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">정말 탈퇴하시겠습니까?</h3>
            <p className="text-sm text-gray-600 mb-6">탈퇴하면 모든 정보가 삭제되며 복구할 수 없습니다.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
