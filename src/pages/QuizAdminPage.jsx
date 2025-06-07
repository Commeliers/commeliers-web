import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import mainImage from '../assets/mainpage.png';

const API_BASE = process.env.REACT_APP_API_ADMIN_QUIZ;
const ADMIN_TOKEN = process.env.REACT_APP_ADMIN_TOKEN;

function QuizAdminPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 3;

  const [newQuiz, setNewQuiz] = useState({ question: '', answer: true, description: '' });
  const [editQuiz, setEditQuiz] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      console.error('퀴즈 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreate = async () => {
    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(newQuiz),
      });
      setNewQuiz({ question: '', answer: true, description: '' });
      fetchQuizzes();
    } catch (err) {
      console.error('등록 실패:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 퀴즈를 삭제하시겠습니까?')) return;

    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });
      fetchQuizzes();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API_BASE}/${editQuiz.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(editQuiz),
      });
      setEditQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={mainImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center py-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🛠 퀴즈 관리 페이지 (관리자)</h1>

          {/* 등록 */}
          <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow mb-10 border">
            <h2 className="text-xl font-semibold mb-2">➕ 새 퀴즈 등록</h2>
            <input
              type="text"
              placeholder="질문"
              value={newQuiz.question}
              onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <select
              value={newQuiz.answer}
              onChange={(e) => setNewQuiz({ ...newQuiz, answer: e.target.value === 'true' })}
              className="w-full border rounded px-3 py-2 mb-2"
            >
              <option value="true">정답: O</option>
              <option value="false">정답: X</option>
            </select>
            <textarea
              placeholder="해설"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
              등록
            </button>
          </div>

          {/* 목록 */}
          <div className="w-full max-w-3xl space-y-4">
            {currentQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white p-4 rounded-xl border shadow flex justify-between items-start">
                {editQuiz?.id === quiz.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editQuiz.question}
                      onChange={(e) => setEditQuiz({ ...editQuiz, question: e.target.value })}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <select
                      value={editQuiz.answer}
                      onChange={(e) => setEditQuiz({ ...editQuiz, answer: e.target.value === 'true' })}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="true">정답: O</option>
                      <option value="false">정답: X</option>
                    </select>
                    <textarea
                      value={editQuiz.description}
                      onChange={(e) => setEditQuiz({ ...editQuiz, description: e.target.value })}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">
                        저장
                      </button>
                      <button onClick={() => setEditQuiz(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{quiz.question}</h3>
                    <p className="text-sm mb-1">정답: {quiz.answer ? 'O' : 'X'}</p>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                  </div>
                )}

                {editQuiz?.id !== quiz.id && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setEditQuiz(quiz)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizAdminPage;
