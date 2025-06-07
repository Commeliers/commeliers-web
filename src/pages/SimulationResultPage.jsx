import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const dummyResponse = {
  chart: [
    { year: '2023', price: 8.2 },
    { year: '2024', price: 8.6 },
    { year: '2025', price: 9.0 },
    { year: '2026', price: 9.2 },
    { year: '2027', price: 9.5 },
    { year: '2028', price: 9.8 },
    { year: '2029', price: 10.1 },
    { year: '2030', price: 10.4 },
    { year: '2031', price: 10.6 },
    { year: '2032', price: 10.9 },
    { year: '2033', price: 11.2 },
    { year: '2034', price: 11.4 },
    { year: '2035', price: 11.7 }
  ],
  summary: '현재 속도라면 2035년 후 가능합니다.',
  loanInfo: '대출 가능액: 3.2억 (LTV 40%)\n필요 자산: 5.8억',
  feedback: '월 지출을 20만원 줄이면 3년 단축됩니다.'
};

function SimulationResultPage() {
  const [savingRate, setSavingRate] = useState('15');
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState('');
  const [loanInfo, setLoanInfo] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const fetchSimulation = useCallback(async () => {
    try {
      const res = await axios.post('/api/simulate', { savingRate });
      setChartData(res.data.chart);
      setSummary(res.data.summary);
      setLoanInfo(res.data.loanInfo);
      setFeedbackText(res.data.feedback);
    } catch (err) {
      console.warn('API 실패, 더미 데이터 사용 중');
      setChartData(dummyResponse.chart);
      setSummary(dummyResponse.summary);
      setLoanInfo(dummyResponse.loanInfo);
      setFeedbackText(dummyResponse.feedback);
    }
  }, [savingRate]); // savingRate가 바뀔 때만 함수 갱신

  useEffect(() => {
    fetchSimulation();
  }, [fetchSimulation]);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover opacity-40 pointer-events-none z-0"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 px-12">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">분석 결과</h2>
          <p className="text-xl font-semibold text-gray-800 mb-8">{summary}</p>

          <div className="mb-4">
            <label className="mr-2 text-gray-600">저축률</label>
            <input
              value={savingRate}
              onChange={(e) => setSavingRate(e.target.value)}
              onBlur={fetchSimulation}
              className="border border-blue-300 rounded px-3 py-1"
            />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#007BFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 text-sm text-gray-700 border border-blue-300 p-4 rounded-md w-fit bg-white/60 whitespace-pre-line">
            {loanInfo}
          </div>

          <div className="pt-6">
            <button
              onClick={() => setShowFeedback(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm hover:bg-blue-700"
            >
              피드백 받기 →
            </button>
          </div>

          {showFeedback && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
              <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">피드백</h3>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  {feedbackText}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="px-5 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SimulationResultPage;
