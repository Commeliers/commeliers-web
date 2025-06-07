import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CHAT_STORAGE_KEY = 'chatRooms';
const MAX_ROOMS = 5;
const EXPIRY_HOURS = 24;

const getValidRooms = () => {
  const data = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]');
  const now = new Date();
  return data.filter(room => {
    const created = new Date(room.createdAt);
    const diff = (now - created) / (1000 * 60 * 60);
    return diff < EXPIRY_HOURS;
  });
};

const saveRooms = (rooms) => {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(rooms));
};

function ChatModal({ question, onClose }) {
  const [rooms, setRooms] = useState(getValidRooms());
  const roomsRef = useRef(rooms); // rooms 최신값을 담는 ref
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [pendingQuestion, setPendingQuestion] = useState(null);

  // rooms 상태가 변경될 때 roomsRef.current를 최신화
  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  // question prop 변화 감지 -> pendingQuestion 설정
  useEffect(() => {
    if (question && question.trim()) {
      setPendingQuestion(question.trim());
    }
  }, [question]);

  // pendingQuestion 있을 때 새 방 만들고 질문 보내기
  useEffect(() => {
    if (!pendingQuestion) return;

    if (roomsRef.current.length >= MAX_ROOMS) {
      alert('대화방은 최대 5개까지 가능합니다.');
      setPendingQuestion(null);
      return;
    }

    const newRoom = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      messages: [{ sender: 'user', text: pendingQuestion }],
    };

    const updatedRooms = [newRoom, ...roomsRef.current];
    setRooms(updatedRooms);
    setCurrentRoomId(newRoom.id);
    saveRooms(updatedRooms);

    fetchAnswer(pendingQuestion, newRoom.id);

    setPendingQuestion(null);
  }, [pendingQuestion]);

  // currentRoom 변경 시 입력 초기화 + 스크롤 아래로
  useEffect(() => {
    setInput('');
    scrollToBottom();
  }, [currentRoomId]);

  // rooms 변경 시 localStorage 저장 + 스크롤 아래로
  useEffect(() => {
    saveRooms(rooms);
    scrollToBottom();
  }, [rooms]);

  const fetchAnswer = async (content, roomId) => {
    if (!content || !roomId) return;
    setLoading(true);

    try {
      const res = await fetch('http://rspqymajqrttzwxp.tunnel.elice.io/api/estate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error('API 호출 실패');

      const data = await res.json();

      setRooms(prevRooms => {
        const updatedRooms = prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              messages: [
                ...room.messages,
                {
                  sender: 'bot',
                  concept: data.concept,
                  example: data.example,
                  follow_up: data.follow_up,
                },
              ],
            };
          }
          return room;
        });
        saveRooms(updatedRooms);
        return updatedRooms;
      });
    } catch (err) {
      console.error(err);
      setRooms(prevRooms => {
        const updatedRooms = prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              messages: [
                ...room.messages,
                { sender: 'bot', concept: '', example: '오류가 발생했습니다.', follow_up: [] },
              ],
            };
          }
          return room;
        });
        saveRooms(updatedRooms);
        return updatedRooms;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !currentRoomId || loading) return;

    // 사용자 메시지 추가
    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room => {
        if (room.id === currentRoomId) {
          return {
            ...room,
            messages: [...room.messages, { sender: 'user', text: input.trim() }],
          };
        }
        return room;
      });
      saveRooms(updatedRooms);
      return updatedRooms;
    });

    fetchAnswer(input.trim(), currentRoomId);
    setInput('');
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };


    const deleteRoom = (roomId) => {
        const filtered = rooms.filter(r => r.id !== roomId);
        saveRooms(filtered);
        setRooms(filtered);
        if (roomId === currentRoomId) setCurrentRoomId(null);
    };

    const currentRoom = rooms.find(r => r.id === currentRoomId);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg flex w-[800px] h-[900px] overflow-hidden">
            {/* 좌측 대화방 리스트 */}
            <div className="w-48 border-r border-gray-300 flex flex-col">
            <div className="p-4 border-b border-gray-300 font-bold text-center">대화방 목록</div>
            <div className="flex-1 overflow-y-auto">
                {rooms.length === 0 && <p className="p-2 text-center text-gray-500">대화방이 없습니다.</p>}
                {rooms.map(room => (
                <div
                    key={room.id}
                    onClick={() => setCurrentRoomId(room.id)}
                    className={`cursor-pointer px-4 py-2 border-b border-gray-200 hover:bg-blue-100
                    ${room.id === currentRoomId ? 'bg-blue-300 font-semibold' : ''}`}
                >
                    {room.messages[0]?.text.slice(0, 20) || '새 대화'}
                    {/* 대화방 삭제 버튼 예시 */}
    <button
    onClick={() => deleteRoom(room.id)}
    className="
        ml-2
        text-gray-400
        hover:text-red-600
        font-bold
        text-lg
        rounded-full
        focus:outline-none
        focus:ring-1
        focus:ring-red-600
        transition-colors
    "
    aria-label="대화방 삭제"
    title="대화방 삭제"
    >
    ×
    </button>
                </div>
                ))}
            </div>
            {rooms.length < MAX_ROOMS && (
                <button
                onClick={() => {
                    const newRoom = {
                    id: uuidv4(),
                    createdAt: new Date().toISOString(),
                    messages: [],
                    };
                    const updated = [newRoom, ...rooms];
                    setRooms(updated);
                    setCurrentRoomId(newRoom.id);
                    saveRooms(updated);
                }}
                className="m-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                새 대화방 만들기
                </button>
            )}
            </div>

            {/* 우측 대화 영역 */}
            <div className="flex flex-col flex-1">
            {/* 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300 font-bold">
                <span>부동산 도우미</span>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-bold">
                닫기 ✕
                </button>
            </div>

            {/* 대화 내용 */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50"
                style={{ wordBreak: 'break-word' }}
            >
                {!currentRoom && <p className="text-center text-gray-500 mt-10">대화방을 선택하거나 새로 만드세요.</p>}

                {currentRoom &&
                currentRoom.messages.map((msg, idx) =>
                    msg.sender === 'user' ? (
                    <div key={idx} className="text-right">
                        <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg max-w-[70%] break-words">
                        {msg.text}
                        </div>
                    </div>
                    ) : (
                    <div key={idx} className="text-left space-y-1 max-w-[70%]">
                        <div className="bg-gray-200 px-4 py-2 rounded-lg whitespace-pre-wrap">
                        <p><strong>개념 요약:</strong> {msg.concept}</p>
                        <p><strong>예시 설명:</strong> {msg.example}</p>
                        {msg.follow_up && msg.follow_up.length > 0 && (
                            <>
                            <p><strong>추가 질문:</strong></p>
                            <ul className="list-disc list-inside">
                                {msg.follow_up.map((q, i) => (
                                <li key={i}>{q}</li>
                                ))}
                            </ul>
                            </>
                        )}
                        </div>
                    </div>
                    )
                )}
                {loading && (
                <p className="text-center text-gray-500">답변을 불러오는 중입니다...</p>
                )}
            </div>

            {/* 입력창 */}
            {currentRoom && (
                <div className="p-4 border-t border-gray-300 flex space-x-2">
                <input
                    type="text"
                    placeholder="질문을 입력하세요"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                    }
                    }}
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400`}
                >
                    보내기
                </button>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    }

    export default ChatModal;
