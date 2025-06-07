import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import mainImage from '../assets/mainpage.png';
import { FiArrowRight } from 'react-icons/fi';
import { useSupportStore } from '../store/supportStore';
import { FaSpinner } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function SupportPage() {
  const { addPolicy } = useSupportStore();
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [city, setCity] = useState('서울특별시');
  const [district, setDistrict] = useState('전체');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSavedModal, setShowSavedModal] = useState(false); // ✅ 저장 완료 모달 상태

  const cityMap = {
    '서울특별시': ['전체', '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '경기도': ['전체', '수원시 장안구', '수원시 권선구', '수원시 팔달구', '수원시 영통구', '성남시 수정구', '성남시 중원구', '성남시 분당구', '의정부시', '안양시 만안구', '안양시 동안구', '부천시', '광명시', '평택시', '동두천시', '안산시 상록구', '안산시 단원구', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시 처인구', '용인시 기흥구', '용인시 수지구', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군']
  };

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/information/policies-get?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&count=10`
      );
      const text = await res.text();
      if (!res.ok) throw new Error('정책 데이터를 불러올 수 없습니다.');
      if (!text || text.trim() === '') {
        setPolicies([]);
        return;
      }
      const data = JSON.parse(text);
      setPolicies(data);
    } catch (err) {
      console.error('❌ 에러:', err);
      setError(err.message || '알 수 없는 오류');
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (policy) => {
    addPolicy({
      title: policy.plcyNm,
      description: policy.plcyExplnCn,
      category: policy.lclsfNm || '부동산 정책',
      benefit: policy.plcySprtCn || '지원 정책 설명 참고',
      ageRange: policy.ageRange || '청년 또는 전체 대상',
    });
    setShowSavedModal(true); // ✅ 저장 후 모달 표시
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={mainImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center pt-16 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-3xl mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">부동산 지원 정책</h1>
            <p className="text-gray-500 text-base mb-4">청년들을 위한 부동산 정책을 확인해보세요.</p>

            <div className="flex gap-4 mb-4">
              <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict('전체'); }} className="border p-2 rounded">
                {Object.keys(cityMap).map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="border p-2 rounded">
                {cityMap[city].map((d) => <option key={d}>{d}</option>)}
              </select>
              <button onClick={fetchPolicies} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">조회</button>
            </div>

            {loading && (
              <div className="flex justify-center items-center text-blue-500 py-6">
                <FaSpinner className="animate-spin mr-2" /> 불러오는 중...
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
          </div>

          <div className="w-full max-w-3xl flex flex-col gap-4 mb-20">
            {policies.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPolicy(p)}
                className="w-full bg-blue-600 text-white flex items-center justify-between px-8 py-4 rounded-2xl hover:bg-blue-700 transition"
              >
                <span className="text-lg font-semibold">{p.plcyNm}</span>
                <FiArrowRight className="text-2xl" />
              </button>
            ))}
          </div>
        </main>
      </div>

      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white max-w-xl w-full rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPolicy(null)}
              className="absolute top-3 right-3 text-gray-600 text-lg hover:text-red-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedPolicy.plcyNm}</h2>
            <p className="text-sm mb-1">📂 대분류: {selectedPolicy.lclsfNm}</p>
            <p className="text-sm mb-1">📁 중분류: {selectedPolicy.mclsfNm}</p>
            <p className="text-sm mb-1">💡 지원내용: {selectedPolicy.plcySprtCn}</p>
            <p className="text-sm mb-1">🎯 지원 연령: {selectedPolicy.ageRange}</p>
            <p className="text-sm mb-1">🗓 신청기간: {selectedPolicy.aplyYmd}</p>
            <p className="text-sm mb-1">✍ 신청방법: {selectedPolicy.plcyAplyMthdCn}</p>
            <p className="text-sm mb-1">
              🔗 <a href={selectedPolicy.aplyUrlAddr} target="_blank" rel="noreferrer" className="text-blue-600 underline">신청 링크</a>
            </p>
            <p className="text-sm mb-1">🔎 참고 URL: {selectedPolicy.refUrlAddr1}</p>
            <p className="text-sm mb-4">🏢 등록기관: {selectedPolicy.rgtrInstCdNm}</p>

            <div className="text-right">
              <button
                onClick={() => handleSave(selectedPolicy)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 저장 완료 확인 모달 */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center relative">
            <h3 className="text-xl font-bold mb-2">✅ 저장되었습니다!</h3>
            <p className="text-gray-600 mb-4">청약 정보가 마이페이지에 저장되었습니다.</p>
            <button
              onClick={() => setShowSavedModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportPage;
