import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import { CalendarDays, LogOut, Settings, User } from 'lucide-react';
import { supabase } from './supabase';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRole, setUserRole] = useState('agency'); // 'agency' or 'client'

  // Load from Supabase on mount and set up realtime subscription
  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          fetchPosts(); // Refresh posts when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      // Map DB snake_case to React camelCase
      const formattedPosts = data.map(post => ({
        ...post,
        mediaUrl: post.media_url,
        createdAt: post.created_at
      }));
      setPosts(formattedPosts);
    }
  };

  const handleDateClick = (date) => {
    if (userRole === 'agency') {
      setSelectedDate(date);
      setIsFormOpen(true);
    }
  };

  const handlePostClick = (post) => {
    setViewingPost(post);
  };

  const handleAddPost = async (newPost) => {
    const postData = {
      title: newPost.title,
      type: newPost.type,
      caption: newPost.caption,
      media_url: newPost.mediaUrl, // using snake_case for DB
      date: newPost.date,
      status: 'pending',
      feedback: ''
    };

    // Optimistic update
    const tempId = Date.now().toString();
    setPosts([...posts, { ...postData, id: tempId, mediaUrl: postData.media_url }]);
    setIsFormOpen(false);

    const { error } = await supabase
      .from('posts')
      .insert([postData]);

    if (error) console.error('Error adding post:', error);
  };

  const handleUpdateStatus = async (id, newStatus, feedback = '') => {
    // Optimistic update
    const updatedPosts = posts.map(p => p.id === id ? { ...p, status: newStatus, feedback } : p);
    setPosts(updatedPosts);
    setViewingPost(updatedPosts.find(p => p.id === id));

    const { error } = await supabase
      .from('posts')
      .update({ status: newStatus, feedback })
      .eq('id', id);

    if (error) console.error('Error updating status:', error);
  };

  const handleDeletePost = async (id) => {
    // Optimistic update
    setPosts(posts.filter(p => p.id !== id));
    setViewingPost(null);

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting post:', error);
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
