import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';

function MyPageDelete() {
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirmed = window.confirm('정말 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmed) {
      // TODO: API 연동
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
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

        <main className="flex-1 flex flex-col items-center px-8 pt-48">
          <div className="w-full max-w-2xl bg-white border border-red-200 rounded-2xl shadow-lg px-8 py-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">회원 탈퇴</h2>
            <p className="text-gray-700 text-sm mb-8">
              탈퇴 시 모든 정보는 삭제되며 <span className="font-semibold text-red-500">복구되지 않습니다.</span><br />
              정말 탈퇴하시겠습니까?
            </p>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              회원 탈퇴하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyPageDelete;
