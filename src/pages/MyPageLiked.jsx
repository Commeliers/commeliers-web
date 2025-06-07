import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useNavigate } from 'react-router-dom';
import { useLikeStore } from '../store/likeStore'; // ✅ 좋아요 상태 불러오기

function MyPageLiked() {
  const navigate = useNavigate();
  const { likedPosts, loadLikes, removeLike } = useLikeStore();

  useEffect(() => {
    loadLikes(); // ✅ localStorage → zustand 초기화
  }, [loadLikes]);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center px-8 pt-20">
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
              좋아요 누른 게시글
            </h2>

            {likedPosts.length === 0 ? (
              <p className="text-center text-gray-500">좋아요한 게시글이 없습니다.</p>
            ) : (
              <div className="space-y-6">
                {likedPosts.map((post, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-white border border-blue-200 rounded-2xl shadow-lg px-8 py-6 flex flex-col items-start"
                  >
                    <div className="w-full flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          카테고리: {post.category || '자유게시판'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLike(post.title)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        좋아요 취소
                      </button>
                    </div>

                    <div className="w-full flex justify-start mt-4">
                      <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        바로가기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => navigate('/mypage/policies')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                저장한 부동산 정책
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

export default MyPageLiked;
