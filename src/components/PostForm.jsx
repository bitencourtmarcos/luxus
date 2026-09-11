import { useState } from 'react';
import { X, Image as ImageIcon, Video, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PostForm = ({ date, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image'); // image or video
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !mediaUrl) return;
    
    onSubmit({
      title,
      type,
      caption,
      mediaUrl,
      date: date.toISOString()
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <div className="modal-header">
          <h3>Agendar Post - {format(date, "dd 'de' MMMM", { locale: ptBR })}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Título (Uso Interno)</label>
              <input 
                type="text" 
                className="form-control" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Campanha de Dia das Mães"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Postagem</label>
              <select 
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="image">Imagem (Card)</option>
                <option value="video">Vídeo (Reels/Feed)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Link do Google Drive</label>
              <input 
                type="url" 
                className="form-control" 
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                required
              />
            </div>

            <div className="form-group">
              <label>Legenda (Caption)</label>
              <textarea 
                className="form-control" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows="4"
                placeholder="Escreva a legenda que irá acompanhar o post..."
              ></textarea>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title || !mediaUrl}>
              <Upload size={18} />
              Agendar Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
