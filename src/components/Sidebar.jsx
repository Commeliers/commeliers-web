// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Bot,
  Mail,
  Pencil,
  LogIn,
} from 'lucide-react'; // ← Lucide 아이콘 불러오기

function Sidebar() {
  return (
    <aside className="w-64 h-[90vh] bg-white shadow-xl flex flex-col items-center px-4">
      {/* 상단 로고 */}
      <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-8">
        <Home size={24} />
        <span>Homeprotect</span>
      </div>

      {/* 메뉴 리스트 박스 */}
      <div className="w-full border border-blue-200 rounded-lg p-4 space-y-4 mb-6">
      <Link to="/main" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
          <Home size={20} /> <span>시작하기</span>
        </Link>
        <Link to="/community" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
          <MessageCircle size={20} /> <span>커뮤니티</span>
         </Link>
        <Link to="/detect" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
          <Bot size={20} /> <span>전세 사기</span>
        </Link>
        <Link to="/news" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
         <Mail size={20} /> <span>소식</span>
         </Link>
         <Link to="/guide" className="flex items-center gap-2 text-gray-800 hover:text-blue-600">
         <Pencil size={20} /> <span>내 집 마련 가이드</span>
         </Link>
      </div>

      {/* 로그인 버튼 */}
      <Link
       to="/login"
      className="w-full border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
      >
      <LogIn size={18} />
      Login
     </Link>
    </aside>
  );
}

export default Sidebar;
