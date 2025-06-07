import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate, useLocation } from 'react-router-dom';

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state;

  const handleGoBack = () => navigate('/detect');

  if (!result) {
    return (
      <div className="p-10 text-center text-lg text-red-500">
        결과 데이터가 없습니다. 다시 분석해주세요.
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 relative flex flex-col items-center min-h-screen pt-16">
          <div className="w-full max-w-3xl flex flex-col items-start mb-10 relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 분석 결과</h1>
            <p className="text-gray-500 text-base">
              등기부 기반 위험 분석 결과를 확인하세요.
            </p>

            <button
              onClick={handleGoBack}
              className="absolute top-0 right-0 px-6 py-2 border border-blue-400 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition"
            >
              입력한 내용
            </button>
          </div>

          <div className="w-full max-w-3xl bg-white/70 backdrop-blur border border-blue-400 rounded-2xl shadow px-8 py-10">
            <h2 className={`text-2xl font-bold mb-6 ${
              result.risk_level === "낮음" ? "text-green-600" :
              result.risk_level === "보통" ? "text-orange-500" : "text-red-500"
            }`}>
              위험 등급: {result.risk_level}
            </h2>

            <p className="text-gray-800 mb-6 text-base">📈 위험 점수: {result.risk_score} / 100</p>

            {/* LLM Explanation */}
            {result.llm_explanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-800">
                <h3 className="font-semibold text-lg">LLM 분석 설명</h3>
                <p>{result.llm_explanation}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResultPage;
