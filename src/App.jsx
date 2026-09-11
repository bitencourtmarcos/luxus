import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import { CalendarDays, LogOut, Settings, User } from 'lucide-react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRole, setUserRole] = useState('agency'); // 'agency' or 'client'

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('luxus-posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
  }, []);

  // Save to local storage when posts change
  useEffect(() => {
    localStorage.setItem('luxus-posts', JSON.stringify(posts));
  }, [posts]);

  const handleDateClick = (date) => {
    if (userRole === 'agency') {
      setSelectedDate(date);
      setIsFormOpen(true);
    }
  };

  const handlePostClick = (post) => {
    setViewingPost(post);
  };

  const handleAddPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: Date.now().toString(),
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString()
    };
    setPosts([...posts, postWithId]);
    setIsFormOpen(false);
  };

  const handleUpdateStatus = (id, newStatus, feedback = '') => {
    const updatedPosts = posts.map(p => p.id === id ? { ...p, status: newStatus, feedback } : p);
    setPosts(updatedPosts);
    setViewingPost(updatedPosts.find(p => p.id === id));
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    setViewingPost(null);
  };

  return (
    <div className="app-container">
      <nav className="navbar glass-panel">
        <div className="nav-brand">
          <CalendarDays className="brand-icon" size={28} />
          <h1>Luxus Content <span>Manager</span></h1>
        </div>
        
        <div className="nav-controls">
          <div className="role-toggle-container" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '12px', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Ver como:</span>
            <div className="role-toggle">
              <button 
                className={`toggle-btn ${userRole === 'agency' ? 'active' : ''}`}
                onClick={() => setUserRole('agency')}
              >
                Agência
              </button>
              <button 
                className={`toggle-btn ${userRole === 'client' ? 'active' : ''}`}
                onClick={() => setUserRole('client')}
              >
                Cliente
              </button>
            </div>
          </div>
          <div className="user-avatar">
            <User size={20} />
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="page-header animate-fade-in">
          <h2>Calendário de Postagens</h2>
          <p className="subtitle">
            {userRole === 'agency' 
              ? 'Clique em um dia para agendar um novo card ou vídeo.' 
              : 'Clique nos posts agendados para aprovar ou reprovar.'}
          </p>
        </header>

        <section className="calendar-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Calendar 
            posts={posts} 
            onDateClick={handleDateClick} 
            onPostClick={handlePostClick}
            userRole={userRole}
          />
        </section>
      </main>

      {isFormOpen && (
        <PostForm 
          date={selectedDate} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleAddPost} 
        />
      )}

      {viewingPost && (
        <PostDetail 
          post={viewingPost} 
          userRole={userRole}
          onClose={() => setViewingPost(null)} 
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
}

export default App;
