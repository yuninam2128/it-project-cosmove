// Project.js 수정 - 라우터 링크 활성화
import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import EditProjectForm from "./EditProjectForm";
import "./styles/Project.css";
import penIcon from "../images/edit.png";
import trashcanIcon from "../images/delete.png";

function Project({ project, onDeleteProject, onEditProject, position }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = project.progress === 100;
  const priorityClass = `project-circle ${project.priority} ${isCompleted ? "완료" : ""}`;

  return (
    <div
      className="project-wrapper"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 프로젝트 상세 페이지로 이동하는 링크 */}
      <Link 
        to={`/project/${project.id}`} 
        state={{ project }} 
        className={priorityClass}
        style={{ textDecoration: 'none' }}
      >
        <span className="project-title">{project.title}</span>
      </Link>

      {isHovered && (
        <div className="project-buttons">
          <button onClick={() => setShowEditForm(true)}>
            <img src={penIcon} alt="수정"/>
          </button>
          <button onClick={() => onDeleteProject(project.id)}>
            <img src={trashcanIcon} alt="삭제"/>
          </button>
        </div>
      )}

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

export default Project;