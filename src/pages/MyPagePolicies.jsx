import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyPagePolicies() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (!token) {
          alert('로그인이 필요합니다.');
          navigate('/');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/information/user-policies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('정책 정보를 불러올 수 없습니다.');
        const data = await res.json();

        const parsed = data.map((item) => {
          const parsedData = JSON.parse(item.policyDataJson);
          return {
            id: item.id,
            title: parsedData.plcyNm,
            description: parsedData.plcyExplnCn,
            category: parsedData.lclsfNm + ' - ' + parsedData.mclsfNm,
            benefit: parsedData.plcySprtCn,
            ageRange: parsedData.ageRange,
          };
        });

        setPolicies(parsed);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };

    fetchUserPolicies();
  }, [navigate]);

  const confirmDelete = (id) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!token || !targetId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/information/user-policies/${targetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('삭제에 실패했습니다.');
      setPolicies((prev) => {
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

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, policies.length - 1));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      {/* ✅ 삭제 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <p className="text-gray-800 text-lg font-semibold mb-4">정책을 정말 삭제하시겠습니까?</p>
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
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">저장한 부동산 정책</h2>

            <div className="relative">
              {policies.length === 0 ? (
                <div className="bg-white border border-blue-200 rounded-2xl shadow-lg px-8 py-20 text-center">
                  <p className="text-gray-500 text-lg">저장한 정책 정보가 없습니다.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white border border-blue-200 rounded-2xl shadow-lg px-8 py-6">
                    <h3 className="text-lg font-semibold text-gray-900">{policies[currentIndex].title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{policies[currentIndex].description}</p>
                    <p className="text-sm text-gray-600 mt-1">{policies[currentIndex].category}</p>
                    <p className="text-sm text-gray-600 mt-1">{policies[currentIndex].benefit}</p>
                    <p className="text-sm text-gray-600 mt-1">대상 연령: {policies[currentIndex].ageRange}</p>

                    <div className="flex justify-between items-center mt-6">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                        바로가기
                      </button>
                      <button
                        onClick={() => confirmDelete(policies[currentIndex].id)}
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
                      {currentIndex + 1} / {policies.length}
                    </span>
                    <button
                      onClick={nextSlide}
                      className="text-blue-500 hover:underline disabled:text-gray-400"
                      disabled={currentIndex === policies.length - 1}
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
                onClick={() => navigate('/mypage/subscriptions')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                저장한 청약 정보
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyPagePolicies;
