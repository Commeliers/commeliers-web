import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';

function GuidePage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 흐릿한 배경 이미지 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] object-cover"
      />

      {/* 전체 레이아웃 */}
      <div className="relative z-10 flex px-8 pt-12 items-start">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-8 flex flex-col items-center justify-center">
          {/* 제목 + 설명 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">내 집 마련 가이드</h2>
            <p className="text-gray-500">
              집 계약시 알아야 할 체크 리스트를 확인하고,<br />
              월 비용 지출을 관리하세요.
            </p>
          </div>

          {/* 카드들 */}
          <div className="flex flex-col gap-8 w-full max-w-3xl">
            {[
              { title: '집 계약 체크 리스트', link: '#' },
              { title: '월 지출 비용', link: '#' },
            ].map((item, i) => (
              <div
                key={i}
                className="w-full bg-white/80 backdrop-blur-sm border border-blue-300 rounded-xl px-8 py-6 flex items-center justify-between shadow hover:shadow-md transition"
              >
                <span className="text-lg font-bold text-gray-800">{item.title}</span>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 text-sm">
                  확인하기
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
