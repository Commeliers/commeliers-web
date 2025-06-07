import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DetectPage() {
  const [file, setFile] = useState(null);
  const [deposit, setDeposit] = useState('');
  const [area, setArea] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleDepositChange = (e) => setDeposit(e.target.value);
  const handleAreaChange = (e) => setArea(e.target.value);

  const handleSubmit = async () => {
    if (!file || !deposit || !area) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);  // 로딩 시작

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jeonse_price', parseInt(deposit, 10));
    formData.append('area', parseFloat(area));

    try {
      const response = await fetch('https://ddyagreyezezeyjd.tunnel.elice.io/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('분석 실패');

      const data = await response.json();
      navigate('/result', { state: data });
    } catch (error) {
      alert('AI 분석 요청 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);  // 로딩 끝
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

        <main className="flex-1 px-4 flex flex-col justify-start">
          <div className="text-center pt-16 mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              AI에게 물어보세요!
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              입력한 아파트의 전세가와 매매가를 비교하여<br />
              깡통 전세 여부를 예측합니다.
            </p>
          </div>

          <div className="flex flex-col items-center mt-40 space-y-6 w-full max-w-xl mx-auto">
            <div className="w-full">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                등기부등본 PDF 업로드
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-blue-300 p-2 bg-white/70 backdrop-blur-sm shadow-sm focus:outline-blue-400"
              />
            </div>

            <div className="w-full">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                전세가 입력 (만원 단위)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={handleDepositChange}
                placeholder="예: 28000"
                className="w-full rounded-lg border border-blue-300 p-2 bg-white/70 backdrop-blur-sm shadow-sm focus:outline-blue-400"
              />
            </div>

            <div className="w-full">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                면적 입력 (㎡)
              </label>
              <input
                type="number"
                value={area}
                onChange={handleAreaChange}
                placeholder="예: 25.38"
                className="w-full rounded-lg border border-blue-300 p-2 bg-white/70 backdrop-blur-sm shadow-sm focus:outline-blue-400"
              />
            </div>

            {/* 로딩 상태에 따라 다르게 표시 */}
            {isLoading ? (
              <div className="mt-6 flex flex-col items-center text-xl text-blue-600">
                <div className="spinner-border animate-spin inline-block w-10 h-10 border-4 border-solid border-current border-t-transparent rounded-full"></div>
                <div className="mt-2">분석 중... 잠시만 기다려주세요.</div>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!file || !deposit || !area}
              >
                AI 분석 시작하기 →
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DetectPage;
