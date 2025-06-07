// src/pages/MyPageMyPosts.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useUserStore } from '../store/useUserStore';
import { usePostStore } from '../store/postStore';

function MyPageMyPosts() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  // 로그인된 사용자의 이메일
  const userEmail = user?.email || '';
  // 로컬 파트(도메인 앞) 추출 (예: "kimminjae1573")
  const userLocal = userEmail?.includes('@') ? userEmail.split('@')[0] : userEmail;

  // usePostStore에서 posts 상태와 loadPostsFromServer 함수 가져오기
  const { posts, loadPostsFromServer } = usePostStore();

  // 컴포넌트 마운트 시 서버에서 전체 게시글 불러오기
  useEffect(() => {
    loadPostsFromServer(); // 기본 category = '자유게시판'
  }, [loadPostsFromServer]);

  // 서버에서 받아온 posts 상태 전체를 콘솔에 찍어 확인
  

  // 만약 posts 배열에 데이터가 들어왔다면 샘플 객체 구조를 찍어봅니다
  if (posts.length > 0) {
    
  }

  // post.userId가 이메일(full) 또는 로컬파트 형태일 수 있으므로 로컬 파트를 동일하게 만들어 비교
  const myPosts = posts.filter((post) => {
    const postLocal = post.userId?.includes('@')
      ? post.userId.split('@')[0]
      : post.userId;

    // console.log('▶[page] 비교용 postLocal:', postLocal, 'userLocal:', userLocal);
    return postLocal === userLocal;
  });

  // 필터링된 “내가 작성한 게시글” 결과를 찍어봅니다
  console.log('▶[page] 내 게시글(myPosts):', myPosts);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-10">
            내가 작성한 게시글
          </h1>

          <div className="space-y-6 w-full max-w-2xl">
            {myPosts.length === 0 ? (
              <p className="text-center text-gray-500">
                작성한 게시글이 없습니다.
              </p>
            ) : (
              myPosts.map((post) => (
                <div
                  key={post.postId}
                  onClick={() => navigate(`/communities/${post.postId}`)}
                  className="w-full bg-white/70 backdrop-blur border border-blue-300 rounded-2xl px-6 py-5 flex flex-col justify-between min-h-[120px] shadow hover:shadow-lg transition cursor-pointer"
                >
                  <div>
                    <span className="text-gray-800 font-semibold text-lg">
                      {post.title}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <span className="text-gray-600 text-sm line-clamp-2">
                      {post.content}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex justify-between">
                    <span>{post.userId}</span>
                    <span>
                      {new Date(post.createdAt + 'Z').toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Seoul',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyPageMyPosts;
