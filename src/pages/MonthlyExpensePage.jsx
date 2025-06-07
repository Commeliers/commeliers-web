import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiBarChart2, FiX } from 'react-icons/fi';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function MonthlyExpensePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [docId, setDocId] = useState('');
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6);
  const [chartData, setChartData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExpenses(year, month);
    fetchChartData(year);
  }, [year, month]);

  const fetchExpenses = async (year, month) => {
    try {
      const res = await axios.get(`http://144.24.71.17:8080/guides/calculators`, {
        params: { year, month },
      });
      const data = res.data;
      setDocId(data.id);

      const formatted = data.items.map((item, idx) => ({
        id: Date.now() + idx,
        item: item.name,
        amount: item.amount.toLocaleString(),
      }));
      setExpenses(formatted);
    } catch (error) {
      console.error('지출 데이터 조회 실패:', error);
      setExpenses([]);
      setDocId('');
    }
  };

  const fetchChartData = async (targetYear) => {
    try {
      const requests = Array.from({ length: 6 }, (_, i) => i + 1).map((m) =>
        axios.get(`http://144.24.71.17:8080/guides/calculators`, {
          params: { year: targetYear, month: m },
        })
          .then((res) => ({
            month: `${m}월`,
            total: res.data.totalAmount || 0,
          }))
          .catch(() => ({ month: `${m}월`, total: 0 }))
      );
      const results = await Promise.all(requests);
      setChartData(results);
    } catch (error) {
      console.error('차트 데이터 조회 실패:', error);
    }
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { id: Date.now(), item: '', amount: '' }]);
  };

  const handleChange = (id, field, value) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = parseInt(expense.amount.replace(/,/g, ''), 10);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleSave = async () => {
    try {
      const payload = {
        id: docId || '',
        userId: 'guest',
        year,
        month,
        items: expenses.map((e) => ({
          name: e.item,
          amount: parseInt(e.amount.replace(/,/g, '')) || 0,
        })),
        totalAmount,
        lastModified: new Date().toISOString(),
      };

      await axios.post(`http://144.24.71.17:8080/guides/calculators`, payload);
      alert('저장이 완료되었습니다!');
      setIsEditing(false);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleMonthChange = (offset) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center py-16 px-6 md:px-12">
          <div className="flex items-center justify-between w-full max-w-4xl mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {year}년 {month}월 지출 비용
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700"
            >
              <FiBarChart2 /> 월별 지출 추이
            </button>
          </div>

          <div className="w-full max-w-4xl flex justify-between items-center mb-6">
            <button
              onClick={() => handleMonthChange(-1)}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition"
            >
              ◀ 이전 달
            </button>
            <button
              onClick={() => handleMonthChange(1)}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition"
            >
              다음 달 ▶
            </button>
          </div>

          <div className="w-full max-w-4xl flex flex-col gap-4 bg-white rounded-xl p-6 shadow">
            {expenses.map((expense, index) => (
              <div key={expense.id} className="flex items-center gap-4">
                <div className="w-6 text-blue-600 font-bold">{index + 1}</div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={expense.item}
                      onChange={(e) => handleChange(expense.id, 'item', e.target.value)}
                      className="flex-1 p-2 border border-blue-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={expense.amount}
                      onChange={(e) => handleChange(expense.id, 'amount', e.target.value)}
                      className="w-32 p-2 border border-blue-300 rounded-lg text-sm text-right"
                    />
                    <button onClick={() => handleDelete(expense.id)}>
                      <FiTrash2 className="text-red-500 w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 text-gray-800 text-base font-medium">
                      {expense.item}
                    </div>
                    <div className="w-32 text-right text-gray-800 text-base font-semibold">
                      {expense.amount}
                    </div>
                  </>
                )}
              </div>
            ))}

            {isEditing && (
              <button
                onClick={handleAddExpense}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                + 항목 추가
              </button>
            )}

            <div className="mt-6 text-right text-lg font-semibold text-gray-800">
              총 지출: <span className="text-blue-600 text-xl">{totalAmount.toLocaleString()}원</span>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleToggleEdit}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition flex items-center gap-2"
              >
                {isEditing ? '저장하기 →' : (<><FiEdit2 /> 수정하기</>)}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">월별 지출 추이</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyExpensePage;
