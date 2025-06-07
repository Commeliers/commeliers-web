import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useState, useEffect } from 'react'; // ✅ useEffect 추가
import { useNavigate } from 'react-router-dom';

function ScamDetectionPage() {
  const [agreements, setAgreements] = useState([false, false, false]);
  const [hideAgreement, setHideAgreement] = useState(false); // ✅ 하루 동안 안 보기 여부 상태 추가
  const navigate = useNavigate();
  const allAgreed = agreements.every(Boolean);

  // ✅ 컴포넌트 마운트 시 localStorage에서 동의 시간 확인
  useEffect(() => {
    const saved = localStorage.getItem('scamAgreementTimestamp');
    if (saved) {
      const savedTime = new Date(saved);
      const now = new Date();
      const diffHours = (now - savedTime) / (1000 * 60 * 60); // 시간 차이 계산
      if (diffHours < 24) {
        setHideAgreement(true); // ✅ 24시간 이내면 약관 숨김
      }
    }
  }, []);

  const toggleAgreement = (index) => {
    const updated = [...agreements];
    updated[index] = !updated[index];
    setAgreements(updated);
  };

  const agreeAll = () => {
    setAgreements([true, true, true]);
  };

  const goToDetect = () => {
    if (allAgreed || hideAgreement) {
      localStorage.setItem('scamAgreementTimestamp', new Date().toISOString()); // ✅ 동의한 시간 저장
      navigate('/detect');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30 blur-sm pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center pt-16">
          <div className="w-full max-w-3xl mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">AI에게 물어보세요!</h1>
            <p className="text-gray-600 text-base">
              입력한 아파트의 전세가와 매매가를 비교하여<br />
              깡통 전세 여부를 예측합니다.
            </p>
          </div>

          {/* ✅ 하루 동안 숨김 여부에 따라 약관 표시 */}
          {!hideAgreement && (
            <div className="w-full max-w-3xl bg-white/70 backdrop-blur border border-blue-200 rounded-2xl shadow px-8 py-10 mb-6">
              <h2 className="text-xl font-bold mb-6">안내사항</h2>
              <ul className="space-y-6 text-gray-700 text-sm">
                {[
                  "본 서비스는 정보 제공 목적이며, 1주일 이내 시세 정보 기준으로 분석 결과를 제공합니다. 실제 계약 전 반드시 최신 정보를 확인해 주세요.",
                  "본 서비스는 참고용이며, 계약 등 중요한 결정은 전문가 상담을 병행해 주세요.",
                  "전세사기 예방을 위해 직접 등기부등본 등 필수 서류를 확인하는 것을 권장합니다."
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start justify-between">
                    <span className="flex-1">{idx + 1}. {text}</span>
                    <button
                      className="ml-4 text-blue-500 font-semibold"
                      onClick={() => toggleAgreement(idx)}
                    >
                      {agreements[idx] ? "✔ 동의 완료" : "동의합니다"}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex justify-end mt-6">
                <button onClick={agreeAll} className="text-blue-500 font-semibold">
                  전체 동의
                </button>
              </div>
            </div>
          )}

          {/* 다음 단계 버튼 */}
          <button
            onClick={goToDetect}
            className={`w-full max-w-3xl py-4 rounded-2xl text-white font-bold transition ${
              allAgreed || hideAgreement ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!allAgreed && !hideAgreement} // ✅ 동의 안 한 상태에서만 비활성화
          >
            다음 단계 →
          </button>
        </main>
      </div>
    </div>
  );
}

export default ScamDetectionPage;
