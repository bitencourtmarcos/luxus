import { useState } from 'react';
import { X, Check, MessageSquareX, Trash2, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PostDetail = ({ post, userRole, onClose, onUpdateStatus, onDelete }) => {
  const [feedback, setFeedback] = useState(post.feedback || '');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = () => {
    onUpdateStatus(post.id, 'approved', '');
  };

  const handleRejectClick = () => {
    setShowRejectInput(true);
  };

  const handleConfirmReject = () => {
    if (!feedback.trim()) return;
    onUpdateStatus(post.id, 'rejected', feedback);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div>
            <h3>{post.title}</h3>
            <span className="subtitle" style={{ fontSize: '0.85rem' }}>
              Agendado para: {format(new Date(post.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <span className={`status-badge ${post.status}`}>
              {post.status === 'pending' && 'Pendente'}
              {post.status === 'approved' && 'Aprovado'}
              {post.status === 'rejected' && 'Reprovado'}
            </span>
            <span className="status-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border-color)' }}>
              {post.type === 'image' ? 'Card (Imagem)' : 'Vídeo'}
            </span>
          </div>

          <div className="media-link-container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.2)', 
            padding: '40px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px dashed var(--border-color)',
            gap: '16px'
          }}>
            {post.type === 'image' ? (
              <ImageIcon size={64} style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Video size={64} style={{ color: 'var(--text-secondary)' }} />
            )}
            <a 
              href={post.mediaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
            >
              <ExternalLink size={18} />
              Abrir no Google Drive
            </a>
          </div>

          <div className="form-group">
            <label style={{ color: 'var(--text-secondary)' }}>Legenda</label>
            <div style={{ 
              background: 'rgba(0,0,0,0.2)', 
              padding: '16px', 
              borderRadius: 'var(--radius-md)',
              whiteSpace: 'pre-wrap',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {post.caption || <em>Sem legenda</em>}
            </div>
          </div>

          {post.feedback && post.status === 'rejected' && (
            <div className="form-group" style={{ marginTop: '20px', borderLeft: '4px solid var(--status-rejected)', paddingLeft: '16px' }}>
              <label style={{ color: 'var(--status-rejected)' }}>Feedback de Reprovação</label>
              <p>{post.feedback}</p>
            </div>
          )}

          {userRole === 'client' && post.status === 'pending' && (
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginTop: '20px'
            }}>
              <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>Decisão de Aprovação</h4>
              {!showRejectInput ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn btn-approve" 
                    style={{ flex: 1, padding: '12px' }}
                    onClick={handleApprove}
                  >
                    <Check size={18} /> Aprovado
                  </button>
                  <button 
                    className="btn btn-reject" 
                    style={{ flex: 1, padding: '12px' }}
                    onClick={handleRejectClick}
                  >
                    <X size={18} /> Reprovado
                  </button>
                </div>
              ) : (
                <div className="form-group animate-fade-in">
                  <label>Motivo da Reprovação:</label>
                  <textarea 
                    className="form-control" 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="3"
                    placeholder="Adicione o motivo de não ser aprovado..."
                    autoFocus
                  ></textarea>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                    <button className="btn btn-secondary" onClick={() => setShowRejectInput(false)}>Voltar</button>
                    <button className="btn btn-reject" disabled={!feedback.trim()} onClick={handleConfirmReject}>
                      <MessageSquareX size={18} /> Confirmar Reprovação
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {userRole === 'client' && post.status !== 'pending' && (
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>
                Você marcou este post como <strong style={{ color: post.status === 'approved' ? 'var(--status-approved)' : 'var(--status-rejected)' }}>{post.status === 'approved' ? 'Aprovado' : 'Reprovado'}</strong>.
              </p>
              <button 
                className="btn btn-secondary" 
                onClick={() => onUpdateStatus(post.id, 'pending', '')}
              >
                Desfazer Decisão
              </button>
            </div>
          )}
        </div>
        
        <div className="modal-footer" style={{ justifyContent: userRole === 'agency' ? 'space-between' : 'flex-end' }}>
          {userRole === 'agency' ? (
            <>
              <button className="btn" style={{ color: 'var(--status-rejected)' }} onClick={() => onDelete(post.id)}>
                <Trash2 size={18} /> Excluir Post
              </button>
              <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
