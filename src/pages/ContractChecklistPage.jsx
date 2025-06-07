import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useState } from 'react';

function ContractChecklistPage() {
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(0);

  const checklist = [
    "매매/임대차 계약서에 중도금, 잔금 일자가 명확히 기재되어 있나요?",
    "등기부등본상 소유자와 계약 당사자가 일치하나요?",
    "근저당, 가압류 등 권리관계에 문제가 없는지 확인했나요?",
    "중도금 지급 전에 등기부등본을 한 번 더 발급받기로 했나요?",
    "계약금 지급 후, 가계약이 아닌 확정계약서(정식 계약서)를 받았나요?",
    "집주인이 부동산 중개업소에 중개 의뢰한 사실을 확인했나요?",
    "임대차 계약서에 특약사항이 명확하게 기재되어 있나요?",
  ];

  const handleAnswer = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(checklist.length / itemsPerPage);

  const startIndex = page * itemsPerPage;
  const currentQuestions = checklist.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 흐릿한 배경 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center min-h-[85vh] px-8 py-8">
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8">집 계약 체크리스트</h1>

          {/* 질문 리스트 */}
          <div className="flex flex-col gap-8 w-full max-w-4xl flex-1 justify-start">
  {currentQuestions.map((question, idx) => {
    const realIndex = startIndex + idx;
    return (
      <div key={realIndex} className="bg-white/80 backdrop-blur-sm border border-blue-300 rounded-2xl p-8 shadow hover:shadow-md transition flex flex-col items-center">
        <p className="text-center text-gray-800 font-bold text-xl mb-2">
          {question}
        </p>
        <div className="flex gap-6">
          <button
            onClick={() => handleAnswer(realIndex, 'O')}
            className={`w-24 py-3 rounded-full font-bold ${
              answers[realIndex] === 'O'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600'
            } transition`}
          >
            O
          </button>
          <button
            onClick={() => handleAnswer(realIndex, 'X')}
            className={`w-24 py-3 rounded-full font-bold ${
              answers[realIndex] === 'X'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600'
            } transition`}
          >
            X
          </button>
        </div>
      </div>
    );
  })}
</div>


          {/* 이전/다음 버튼 */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className={`px-6 py-2 rounded-full text-sm font-bold ${
                page === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              이전
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className={`px-6 py-2 rounded-full text-sm font-bold ${
                page === totalPages - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              다음
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ContractChecklistPage;
