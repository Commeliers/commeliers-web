import React from 'react';

function PostFormModal({
  setModalOpen,
  titleInput,
  setTitleInput,
  contentInput,
  setContentInput,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  handleCreatePost,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-96 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">새 글 작성</h3>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={contentInput}
          onChange={(e) => setContentInput(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[100px]"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setImagePreview(reader.result);
              reader.readAsDataURL(file);
            } else {
              setImagePreview(null);
            }
          }}
          className="p-2 border rounded-md w-full"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="미리보기"
            className="w-full max-h-48 object-cover rounded-md border"
          />
        )}
        <div className="flex justify-end gap-2">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-md">
            취소
          </button>
          <button onClick={handleCreatePost} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostFormModal;
