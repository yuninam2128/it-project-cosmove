// Project.js
// 이 컴포넌트는 하나의 프로젝트 정보를 원형으로 표시하고, 수정/삭제 버튼 및 프로젝트 상세 페이지로 이동할 수 있는 링크를 제공합니다.

import { useState } from "react";
import { createPortal } from "react-dom"; // 포털을 사용해 모달을 body에 렌더링
import { Link } from "react-router-dom"; // 프로젝트 상세 페이지 이동을 위한 Link
import EditProjectForm from "./EditProjectForm"; // 프로젝트 수정 폼 컴포넌트 import
import "./Project.css"; // 스타일 import
import penIcon from "./edit.png"; // 수정 아이콘 이미지 import
import trashcanIcon from "./delete.png" // 삭제 아이콘 이미지 import

// Project 컴포넌트 정의, 프로젝트 정보와 콜백 함수, 위치 정보를 props로 받음
function Project({ project, onDeleteProject, onEditProject, position }) {
  // 수정 폼(모달) 표시 여부 상태
  const [showEditForm, setShowEditForm] = useState(false);
  // 마우스 hover 상태 관리
  const [isHovered, setIsHovered] = useState(false);
  // 프로젝트가 완료(진행도 100%)인지 여부
  const isCompleted = project.progress === 100;
  // 중요도 및 완료 상태에 따라 동적으로 클래스명 생성
  const priorityClass = `project-circle ${project.priority} ${isCompleted ? "완료" : ""}`;

  return (
    // 프로젝트 원형을 화면의 지정된 위치에 표시
    <div
      className="project-wrapper"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      // 마우스가 올라가면 버튼 표시, 벗어나면 숨김
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 프로젝트 상세 페이지로 이동하는 링크(원형) */}
      <Link to={`/project/${project.id}`} state={{project}} className={priorityClass}>
        <span className="project-title">{project.title}</span>
      </Link>

      {/* 마우스 hover 시 수정/삭제 버튼 표시 */}
      {isHovered && (
        <div className="project-buttons">
          {/* 수정 버튼: 클릭 시 수정 폼(모달) 표시 */}
          <button onClick={() => setShowEditForm(true)}>
            <img src={penIcon} alt="수정"/>
          </button>
          {/* 삭제 버튼: 클릭 시 삭제 콜백 호출 */}
          <button onClick={() => onDeleteProject(project.id)}>
            <img src={trashcanIcon} alt="삭제"/>
          </button>
        </div>
      )}

      {/* 수정 폼(모달) 표시: 포털을 사용해 body에 렌더링 */}
      {showEditForm && (
        createPortal(
          <EditProjectForm
            project={project}
            onSubmit={onEditProject}
            onClose={() => setShowEditForm(false)}
          />, 
          document.body
        )
      )}
    </div>
  );
}

export default Project; //