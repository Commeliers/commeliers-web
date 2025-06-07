import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useUserStore } from '../store/useUserStore';

function LoginPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async () => {
    if (!id || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/doLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json') ? await response.json() : await response.text();

      if (!response.ok) throw new Error(data?.error || data || '로그인 실패');

      const token = data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload?.role || 'USER';

      const userInfo = { ...data, role };
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token);

      navigate('/main');
    } catch (err) {
      alert('❌ 로그인 실패: ' + err.message);
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
          <p className="text-blue-600 mb-2">다시 돌아온 것을 환영합니다!</p>
          <p className="text-blue-600 text-lg font-semibold mb-6">Welcome back!</p>

          <div className="w-[400px] bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">로그인</h2>

            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700"
            >
              일반 로그인
            </button>

            <a href={kakaoLoginUrl}>
              <button className="bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-yellow-400">
                <img
                  src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                  alt="카카오"
                  className="w-5 h-5"
                />
                카카오로 시작하기
              </button>
            </a>

            <p className="text-sm text-gray-600 mt-4">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
