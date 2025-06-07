// App.jsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUserStore } from './store/useUserStore';

// 페이지 컴포넌트 임포트
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';
import DetectPage from './pages/DetectPage';
import CommunityPage from './pages/CommunityPage';
import NewsPage from './pages/NewsPage';
import GuidePage from './pages/GuidePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InfoPage from './pages/InfoPage';
import QuizPage from './pages/QuizPage';
import SupportPage from './pages/SupportPage';
import ScamDetectionPage from './pages/ScamDetectionPage';
import ResultPage from './pages/ResultPage';
import QuizResultPage from './pages/QuizResultPage';
import SubscriptionInfoPage from './pages/SubscriptionInfoPage';
import RealEstateNewsPage from './pages/RealEstateNewsPage';
import MonthlyExpensePage from './pages/MonthlyExpensePage';
import ContractChecklistPage from './pages/ContractChecklistPage';
import KakaoRedirect from './pages/KakaoRedirect';
import KakaoProfileComplete from './pages/KakaoProfileComplete';

import MyPage from './pages/MyPage';
import MyPageEdit from './pages/MyPageEdit';
import MyPageSaved from './pages/MyPageSaved';
import MyPageLiked from './pages/MyPageLiked';
import MyPagePolicies from './pages/MyPagePolicies';
import MyPageSubscriptions from './pages/MyPageSubscriptions';
import MyPageDelete from './pages/MyPageDelete';
import MyPageMyPosts from './pages/MyPageMyPosts';

import SimulationInputPage from './pages/SimulationInputPage';
import SimulationResultPage from './pages/SimulationResultPage';
import QuizAdminPage from './pages/QuizAdminPage';



function App() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const normal = localStorage.getItem('userInfo');
    const kakao = localStorage.getItem('kakaoUserInfo');
    const parsedUser = normal ? JSON.parse(normal) : kakao ? JSON.parse(kakao) : null;
    if (parsedUser) setUser(parsedUser);
  }, [setUser]);

  return (
    <Routes>
      {/* 일반 페이지 */}
      <Route path="/" element={<StartPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/detect" element={<DetectPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/info" element={<InfoPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/scam-detect" element={<ScamDetectionPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/quizresultpage" element={<QuizResultPage />} />
      <Route path="/quizadmin" element={<QuizAdminPage />} />
      <Route path="/subscription-info" element={<SubscriptionInfoPage />} />
      <Route path="/real-estate-news" element={<RealEstateNewsPage />} />
      <Route path="/expense" element={<MonthlyExpensePage />} />
      <Route path="/contract-checklist" element={<ContractChecklistPage />} />
      <Route path="/oauth/kakao/redirect" element={<KakaoRedirect />} />
      <Route path="/kakao-profile-complete" element={<KakaoProfileComplete />} />

      {/* 마이페이지 관련 */}
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/edit" element={<MyPageEdit />} />
      <Route path="/mypage/saved" element={<MyPageSaved />} />
      <Route path="/mypage/liked-posts" element={<MyPageLiked />} />
      <Route path="/mypage/my-posts" element={<MyPageMyPosts />} />
      <Route path="/mypage/policies" element={<MyPagePolicies />} />
      <Route path="/mypage/subscriptions" element={<MyPageSubscriptions />} />
      <Route path="/mypage/delete" element={<MyPageDelete />} />

      {/* 내 집 마련 시뮬레이션 */}
      <Route path="/simulation" element={<SimulationInputPage />} />
      <Route path="/simulation/result" element={<SimulationResultPage />} />
    </Routes>
  );
}

export default App;
