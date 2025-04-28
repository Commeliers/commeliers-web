import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';

function DetectPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 흐릿한 배경 이미지 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] object-cover"
      />

      {/* 레이아웃: 사이드바 + 메인 */}
      <div className="relative z-10 flex px-8 pt-12 items-start">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-4 flex flex-col justify-start">
          {/* 제목 + 설명 */}
          <div className="text-center pt-16 mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              AI에게 물어보세요!
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              입력한 아파트의 전세가와 매매가를 비교하여<br />
              깡통 전세 여부를 예측합니다.
            </p>
          </div>

          {/* 입력 영역 */}
          <div className="flex flex-col items-center mt-52 space-y-6 w-full max-w-xl mx-auto">
            {/* 등기부등본 업로드 */}
            <div className="w-full">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                등기부등본 PDF 업로드
              </label>
              <input
                type="file"
                accept=".pdf"
                className="w-full rounded-lg border border-blue-300 p-2 bg-white/70 backdrop-blur-sm shadow-sm focus:outline-blue-400"
              />
            </div>

            {/* 전세가 입력 */}
            <div className="w-full">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                전세가 입력 (만원 단위)
              </label>
              <input
                type="number"
                placeholder="예: 28000"
                className="w-full rounded-lg border border-blue-300 p-2 bg-white/70 backdrop-blur-sm shadow-sm focus:outline-blue-400"
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default DetectPage;
