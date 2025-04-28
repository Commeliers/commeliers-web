import Sidebar from '../components/Sidebar';
import mainImage from '../assets/mainpage.png';

function MainPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* ✅ 흐릿한 배경 이미지: 사이드바 제외 전체 화면에 깔림 */}
      <img
            src={mainImage}
            alt="배경"
            className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] object-cover"
          />

      {/* ✅ 페이지 내용 */}
      <div className="relative z-10 flex px-8 pt-12 items-start">
        {/* 사이드바 */}
        <Sidebar />

        {/* ✅ 오른쪽 메인 콘텐츠 */}
        <main className="flex-1 relative flex justify-center items-start py-16">
          <div className="flex flex-col items-center space-y-6 w-full max-w-3xl">
            {/* 상단 문구 */}
            <h2 className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded">
              오늘의 부동산 관련 지식 한 줄 팝업
            </h2>

            {/* 카드 리스트 */}
            {[
              { title: '부동산 관련 정보 제공' },
              { title: '부동산 관련 퀴즈' },
              { title: '부동산 지원 정책' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-white border border-blue-200 rounded-2xl shadow px-8 py-6 flex flex-col items-start gap-4 hover:shadow-lg transition"
>   
  <span className="text-lg font-semibold text-gray-900">
    {item.title}
  </span>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
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

export default MainPage;
