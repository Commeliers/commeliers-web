import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import mainImage from '../assets/mainpage.png';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const navigate = useNavigate();

  // ✅ 관리자 여부 확인
  const isAdmin = (() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      if (!token) return false;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role === 'ADMIN';
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    const fetchTodayQuiz = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const res = await fetch(`${API_BASE}/quiz/user/quiz-retry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo?.token}`
          }
        });
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('퀴즈 불러오기 실패:', err);
      }
    };
    fetchTodayQuiz();
  }, []);

  const handleAnswerChange = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const submissions = questions.map((q, index) => ({
        quizId: q.id,
        answer: selectedAnswers[index] === 'O',
      }));

      const res = await fetch(`${API_BASE}/quiz/user/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({
          userId: userInfo?.email || 'guest',
          submissions,
        }),
      });

      const result = await res.json();
      navigate('/quizresultpage', {
        state: {
          score: result.score,
          total: result.total,
          results: result.results,
        },
      });
    } catch (err) {
      console.error('퀴즈 제출 실패:', err);
    }
  };

  if (!questions[currentQuestion]) {
    return <div className="text-center mt-10">퀴즈를 불러오는 중...</div>;
  }

  const current = questions[currentQuestion];

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={mainImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />
      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />
        <main className="flex-1 relative flex flex-col justify-start items-center py-16">
          <div className="w-full max-w-3xl text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">오늘의 퀴즈</h1>
            <p className="text-gray-500 text-base">
              문제 {currentQuestion + 1} / {questions.length}
            </p>
          </div>

          <div className="w-full max-w-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl px-6 py-8 text-center mb-6 shadow-md">
            <h2 className="text-xl font-semibold leading-relaxed">{current.question}</h2>
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
            {['O', 'X'].map((choice, idx) => {
              const isSelected = selectedAnswers[currentQuestion] === choice;
              const selectedStyle =
                choice === 'O'
                  ? 'bg-green-100 border-green-400 text-green-700'
                  : 'bg-red-100 border-red-400 text-red-700';

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(choice)}
                  className={`w-full text-center text-xl font-semibold rounded-2xl px-6 py-4 border transition duration-200 ${
                    isSelected
                      ? selectedStyle
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <div className="w-full max-w-2xl flex justify-center gap-4 mt-6">
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600"
              >
                다음 문제
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-2 rounded-2xl hover:bg-green-600"
              >
                채점하기
              </button>
            )}
          </div>

          <div className="w-full max-w-2xl flex justify-between mt-6">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
              }}
              className="px-4 py-2 text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition"
            >
              🔁 퀴즈 다시 풀기
            </button>

            {isAdmin && (
              <button
                onClick={() => navigate('/quizadmin')}
                className="px-4 py-2 text-sm rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                🛠️ 퀴즈 관리 (관리자)
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizPage;
