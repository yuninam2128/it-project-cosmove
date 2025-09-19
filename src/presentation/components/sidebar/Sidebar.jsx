// Sidebar 컴포넌트
// GameSidebar.jsx
import { useNavigate } from "react-router-dom";
import "./ProjectList.jsx"
import ProjectList from "./ProjectList.jsx";

function GameSidebar({ onAddProject, projects }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="menu-section">
        <button
          className="game-button search"
        >
          <img src="/images/homeIcon.png" alt="홈 아이콘"/>
          <p>홈 화면</p>
        </button>
        <button 
          className="game-button store"
          onClick={() => navigate("/store")}
        >
          <img src="/images/storeIcon.png" alt="스토어 아이콘"/>
          <p>스토어</p>
        </button>
        <button 
          className="game-button add-project"
          onClick={onAddProject}
        >
          <p>프로젝트 추가</p>
        </button>
        <button 
          className="game-button logout"
          onClick={() => navigate("/")}
        >
          <p>로그아웃</p>
        </button>
      </div>
      <div>
        <h3>프로젝트 목록</h3>
        <ProjectList 
          projects={projects}
        />
      </div>    
    </div>
  );
}

export default GameSidebar;