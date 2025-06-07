import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SimulationInputPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    job: '',
    income: '',
    expense: '',
    asset: '',
    loan: '',
    region: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover opacity-40 pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 px-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-8 text-center">현재 나의 상태</h2>
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {[
              ['직업', <select name="job" onChange={handleChange} className="w-full border border-blue-300 rounded px-4 py-2"><option value="">선택</option><option>직장인</option></select>],
              ['연간 소득', <input name="income" type="text" onChange={handleChange} placeholder="N" className="w-full border border-blue-300 rounded px-4 py-2" />],
              ['지출 내역', <input name="expense" type="text" onChange={handleChange} placeholder="N" className="w-full border border-blue-300 rounded px-4 py-2" />],
              ['현재 자산', <input name="asset" type="text" onChange={handleChange} placeholder="N" className="w-full border border-blue-300 rounded px-4 py-2" />],
              ['대출 잔액', <input name="loan" type="text" onChange={handleChange} placeholder="N" className="w-full border border-blue-300 rounded px-4 py-2" />],
              ['희망 거주 지역', <select name="region" onChange={handleChange} className="w-full border border-blue-300 rounded px-4 py-2"><option>서울 강남구</option></select>],
            ].map(([label, input], i) => (
              <div key={i} className="grid grid-cols-3 items-center gap-4">
                <span className="text-blue-600 font-bold text-lg">{i + 1}</span>
                <span className="text-gray-700">{label}</span>
                {input}
              </div>
            ))}
            <div className="text-center pt-6">
              <button
                onClick={() => navigate('/simulation/result')}
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm hover:bg-blue-700"
              >
                분석하기 →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SimulationInputPage;
