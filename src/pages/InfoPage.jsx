import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import ChatModal from '../pages/ChatModal'; // 경로에 맞게 조정하세요

function InfoPage() {
  const [searchInput, setSearchInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState('');

  const questions = [
    "집 구하기 어디서부터 시작해?",
    "계약부터 이사까지 진짜 중요한 것들",
    "부동산 서류랑 제도 이게 다 뭐야?",
    "집 구할 때 가장 먼저 해야 할 일은?",
    "전세, 월세, 반전세 차이가 뭐예요?",
    "중개수수료가 뭐예요?",
  ];

  // 챗봇 열기, 질문 텍스트가 없으면 열리지 않음
  const handleOpenChat = (questionText = searchInput) => {
    if (!questionText.trim()) return;
    setInitialQuestion(questionText);
    setChatOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 배경 이미지 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center py-16 px-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">오늘은 무엇을 공부할까요?</h1>
          <p className="text-gray-600 mb-12">부동산에 대해서 알아보아요!</p>

          {/* 질문 버튼 리스트 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenChat(q)}
                className="p-6 bg-white border border-blue-200 rounded-xl shadow hover:shadow-md text-center text-blue-600 font-semibold text-sm flex items-center justify-center transition-transform hover:scale-105"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 챗봇 열기 (빈 질문) */}
          <button
            onClick={() => {
              setInitialQuestion('');
              setChatOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full mb-4 text-sm"
          >
            챗봇 열기 (빈 질문)
          </button>

          {/* 입력창 */}
          <div className="w-full max-w-4xl flex items-center border border-blue-300 rounded-full px-6 py-4 shadow bg-white/70 backdrop-blur-sm mb-8">
            <input
              type="text"
              placeholder="궁금하신 내용을 물어보세요!"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenChat();
              }}
              className="flex-1 focus:outline-none text-sm bg-transparent"
            />
            <button
              onClick={() => handleOpenChat()}
              className="text-blue-600 font-bold text-sm"
            >
              검색 →
            </button>
          </div>
        </main>
      </div>

      {/* 챗봇 모달 */}
      {chatOpen && (
        <ChatModal question={initialQuestion} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}

export default InfoPage;
