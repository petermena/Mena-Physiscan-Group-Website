import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import EmailTool from './components/EmailTool';
import ReservationTool from './components/ReservationTool';
import TaskBoard from './components/TaskBoard';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <Chat />;
      case 'email':
        return <EmailTool />;
      case 'reservations':
        return <ReservationTool />;
      case 'tasks':
        return <TaskBoard />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="top-bar-title">
            {activeView === 'chat' && 'Chat with Aria'}
            {activeView === 'email' && 'Email Assistant'}
            {activeView === 'reservations' && 'Dinner Reservations'}
            {activeView === 'tasks' && 'Task Manager'}
          </div>
        </header>
        <div className="view-container">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
