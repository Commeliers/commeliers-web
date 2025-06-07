// src/pages/MyPageSaved.jsx
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';

function MyPageSaved() {
  const navigate = useNavigate();

  const items = [
    { label: '좋아요 누른 게시글', path: '/mypage/liked-posts' },
    { label: '저장한 부동산 정책', path: '/mypage/policies' },
    { label: '저장한 청약 정보', path: '/mypage/subscriptions' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 흐릿한 배경 이미지 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      {/* 페이지 내용 */}
      <div className="relative z-10 flex px-8 pt-12 items-start">
        {/* 사이드바 */}
        <Sidebar />

        {/* 오른쪽 메인 콘텐츠 */}
        <main className="flex-1 relative flex justify-center items-start py-16">
          <div className="flex flex-col items-center space-y-6 w-full max-w-3xl">
            {/* 상단 문구 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">내가 저장한 정보</h2>

            {/* 카드 리스트 */}
            {items.map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-white border border-blue-200 rounded-2xl shadow px-8 py-6 flex flex-col items-start gap-4 hover:shadow-lg transition"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {item.label}
                </span>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  바로가기
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyPageSaved;
