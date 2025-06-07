import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyPageSubscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (!token) {
          alert('로그인이 필요합니다.');
          navigate('/');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/information/user-subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('청약 정보를 불러올 수 없습니다.');
        const data = await res.json();

        const parsedData = data.map((item) => ({
          id: item.id,
          subscriptionId: item.subscriptionId,
          parsed: JSON.parse(item.subscriptionDataJson),
        }));

        setSubscriptions(parsedData);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };

    fetchSubscriptions();
  }, [navigate]);

  const confirmDelete = (id) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token || !targetId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/information/user-subscriptions/${targetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('삭제에 실패했습니다.');
      setSubscriptions((prev) => {
        const updated = prev.filter((p) => p.id !== targetId);
        setCurrentIndex((i) => Math.min(i, updated.length - 1));
        return updated;
      });
      setShowModal(false);
      setTargetId(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, subscriptions.length - 1));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <p className="text-gray-800 text-lg font-semibold mb-4">청약 정보를 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center px-8 pt-20">
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
              저장한 청약 정보
            </h2>

            <div className="relative">
              {subscriptions.length === 0 ? (
                <div className="bg-white border border-blue-200 rounded-2xl shadow-lg px-8 py-20 text-center">
                  <p className="text-gray-500 text-lg">저장한 청약 정보가 없습니다.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-blue-200 rounded-2xl shadow-lg px-8 py-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscriptions[currentIndex].parsed.houseName || '청약명 없음'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      📍 지역: {subscriptions[currentIndex].parsed.location || '정보 없음'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      🏗 건설사: {subscriptions[currentIndex].parsed.agencyName || '정보 없음'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      📅 청약일: {subscriptions[currentIndex].parsed.recruitDate || '정보 없음'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      📝 계약기간: {subscriptions[currentIndex].parsed.contractDate || '정보 없음'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      🚚 입주예정일: {subscriptions[currentIndex].parsed.moveInDate || '정보 없음'}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                      {subscriptions[currentIndex].parsed.detailUrl ? (
                        <a
                          href={subscriptions[currentIndex].parsed.detailUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                          바로가기
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">상세 페이지 없음</span>
                      )}
                      <button
                        onClick={() => confirmDelete(subscriptions[currentIndex].id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={prevSlide}
                      className="text-blue-500 hover:underline disabled:text-gray-400"
                      disabled={currentIndex === 0}
                    >
                      ◀ 이전
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentIndex + 1} / {subscriptions.length}
                    </span>
                    <button
                      onClick={nextSlide}
                      className="text-blue-500 hover:underline disabled:text-gray-400"
                      disabled={currentIndex === subscriptions.length - 1}
                    >
                      다음 ▶
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => navigate('/mypage/liked-posts')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                좋아요 누른 게시글
              </button>
              <button
                onClick={() => navigate('/mypage/policies')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                저장한 정책 정보
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyPageSubscriptions;
