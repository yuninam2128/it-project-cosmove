import React, { useState } from "react";

// 유틸리티 함수들
const getWeekNumber = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const adjustedDate = date.getDate() + firstDayWeekday - 1;
  return Math.ceil(adjustedDate / 7);
};

const getWeeksInRange = (startDate, endDate) => {
  const weeks = new Set();
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const weekNum = getWeekNumber(current);
    const monthName = current.toLocaleDateString('ko-KR', { month: 'long' });
    weeks.add(`${monthName} ${weekNum}주차`);
    current.setDate(current.getDate() + 1);
  }
  
  return Array.from(weeks);
};

const getDaysInWeek = (year, month, weekNumber) => {
  const firstDay = new Date(year, month - 1, 1);
  const firstDayWeekday = firstDay.getDay();
  
  const startDate = (weekNumber - 1) * 7 - firstDayWeekday + 1;
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const dayDate = startDate + i;
    if (dayDate > 0) {
      const date = new Date(year, month - 1, dayDate);
      if (date.getMonth() === month - 1) {
        days.push(dayDate);
      }
    }
  }
  
  return days;
};

const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};

function TodoManager({ subtask, onBack }) {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState({});
  const [newTodo, setNewTodo] = useState('');

  const startDate = new Date(subtask.startDate);
  const endDate = new Date(subtask.endDate);
  const availableWeeks = getWeeksInRange(startDate, endDate);

  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
    setSelectedDate(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const addTodo = () => {
    if (!newTodo.trim() || !selectedDate) return;
    
    const dateKey = `${selectedDate}`;
    setTodos(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { id: Date.now(), text: newTodo, completed: false }]
    }));
    setNewTodo('');
  };

  const toggleTodo = (dateKey, todoId) => {
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const deleteTodo = (dateKey, todoId) => {
    setTodos(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(todo => todo.id !== todoId)
    }));
  };

  const getWeekDays = () => {
    if (!selectedWeek) return [];
    
    const weekMatch = selectedWeek.match(/(\d+)월 (\d+)주차/);
    if (!weekMatch) return [];
    
    const month = parseInt(weekMatch[1]);
    const weekNum = parseInt(weekMatch[2]);
    const year = startDate.getFullYear();
    
    return getDaysInWeek(year, month, weekNum);
  };

  const isDateActive = (day) => {
    const currentMonth = selectedWeek?.match(/(\d+)월/)?.[1];
    if (!currentMonth) return false;
    
    const checkDate = new Date(startDate.getFullYear(), parseInt(currentMonth) - 1, day);
    return isDateInRange(checkDate, startDate, endDate);
  };

  const currentTodos = selectedDate ? todos[selectedDate] || [] : [];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '15px'
          }}
        >
          ← 뒤로가기
        </button>
        <h2 style={{ display: 'inline', margin: 0 }}>
          {subtask.title} 할 일 관리
        </h2>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <p><strong>기간:</strong> {subtask.startDate} ~ {subtask.endDate}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* 왼쪽: 주차 및 날짜 선택 */}
        <div>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ marginBottom: '15px' }}>주차 선택</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {availableWeeks.map(week => (
                <button
                  key={week}
                  onClick={() => handleWeekSelect(week)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: selectedWeek === week ? '#007bff' : '#e9ecef',
                    color: selectedWeek === week ? 'white' : '#495057',
                    border: selectedWeek === week ? 'none' : '1px solid #ced4da',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.2s'
                  }}
                >
                  {week}
                </button>
              ))}
            </div>
          </div>

          {selectedWeek && (
            <div>
              <h3 style={{ marginBottom: '15px' }}>{selectedWeek} 날짜 선택</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {getWeekDays().map(day => (
                  <button
                    key={day}
                    onClick={() => isDateActive(day) ? handleDateSelect(day) : null}
                    disabled={!isDateActive(day)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: selectedDate === day ? '#28a745' : 
                                     isDateActive(day) ? '#e9ecef' : '#f8f9fa',
                      color: selectedDate === day ? 'white' : 
                             isDateActive(day) ? '#495057' : '#6c757d',
                      border: selectedDate === day ? 'none' : '1px solid #ced4da',
                      borderRadius: '5px',
                      cursor: isDateActive(day) ? 'pointer' : 'not-allowed',
                      fontSize: '16px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {day}일
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 할 일 관리 */}
        <div>
          {selectedDate ? (
            <>
              <h3 style={{ marginBottom: '15px' }}>
                {selectedWeek} {selectedDate}일 할 일
              </h3>
              
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="새로운 할 일을 입력하세요"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '5px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button 
                  onClick={addTodo}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  추가
                </button>
              </div>

              <div style={{ 
                maxHeight: '400px', 
                overflowY: 'auto',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                background: 'white'
              }}>
                {currentTodos.length === 0 ? (
                  <p style={{ color: '#6c757d', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
                    등록된 할 일이 없습니다.
                  </p>
                ) : (
                  currentTodos.map(todo => (
                    <div 
                      key={todo.id} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        margin: '8px 0',
                        background: todo.completed ? '#f8f9fa' : 'white',
                        border: '1px solid #dee2e6',
                        borderRadius: '5px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(selectedDate.toString(), todo.id)}
                        style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                      />
                      <span 
                        style={{
                          flex: 1,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? '#6c757d' : '#212529',
                          fontSize: '16px'
                        }}
                      >
                        {todo.text}
                      </span>
                      <button 
                        onClick={() => deleteTodo(selectedDate.toString(), todo.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6c757d',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '2px dashed #dee2e6'
            }}>
              <h4 style={{ marginBottom: '10px' }}>날짜를 선택해주세요</h4>
              <p>왼쪽에서 주차와 날짜를 선택하면<br/>해당 날짜의 할 일을 관리할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoManager;