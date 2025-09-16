import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubtaskMindmap from "../components/subtask/SubtaskMindmap";
import TodoManager from "../components/todo/TodoManager";
import "./Detail.css";

// 더미 데이터 (실제로는 Firebase에서 가져올 데이터)
const getDummyProjectData = (projectId) => ({
  id: projectId,
  title: "웹사이트 개발 프로젝트",
  deadline: new Date("2024-12-31"),
  progress: 65,
  priority: "상",
  description: "회사 홈페이지 리뉴얼 프로젝트",
  subtasks: [
    {
      id: "101",
      title: "기획 정리",
      deadline: new Date("2024-09-15"),
      progress: 100,
      priority: "상",
      startDate: "2024-09-05",
      endDate: "2024-09-15",
      description: "요구사항 분석 및 기획서 작성"
    },
    {
      id: "102", 
      title: "UI 디자인",
      deadline: new Date("2024-09-25"),
      progress: 80,
      priority: "상",
      startDate: "2024-09-10",
      endDate: "2024-09-25",
      description: "화면 설계 및 디자인 시안 제작"
    },
    {
      id: "103",
      title: "프론트엔드 개발", 
      deadline: new Date("2024-10-15"),
      progress: 45,
      priority: "중",
      startDate: "2024-09-20",
      endDate: "2024-10-15",
      description: "React 기반 사용자 인터페이스 구현"
    },
    {
      id: "104",
      title: "백엔드 개발",
      deadline: new Date("2024-10-20"),
      progress: 30,
      priority: "중", 
      startDate: "2024-09-25",
      endDate: "2024-10-20",
      description: "API 서버 및 데이터베이스 구축"
    },
    {
      id: "105",
      title: "테스트 & 배포",
      deadline: new Date("2024-11-01"),
      progress: 0,
      priority: "하",
      startDate: "2024-10-15",
      endDate: "2024-11-01", 
      description: "QA 테스트 및 프로덕션 배포"
    }
  ]
});

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [currentView, setCurrentView] = useState('mindmap'); // 'mindmap' | 'todo'
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [subtaskPositions, setSubtaskPositions] = useState({});

  // 프로젝트 데이터 로드
  useEffect(() => {
    // 실제로는 Firebase에서 프로젝트 데이터를 가져옴
    const projectData = getDummyProjectData(projectId);
    setProject(projectData);
    
    // 초기 subtask 위치 설정
    const initialPositions = generateInitialPositions(projectData.subtasks);
    setSubtaskPositions(initialPositions);
  }, [projectId]);

  // 중요도에 따른 원 크기 반환
  const getRadius = (priority) => {
    if (priority === "상") return 75;
    if (priority === "중") return 55;
    return 40;
  };

  // 초기 subtask 위치 생성
  const generateInitialPositions = (subtasks) => {
    const positions = {};
    const centerX = 400;
    const centerY = 250;
    const radius = 150;

    subtasks.forEach((subtask, index) => {
      const angle = (index * 2 * Math.PI) / subtasks.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const nodeRadius = getRadius(subtask.priority);
      
      positions[subtask.id] = {
        x: Math.max(50, Math.min(x, 750)),
        y: Math.max(50, Math.min(y, 450)),
        radius: nodeRadius
      };
    });

    return positions;
  };

  // Subtask 추가
  const handleAddSubtask = (newSubtask) => {
    if (!project) return;

    const subtaskId = `subtask_${Date.now()}`;
    const subtaskWithId = {
      ...newSubtask,
      id: subtaskId,
      deadline: new Date(newSubtask.deadline),
      progress: Number(newSubtask.progress)
    };

    // 새 subtask 위치 계산
    const newPosition = findAvailablePosition();
    
    setProject(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, subtaskWithId]
    }));

    setSubtaskPositions(prev => ({
      ...prev,
      [subtaskId]: newPosition
    }));

    console.log('Subtask 추가됨:', subtaskWithId);
  };

  // 사용 가능한 위치 찾기
  const findAvailablePosition = () => {
    const radius = getRadius("중"); // 기본 크기
    const padding = 20;
    const mapWidth = 800;
    const mapHeight = 500;
    const maxAttempts = 100;

    for (let i = 0; i < maxAttempts; i++) {
      const x = radius + Math.random() * (mapWidth - 2 * radius);
      const y = radius + Math.random() * (mapHeight - 2 * radius);

      // 기존 노드들과 겹치는지 확인
      const isOverlapping = Object.values(subtaskPositions).some(pos => {
        const dx = pos.x - x;
        const dy = pos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < pos.radius + radius + padding;
      });

      if (!isOverlapping) {
        return { x, y, radius };
      }
    }

    // 위치를 찾지 못한 경우 랜덤 위치 반환
    return {
      x: radius + Math.random() * (mapWidth - 2 * radius),
      y: radius + Math.random() * (mapHeight - 2 * radius),
      radius
    };
  };

  // Subtask 수정
  const handleEditSubtask = (updatedSubtask) => {
    if (!project) return;

    setProject(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask =>
        subtask.id === updatedSubtask.id
          ? { 
              ...updatedSubtask,
              deadline: new Date(updatedSubtask.deadline),
              progress: Number(updatedSubtask.progress)
            }
          : subtask
      )
    }));

    // 중요도가 변경된 경우 크기 업데이트
    const newRadius = getRadius(updatedSubtask.priority);
    setSubtaskPositions(prev => ({
      ...prev,
      [updatedSubtask.id]: {
        ...prev[updatedSubtask.id],
        radius: newRadius
      }
    }));

    console.log('Subtask 수정됨:', updatedSubtask);
  };

  // Subtask 삭제
  const handleDeleteSubtask = (subtaskId) => {
    if (!project) return;

    setProject(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId)
    }));

    setSubtaskPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[subtaskId];
      return newPositions;
    });

    console.log('Subtask 삭제됨:', subtaskId);
  };

  // Subtask 위치 변경
  const handleSubtaskPositionChange = (subtaskId, x, y) => {
    setSubtaskPositions(prev => ({
      ...prev,
      [subtaskId]: {
        ...prev[subtaskId],
        x,
        y
      }
    }));
  };

  // Subtask 노드 클릭 (Todo 관리로 이동)
  const handleSubtaskClick = (subtask) => {
    setSelectedSubtask(subtask);
    setCurrentView('todo');
  };

  // 마인드맵으로 돌아가기
  const handleBackToMindmap = () => {
    setCurrentView('mindmap');
    setSelectedSubtask(null);
  };

  if (!project) {
    return (
      <div className="loading-container">
        <p>프로젝트를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      {/* 헤더 */}
      <header className="project-detail-header">
        <button 
          className="back-button"
          onClick={() => navigate('/home')}
        >
          ← 홈으로 돌아가기
        </button>
        <div className="project-info">
          <h1>{project.title}</h1>
          <div className="project-meta">
            <span className={`priority-badge ${project.priority}`}>
              중요도: {project.priority}
            </span>
            <span className="progress-badge">
              진행도: {project.progress}%
            </span>
            <span className="deadline-badge">
              마감일: {project.deadline.toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="project-detail-main">
        {currentView === 'mindmap' && (
          <SubtaskMindmap
            project={project}
            positions={subtaskPositions}
            onSubtaskClick={handleSubtaskClick}
            onAddSubtask={handleAddSubtask}
            onEditSubtask={handleEditSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onPositionChange={handleSubtaskPositionChange}
          />
        )}

        {currentView === 'todo' && selectedSubtask && (
          <TodoManager
            subtask={selectedSubtask}
            onBack={handleBackToMindmap}
          />
        )}
      </main>
    </div>
  );
}

export default ProjectDetail;