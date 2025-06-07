import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    gender: '',
    email: '',
    profile_image: '',
    job: '',
    income: '',
    moveInDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        ...formData,
        income: Number(formData.income),
        moveInDate: new Date(formData.moveInDate).toISOString(),
      };

      const response = await fetch(`${API_BASE}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(data?.error || data || '회원가입 실패');
      }

      alert('🎉 회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      alert('❌ 회원가입 실패: ' + err.message);
    }
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
        <main className="flex-1 flex flex-col items-center justify-center min-h-[90vh] mt-[-40px]">
          <p className="text-blue-600 mb-2">환영합니다!</p>
          <p className="text-blue-600 text-lg font-semibold mb-6">Welcome to world!</p>

          <div className="w-[400px] bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">회원가입</h2>

            <input name="id" placeholder="아이디" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="password" placeholder="비밀번호" type="password" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="gender" placeholder="성별 (예: 남/여)" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="email" placeholder="이메일" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="profile_image" placeholder="프로필 이미지 URL" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="job" placeholder="직업" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="income" placeholder="연소득 (숫자만)" type="number" onChange={handleChange} className="w-full mb-2 px-3 py-2 border rounded" />
            <input name="moveInDate" placeholder="입주 예정일 (YYYY-MM-DD)" onChange={handleChange} className="w-full mb-4 px-3 py-2 border rounded" />

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700"
            >
              일반 회원가입
            </button>

            <p className="text-sm text-gray-600 mt-4">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignupPage;
