import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { Link } from 'react-router-dom';

function SignupPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 배경 */}
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] object-cover"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center justify-center min-h-[90vh] mt-[-40px]">  
          <p className="text-blue-600 mb-2">환영합니다!</p>
          <p className="text-blue-600 text-lg font-semibold mb-6">Welcome to world!</p>

          {/* 회원가입 카드 */}
          <div className="w-[400px] bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">회원가입</h2>

            {/* 카카오 버튼 */}
            <button className="bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-yellow-400">
              <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="카카오" className="w-5 h-5" />
              카카오로 시작하기
            </button>

            {/* 하단 링크 */}
            <p className="text-sm text-gray-600 mt-4">
              계정이 있으신가요?{' '}
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
