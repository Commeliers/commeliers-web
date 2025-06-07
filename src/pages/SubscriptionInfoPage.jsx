import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { FaSpinner } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function SubscriptionInfoPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const [region, setRegion] = useState('서울');
  const [supply, setSupply] = useState('민영');
  const [house, setHouse] = useState('아파트');
  const [start, setStart] = useState('2024-01-01');
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 10));

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/information/subscription-get?region=${region}&supplyType=${supply}&houseType=${house}&startDate=${start}&endDate=${end}&count=10`
      );
      if (!res.ok) throw new Error('청약 데이터를 불러올 수 없습니다.');
      const json = await res.json();
      setSubs(json);
      setCurrent(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item) => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const cleaned = {
      houseName: item.houseName || '청약명 없음',
      houseType: item.houseType || house,
      location: item.location || region,
      agencyName: item.agencyName || '정보 없음',
      recruitDate: item.recruitDate || '미정',
      contractDate: item.contractDate || '미정',
      moveInDate: item.moveInDate || '미정',
      homepageUrl: item.homepageUrl || '',
      detailUrl: item.detailUrl || '',
    };

    const baseDate = cleaned.recruitDate?.split('~')[0]?.trim() || '미정';
    const subscriptionId = `${cleaned.houseName}_${baseDate}`;

    const body = {
      subscriptionId,
      subscriptionDataJson: JSON.stringify(cleaned),
    };

    try {
      const res = await fetch(`${API_BASE}/information/user-subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('저장에 실패했습니다.');
      setShowSavedModal(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
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

        <main className="flex-1 flex flex-col items-center py-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">청약 정보 조회</h1>
          <p className="text-gray-600 mb-6">조건을 선택하고 조회해보세요.</p>

          <div className="flex flex-wrap gap-4 items-center mb-8">
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="border p-2 rounded">
              <option>서울</option><option>경기</option><option>부산</option><option>대구</option><option>인천</option>
            </select>
            <select value={supply} onChange={(e) => setSupply(e.target.value)} className="border p-2 rounded">
              <option>민영</option><option>국민</option>
            </select>
            <select value={house} onChange={(e) => setHouse(e.target.value)} className="border p-2 rounded">
              <option>아파트</option><option>민간사전청약</option><option>신혼희망타운</option>
            </select>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border p-2 rounded" />
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border p-2 rounded" />
            <button onClick={fetchSubscriptions} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              조회
            </button>
          </div>

          {loading && (
            <div className="flex justify-center items-center text-blue-500 py-6">
              <FaSpinner className="animate-spin mr-2" /> 불러오는 중...
            </div>
          )}

          {error && <div className="text-red-500">{error}</div>}

          {subs.length > 0 && (
            <div className="w-full flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
                disabled={current === 0}
                className="text-lg px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ◀
              </button>
              <div className="bg-white/70 backdrop-blur border border-blue-400 rounded-2xl shadow px-6 py-8 w-full max-w-xl">
                <p className="text-sm text-gray-500 mb-4 text-center">
                  {current + 1} / {subs.length}
                </p>
                <h2 className="text-xl font-bold mb-2">{subs[current].houseName || '청약명 없음'}</h2>
                <p className="text-sm text-gray-700 mb-1">📍 지역: {subs[current].location || '정보 없음'}</p>
                <p className="text-sm text-gray-700 mb-1">🏗 건설사: {subs[current].agencyName || '정보 없음'}</p>
                <p className="text-sm text-gray-700 mb-1">📅 청약일: {subs[current].recruitDate || '미정'}</p>
                <p className="text-sm text-gray-700 mb-1">📝 계약기간: {subs[current].contractDate || '미정'}</p>
                <p className="text-sm text-gray-700 mb-1">🚚 입주예정일: {subs[current].moveInDate || '미정'}</p>
                {subs[current].detailUrl ? (
                  <a href={subs[current].detailUrl} className="text-blue-600 text-sm underline" target="_blank" rel="noreferrer">
                    상세보기
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">상세 페이지 없음</p>
                )}
                <div className="mt-4 text-right">
                  <button
                    onClick={() => handleSave(subs[current])}
                    className="bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
                  >
                    저장하기
                  </button>
                </div>
              </div>
              <button
                onClick={() => setCurrent((prev) => Math.min(prev + 1, subs.length - 1))}
                disabled={current === subs.length - 1}
                className="text-lg px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ▶
              </button>
            </div>
          )}
        </main>
      </div>

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

export default SubscriptionInfoPage;
