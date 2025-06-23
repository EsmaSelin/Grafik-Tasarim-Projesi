import React, { useState } from 'react';
import './NotesPage.css';

interface FilmNote {
  id: string;
  filmTitle: string;
  filmId: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  tags: string[];
}

interface NotesPageProps {
  notes: FilmNote[];
  onAddNote: (note: Omit<FilmNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, note: Partial<FilmNote>) => void;
  onDeleteNote: (id: string) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('Tümü');
  const [sortBy, setSortBy] = useState<'updatedAt'|'createdAt'|'filmTitle'>('updatedAt');

  const [newNote, setNewNote] = useState({
    filmTitle: '',
    filmId: 0,
    note: '',
    rating: 5,
    tags: [] as string[]
  });
  const [editNote, setEditNote] = useState<FilmNote | null>(null);

  const allTags = ['Tümü', ...Array.from(new Set(notes.flatMap(n => n.tags)))];
  const commonTags = ['İzlendi','İzlenecek','Favoriler','Tekrar İzle','Tavsiye','Klasik','Yeni Keşif'];

  const filteredNotes = notes
    .filter(n => {
      const m1 = n.filmTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const m2 = n.note.toLowerCase().includes(searchQuery.toLowerCase());
      const mTag = filterTag === 'Tümü' || n.tags.includes(filterTag);
      return (m1||m2) && mTag;
    })
    .sort((a,b) => {
      if (sortBy==='filmTitle') return a.filmTitle.localeCompare(b.filmTitle);
      return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
    });

  const handleAddNoteSubmit = () => {
    if (!newNote.filmTitle.trim()||!newNote.note.trim()) return;
    onAddNote({ filmTitle:newNote.filmTitle, filmId:newNote.filmId, note:newNote.note, rating:newNote.rating, tags:newNote.tags });
    setNewNote({ filmTitle:'',filmId:0,note:'',rating:5,tags:[] });
    setIsAddingNote(false);
  };
  const handleUpdateNoteSubmit = () => {
    if (!editNote||!editingNoteId) return;
    onUpdateNote(editingNoteId,{
      filmTitle:editNote.filmTitle,
      note:editNote.note,
      rating:editNote.rating,
      tags:editNote.tags
    });
    setEditingNoteId(null);
    setEditNote(null);
  };
  const startEditing = (n:FilmNote) => { setEditingNoteId(n.id); setEditNote({...n}); };
  const cancelEditing=()=>{ setEditingNoteId(null); setEditNote(null); };
  const toggleTag=(tag:string)=>{
    if(editingNoteId && editNote){
      setEditNote(prev=> prev?{ ...prev,
        tags: prev.tags.includes(tag)?prev.tags.filter(t=>t!==tag):[...prev.tags,tag]
      }:null);
    } else {
      setNewNote(prev=>({
        ...prev,
        tags: prev.tags.includes(tag)?prev.tags.filter(t=>t!==tag):[...prev.tags,tag]
      }));
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-container">
        <div className="notes-header">
          <h1>Film Notlarım</h1>
          <p>İzlediğin filmler hakkındaki düşüncelerini kaydet ve organize et</p>
        </div>

        <div className="notes-controls">
          <div className="ctrl-group">
            <input
              type="text"
              placeholder="Not veya film ara..."
              value={searchQuery}
              onChange={e=>setSearchQuery(e.target.value)}
            />
            <select value={filterTag} onChange={e=>setFilterTag(e.target.value)}>
              {allTags.map(t=> <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)}>
              <option value="updatedAt">Son Güncelleme</option>
              <option value="createdAt">Oluşturma Tarihi</option>
              <option value="filmTitle">Film Adı</option>
            </select>
          </div>
          <button onClick={()=>setIsAddingNote(true)}>Yeni Not</button>
        </div>

        {isAddingNote && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Yeni Not Ekle</h3>
                <button onClick={()=>setIsAddingNote(false)}>×</button>
              </div>
              <label>Film Adı</label>
              <input
                type="text"
                value={newNote.filmTitle}
                onChange={e=>setNewNote({...newNote,filmTitle:e.target.value})}
                placeholder="Film adını gir..."
              />
              <label>Not</label>
              <textarea
                rows={4}
                value={newNote.note}
                onChange={e=>setNewNote({...newNote,note:e.target.value})}
                placeholder="Düşüncelerini yaz..."
              />
              <label>Puan</label>
              <div className="star-rating">
                {[1,2,3,4,5].map(s=>(
                  <button
                    key={s}
                    onClick={()=>setNewNote({...newNote,rating:s})}
                    className={s<=newNote.rating?'filled':'empty'}
                  >★</button>
                ))}
              </div>
              <label>Etiketler</label>
              <div className="tag-list">
                {commonTags.map(tag=>(
                  <button
                    key={tag}
                    onClick={()=>toggleTag(tag)}
                    className={newNote.tags.includes(tag)?'active':''}
                  >{tag}</button>
                ))}
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={handleAddNoteSubmit}>Kaydet</button>
                <button className="btn-cancel" onClick={()=>setIsAddingNote(false)}>İptal</button>
              </div>
            </div>
          </div>
        )}

        <div className="notes-list">
          {filteredNotes.map((n,i)=>(
            <div key={n.id} className="note-card">
              {editingNoteId===n.id?(
                <>
                  <input
                    type="text"
                    value={editNote?.filmTitle||''}
                    onChange={e=>setEditNote(prev=>prev?{...prev,filmTitle:e.target.value}:null)}
                  />
                  <textarea
                    rows={3}
                    value={editNote?.note||''}
                    onChange={e=>setEditNote(prev=>prev?{...prev,note:e.target.value}:null)}
                  />
                  <div className="star-rating">
                    {[1,2,3,4,5].map(s=>(
                      <button
                        key={s}
                        onClick={()=>setEditNote(prev=>prev?{...prev,rating:s}:null)}
                        className={s<= (editNote?.rating||0)?'filled':'empty'}
                      >★</button>
                    ))}
                  </div>
                  <div className="tag-list">
                    {commonTags.map(tag=>(
                      <button
                        key={tag}
                        onClick={()=>toggleTag(tag)}
                        className={editNote?.tags.includes(tag)?'active':''}
                      >{tag}</button>
                    ))}
                  </div>
                  <div className="modal-actions">
                    <button className="btn-save" onClick={handleUpdateNoteSubmit}>Güncelle</button>
                    <button className="btn-cancel" onClick={cancelEditing}>İptal</button>
                  </div>
                </>
              ):(
                <>
                  <div className="note-header">
                    <div className="note-title">{n.filmTitle}</div>
                    <div className="star-rating">
                      {[1,2,3,4,5].map(s=>(
                        <span key={s} className={s<=n.rating!?'filled':'empty'}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="note-content">{n.note}</div>
                  <div className="note-tags">
                    {n.tags.map(t=><span key={t}>{t}</span>)}
                  </div>
                  <div className="note-footer">
                    <small>Oluş: {new Date(n.createdAt).toLocaleDateString()}</small>
                    <div>
                      <button onClick={()=>startEditing(n)}>✏️</button>
                      <button onClick={()=>onDeleteNote(n.id)}>🗑️</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {notes.length>0 && (
          <div className="stats-grid">
            <div className="stat-card">
              <h4>{notes.length}</h4>
              <p>Toplam Not</p>
            </div>
            <div className="stat-card">
              <h4>{new Set(notes.map(n=>n.filmTitle)).size}</h4>
              <p>Farklı Film</p>
            </div>
            <div className="stat-card">
              <h4>{notes.filter(n=>n.rating!==undefined && n.rating>=4).length}</h4>
              <p>Yüksek Puanlı</p>
            </div>
            <div className="stat-card">
              <h4>{allTags.length-1}</h4>
              <p>Farklı Etiket</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
