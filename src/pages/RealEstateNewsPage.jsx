import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import startImage from '../assets/mainpage.png';
import { FaSpinner } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function RealEstateNewsPage() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 9;
  const PAGE_GROUP_SIZE = 5;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/information/news-get?page=${page}&size=${PAGE_SIZE}`
        );
        if (!res.ok) throw new Error('뉴스 데이터를 불러오지 못했습니다.');
        const data = await res.json();
        setNews(data.content || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  const currentGroup = Math.floor(page / PAGE_GROUP_SIZE);
  const groupStart = currentGroup * PAGE_GROUP_SIZE;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE, totalPages);

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <img
        src={startImage}
        alt="배경"
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-full object-cover pointer-events-none"
      />

      <div className="relative z-10 flex px-8 pt-12 items-start h-full">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center py-6 px-10 overflow-hidden">
          <h1 className="text-3xl font-bold text-gray-800">부동산 뉴스</h1>
          <p className="text-gray-600 mb-6">최신 부동산 뉴스를 확인해보세요.</p>

          {loading ? (
            <div className="flex justify-center items-center text-blue-500 py-6">
              <FaSpinner className="animate-spin mr-2" /> 불러오는 중...
            </div>
          ) : error ? (
            <div className="text-red-500">❌ 오류: {error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
                {news.map((newsItem, idx) => (
                  <a
                    key={idx}
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-300 hover:bg-blue-400 text-white rounded-2xl p-4 flex flex-col items-center transition cursor-pointer no-underline"
                  >
                    <div className="w-full h-28 bg-blue-500 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={newsItem.imageUrl || 'https://via.placeholder.com/150'}
                        alt={newsItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center font-semibold text-sm">
                      {newsItem.title}
                      <p className="text-xs text-white mt-1">{newsItem.publishedAt}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-10 flex-wrap justify-center">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  ◀◀
                </button>
                <button
                  onClick={() => setPage(Math.max(groupStart - 1, 0))}
                  disabled={groupStart === 0}
                  className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  ◀
                </button>

                {Array.from({ length: groupEnd - groupStart }, (_, i) => {
                  const pageNumber = groupStart + i;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-1 text-sm rounded ${
                        pageNumber === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(groupEnd)}
                  disabled={groupEnd >= totalPages}
                  className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  ▶
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page === totalPages - 1}
                  className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  ▶▶
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default RealEstateNewsPage;
