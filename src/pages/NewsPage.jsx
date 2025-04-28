import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';

function NewsPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 배경 이미지 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] object-cover"
      />

      {/* 전체 레이아웃 */}
      <div className="relative z-10 flex px-8 pt-12 items-start">
        {/* 사이드바 */}
        <Sidebar />

        {/* 본문 */}
        <main className="flex-1 px-8">


          {/* ✅ 청약 정보 섹션 */}
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">청약 정보</h3>
            <div className="grid grid-cols-3 gap-6">
              {['LH 청약 정보', 'SH 청약 정보', 'GH 청약 정보'].map((title, i) => (
                <div
                  key={i}
                  className="h-[150px] rounded-xl bg-white/80 backdrop-blur-sm border border-blue-300 flex items-center justify-center text-blue-600 font-bold text-lg shadow"
                >
                  {title}
                </div>
              ))}
            </div>
          </section>

          {/* ✅ 최신 뉴스 섹션 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">최신 뉴스</h3>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[160px] rounded-xl bg-white/80 backdrop-blur-sm border border-blue-300 flex items-center justify-center text-blue-600 font-bold text-lg shadow"
                >
                  {/* 제목 */}
                  <div className="flex-1 p-4 flex items-center justify-center text-center">
                    <p className="text-sm text-gray-800 font-medium">
                      뉴스 제목 {i}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default NewsPage;
