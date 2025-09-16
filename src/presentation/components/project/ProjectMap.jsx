// ProjectMap.jsx
// 📌 이 컴포넌트는 전체 프로젝트들을 '맵' 형태로 배치하고, 마우스로 드래그하여 맵을 이동(panning)할 수 있게 한다.
import { useEffect, useState } from "react";
import Project from "./Project";
import "./styles/ProjectMap.css";

function ProjectMap({ projects, positions, onDeleteProject, onEditProject, onPositionsChange }) {
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState(null);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const getPosition = (id) => {
    const pos = positions[id];
    return pos
      ? {
          top: pos.y - pos.radius + mapOffset.y,
          left: pos.x - pos.radius + mapOffset.x,
        }
      : { top: 0, left: 0 };
  };

  const handleMouseDown = (e) => {
    // 프로젝트 클릭이 아닌 경우만 드래그 시작
    if (e.target.closest('.project-container')) return;
    
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !lastMousePos) return;

    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setMapOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastMousePos(null);
  };

  return (
    <div 
      className="project-map"
      onMouseDown={handleMouseDown}
      style={{
        userSelect: isDragging ? "none" : "auto",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {projects.map((project) => (
        <Project
          key={project.id}
          project={project}
          onDeleteProject={onDeleteProject}
          onEditProject={onEditProject}
          position={getPosition(project.id)}
        />
      ))}
    </div>
  );
}

export default ProjectMap;