import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import mainImage from '../assets/mainpage.png';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const QuizResultPage = () => {
  const { state } = useLocation();
  const { score = 0, total = 0, results = [] } = state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4;

  if (!Array.isArray(results) || results.length === 0) {
    return <div className="text-center mt-10 text-red-600">결과 데이터를 불러오지 못했습니다.</div>;
  }

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = results.slice(startIndex, startIndex + resultsPerPage);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={mainImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 relative flex flex-col justify-start items-center py-14">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-left bg-blue-100 p-4 rounded-lg shadow-lg">
            퀴즈 결과
          </h1>

          <p className="text-2xl font-semibold text-gray-800 mb-6">
            총점: <span className="text-blue-600">{score} / {total}</span>
          </p>

          <div className="w-full max-w-3xl space-y-4">
            {currentResults.map((result, index) => {
              const userAnswer = result.userAnswer ? 'O' : 'X';
              const correctAnswer = result.correctAnswer ? 'O' : 'X';
              const isCorrect = result.isCorrect;
              return (
                <div key={index} className="p-4 border rounded-xl shadow-sm bg-white flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{`문제 ${startIndex + index + 1}`}</h3>
                    <p className="text-sm mt-2">
                      선택한 답: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer}</span>
                    </p>
                    <p className="text-sm mt-2">
                      정답: <span className="text-green-600">{correctAnswer}</span>
                    </p>
                    <p className="text-sm mt-2">
                      <strong>설명:</strong> {result.explanation || '해설이 제공되지 않았습니다.'}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center justify-center w-8 h-8">
                    {isCorrect ? (
                      <FaCheckCircle className="text-green-600 text-2xl" />
                    ) : (
                      <FaTimesCircle className="text-red-600 text-2xl" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizResultPage;
