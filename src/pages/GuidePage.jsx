import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';

// ✅ 부동산 팁 배열 (컴포넌트 외부)
const tips = [
  '부동산 매매계약서 작성 시 특약사항을 꼭 확인하세요.',
  '전세 계약 시 전입신고와 확정일자를 반드시 받으세요.',
  '재건축 아파트는 투자 전 조합 설립 여부를 확인하세요.',
  '실거래가 조회는 국토교통부 실거래가 공개시스템을 활용하세요.',
  '중개수수료는 거래금액에 따라 법정 요율이 정해져 있습니다.',
  '등기부등본은 반드시 원본을 확인하고 말소기준등본 여부를 체크하세요.',
  '소유권 이전 등기는 보통 잔금일에 처리합니다.',
];

function GuidePage() {
  const navigate = useNavigate();
  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

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

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 relative flex justify-center items-start py-16">
          <div className="flex flex-col items-center space-y-6 w-full max-w-3xl">
            {/* 랜덤 부동산 지식 팝업 */}
            <h2 className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded">
              {randomTip}
            </h2>

            {/* 카드 리스트 */}
            {[
              { title: '집 계약 체크 리스트', path: '/contract-checklist' },
              { title: '월 지출 비용', path: '/expense' },
              { title: '내 집 마련 시뮬레이션', path: '/simulation' },
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

export default GuidePage;
