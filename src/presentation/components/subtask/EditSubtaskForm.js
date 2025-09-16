// EditSubtaskForm.js
// 이 컴포넌트는 세부 목표(subtask) 정보를 수정할 수 있는 폼(모달)을 제공합니다.

import { useState } from "react";

// EditSubtaskForm 컴포넌트 정의, subtask, onSubmit, onClose prop을 받음
function EditSubtaskForm({ subtask, onSubmit, onClose }) {
  // 각 입력값을 상태로 관리
  const [title, setTitle] = useState(subtask.title); // 세부 목표 이름
  const [deadline, setDeadline] = useState(subtask.deadline); // 마감일
  const [progress, setProgress] = useState(subtask.progress); // 진행도

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 동작 방지
    onSubmit({
      ...subtask, // 기존 세부 목표 정보 유지
      title, // 수정된 이름
      deadline, // 수정된 마감일
      progress: Number(progress), // 수정된 진행도(숫자형 변환)
    });
    onClose(); // 모달 닫기
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>세부 목표 수정</h2>

        {/* 세부 목표 수정 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 이름 입력 */}
          <label>
            이름:{" "}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          {/* 마감일 입력 */}
          <label>
            마감일:{" "}
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
          {/* 진행도 입력 */}
          <label>
            진행도 (%):{" "}
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
          </label>

          {/* 저장 및 취소 버튼 */}
          <button type="submit">저장</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditSubtaskForm; //