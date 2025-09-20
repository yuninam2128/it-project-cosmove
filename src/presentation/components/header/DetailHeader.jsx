import "./header.css";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function DetailHeader({ onAddSubtask, currentDate, project }) {
  const [fire, setFire] = useState(0);
  const [heart, setHeart] = useState(0);
  const [light, setLight] = useState(0);
  const navigate = useNavigate();
  
  

  useEffect(() => {
    // Firebase 흉내내기 → setTimeout으로 데이터 가져오는 것처럼
    setTimeout(() => {
      setFire(1000);
      setHeart(2000);
      setLight(3000);
    }, 1000);
  }, []);

  return (
    <div className ="header-container">
      <div className="button-area">
        <div className="left-header">
          <button className="header__button header__button--back" onClick={() => navigate("/home")}>←</button>
          <button className="header__button header__button--add" onClick={onAddSubtask}>+ 세부 프로젝트 추가</button>
        </div>
        <div className="right-header">
          <button className="header__button header__button--right">
            <img src="/images/Cjelly.png" alt="불꽃젤리" className="fire-jelly" />
            <span className="tooltip">{fire}</span>
          </button>
          <button className="header__button header__button--right">
            <img src="/images/Bjelly.png" alt="빛나는 젤리" className="fire-jelly" />
            <span className="tooltip">{light}</span>
          </button>
          <button className="header__button header__button--right">
            <img src="/images/Ajelly.png" alt="하트젤리" className="fire-jelly" />
            <span className="tooltip">{heart}</span>
          </button>
        </div>
      </div>
      <div className="info-area">
        <p>{currentDate}</p>
        <div className="project-info">
          <h1>{project.title}의 행성들을 정복해 보아요!</h1>
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
      </div>
    </div>
  );
}

export default DetailHeader;