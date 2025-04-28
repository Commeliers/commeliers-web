import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';

function CommunityPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
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
        <main className="flex-1 px-8">
          {/* 상단: 제목 + 탭 + 작성하기 버튼 */}
          <div className="flex justify-between items-center mt-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">커뮤니티</h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-blue-500 rounded-full text-blue-600 font-medium hover:bg-blue-50">
                자유 게시판
              </button>
              <button className="px-4 py-2 border border-blue-300 rounded-full text-blue-500 hover:bg-blue-50">
                정보 게시판
              </button>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              ✏️ 작성하기
            </button>
          </div>

          {/* 게시글 리스트 */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm border border-blue-200 shadow-sm rounded-xl p-6 flex justify-between items-start hover:shadow-md transition"
              >
                {/* 제목 + 미리보기 */}
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">제목 {i}</h3>
                  <p className="text-gray-600 text-sm leading-snug">
                    게시판 내용 미리보기<br />
                    게시판 내용 미리보기
                  </p>
                </div>
                {/* 댓글 + 시간 */}
                <div className="flex flex-col items-end text-sm text-gray-500 whitespace-nowrap gap-2">
                  <span>🕒 {i * 3}시간 전</span>
                  <span>💬 {i * 5} 댓글</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CommunityPage;
