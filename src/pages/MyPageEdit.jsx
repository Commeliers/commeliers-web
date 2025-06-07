import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { useUserStore } from '../store/useUserStore';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyPageEdit() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    id: '',
    gender: '',
    profile_image: '',
    job: '',
    income: '',
    move_in_date: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!res.ok) throw new Error('회원 정보 불러오기 실패');
        const data = await res.json();

        setFormData({
          id: user?.email || data.id || '',
          gender: data.gender || '',
          profile_image: data.profile_image || '',
          job: data.job || '',
          income: data.income || '',
          move_in_date: data.move_in_date?.split('T')[0] || '',
        });
      } catch (err) {
        console.error(err);
        alert('회원 정보를 불러오지 못했습니다.');
      }
    };

    if (user?.token) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          gender: formData.gender,
          profile_image: formData.profile_image,
          job: formData.job,
          income: formData.income,
          move_in_date: formData.move_in_date,
        }),
      });
      if (!res.ok) throw new Error('수정 실패');

      alert('✅ 회원 정보가 수정되었습니다.');

      const updatedUser = { ...user, id: formData.id };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      alert('❌ 수정 실패: ' + err.message);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden flex">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start">
        <Sidebar />
      </div>

      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md bg-white bg-opacity-70 p-8 rounded-xl shadow-md backdrop-blur">
          <h2 className="text-2xl font-bold text-center mb-8">회원 정보 수정</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm mb-1">닉네임</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                readOnly
                className="w-full bg-gray-200 text-gray-500 rounded px-4 py-2 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-100 rounded px-4 py-2"
              >
                <option value="">선택</option>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">직업</label>
              <input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="w-full bg-gray-100 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">
                월 소득 (단위: 만 원)
              </label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                className="w-full bg-gray-100 rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">입주 예정일</label>
              <input
                type="date"
                name="move_in_date"
                value={formData.move_in_date}
                onChange={handleChange}
                className="w-full bg-gray-100 rounded px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
            >
              정보 수정 완료
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default MyPageEdit;
