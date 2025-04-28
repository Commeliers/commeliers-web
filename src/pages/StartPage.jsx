import { useNavigate } from 'react-router-dom';
import startImage from '../assets/startpage.png';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f6ff] to-[#cce1ff] flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 mt-6 mb-4">HomeProtect</h1>

      <img
        src={startImage}
        alt="홈 이미지"
        className="max-w-md md:max-w-xl w-[100%] object-contain mb-6"
      />

      <div className="flex items-center gap-2">

        <button
          onClick={() => navigate('/main')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

export default StartPage;