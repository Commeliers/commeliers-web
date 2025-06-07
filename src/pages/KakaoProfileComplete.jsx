import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../store/useUserStore';

function KakaoRedirect() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (!code) {
      alert('카카오 인가 코드가 없습니다.');
      navigate('/');
      return;
    }

    window.history.replaceState({}, document.title, window.location.pathname);

    const sendCodeToServer = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/user/kakao/doLogin`,
          { code }
        );

        console.log('🧾 응답 전체:', response.data);

        const token = response.data.token;
        if (!token) {
          throw new Error('토큰이 없습니다.');
        }

        const userInfo = {
          token,
          ...response.data,
          role: response.data.role || (response.data.id === 'user@example.com' ? 'ADMIN' : 'USER'),
        };

        console.log('✅ 저장할 사용자 정보:', userInfo);

        setUser(userInfo);
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        navigate('/main');
      } catch (err) {
        console.error('❌ 카카오 로그인 실패:', err.response?.data || err.message);
        alert('카카오 로그인 실패: ' + (err.response?.data?.message || err.message));
        navigate('/');
      }
    };

    sendCodeToServer();
  }, [navigate, setUser]);

  return (
    <div className="text-center mt-20 text-lg text-gray-600">
      카카오 로그인 처리 중...
    </div>
  );
}

export default KakaoRedirect;
