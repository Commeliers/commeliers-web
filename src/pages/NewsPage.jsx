import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';

// ✅ 컴포넌트 바깥에 위치시켜 ESLint 경고 제거
const tips = [
  '전세 계약 전 등기부등본을 반드시 확인하세요.',
  '부동산 중개수수료는 법정 요율을 초과할 수 없습니다.',
  '청약 가점제는 무주택 기간, 부양가족 수 등이 반영됩니다.',
  '매매 시 잔금일에 소유권 이전 등기를 신청해야 합니다.',
  '부동산 세금은 취득세, 재산세, 종부세로 구분됩니다.',
  '분양권 거래 시 전매제한 기간을 꼭 확인하세요.',
  '재개발 지역은 사업 단계별로 투자 리스크가 다릅니다.',
];

function NewsPage() {
  const navigate = useNavigate();
  const [randomTip, setRandomTip] = useState('');

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 흐릿한 배경 이미지 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 relative flex flex-col items-center pt-16">
          {/* 상단 문구 */}
          <div className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded mb-10">
            {randomTip}
          </div>

          {/* 카드 리스트 */}
          <div className="flex flex-col items-center space-y-6 w-full max-w-3xl">
            {[
              { title: '지역 별 청약 정보 제공', path: '/subscription-info' },
              { title: '부동산 뉴스', path: '/real-estate-news' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-white border border-blue-200 rounded-2xl shadow px-8 py-6 flex flex-col items-start gap-4 hover:shadow-lg transition"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {item.title}
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

export default NewsPage;
