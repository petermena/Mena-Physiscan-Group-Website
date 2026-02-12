import React, { useState, useEffect } from 'react';
import './TaskBoard.css';

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.tasks);
    } catch {
      // Server not running
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, category, dueDate: dueDate || null }),
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('general');
      setDueDate('');
      setShowForm(false);
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const toggleTask = async (task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const priorityColors = {
    high: 'var(--danger)',
    medium: 'var(--warning)',
    low: 'var(--success)',
  };

  return (
    <div className="task-board">
      <div className="task-board-header">
        <div className="task-stats">
          <span className="stat">{activeTasks.length} active</span>
          <span className="stat-divider">/</span>
          <span className="stat">{completedTasks.length} done</span>
        </div>
        <button className="add-task-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <div className="task-form">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="task-title-input"
            autoFocus
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details (optional)"
            rows={2}
          />
          <div className="task-form-row">
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="general">General</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <button className="action-button" onClick={addTask} disabled={!title.trim()}>
            Add Task
          </button>
        </div>
      )}

      <div className="task-list">
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="tasks-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <p>No tasks yet. Add one to get started!</p>
          </div>
        )}

        {activeTasks.map(task => (
          <div key={task.id} className="task-item">
            <button className="task-check" onClick={() => toggleTask(task)}>
              <div className="check-circle" />
            </button>
            <div className="task-info">
              <div className="task-title">{task.title}</div>
              {task.description && <div className="task-desc">{task.description}</div>}
              <div className="task-meta">
                <span
                  className="task-priority"
                  style={{ color: priorityColors[task.priority] }}
                >
                  {task.priority}
                </span>
                <span className="task-category">{task.category}</span>
                {task.dueDate && <span className="task-due">Due: {task.dueDate}</span>}
              </div>
            </div>
            <button className="task-delete" onClick={() => deleteTask(task.id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="task-section-label">Completed</div>
            {completedTasks.map(task => (
              <div key={task.id} className="task-item completed">
                <button className="task-check done" onClick={() => toggleTask(task)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </button>
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                </div>
                <button className="task-delete" onClick={() => deleteTask(task.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default TaskBoard;
