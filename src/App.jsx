import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage'; 
import MainPage from './pages/MainPage';
import DetectPage from './pages/DetectPage';
import CommunityPage from './pages/CommunityPage';
import NewsPage from './pages/NewsPage';
import GuidePage from './pages/GuidePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<StartPage />} />
         <Route path="/main" element={<MainPage />} />
        <Route path="/detect" element={<DetectPage />} />
        <Route path="/community" element={<CommunityPage />} /> 
        <Route path="/news" element={<NewsPage />} /> 
        <Route path="/guide" element={<GuidePage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
