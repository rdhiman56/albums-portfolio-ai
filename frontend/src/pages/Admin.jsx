import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileAPI, photosAPI, achievementsAPI, albumsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, Plus, Trash2, Edit3, Star, StarOff, User, Image as ImageIcon, Trophy, X, Save, FolderOpen, MapPin, Calendar } from 'lucide-react';

const ACH_CATEGORIES = ['Award', 'Certification', 'Publication', 'Project', 'Education', 'Other'];
const ACH_ICONS = ['🏆', '🥇', '🎓', '📄', '🚀', '📚', '⭐', '🎯', '💡', '🌟', '🎖️', '🏅'];
const ALBUM_TYPES = ['Trip', 'Achievement', 'Event', 'Other'];

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({});
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showAchForm, setShowAchForm] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [achForm, setAchForm] = useState({ title: '', description: '', year: new Date().getFullYear().toString(), icon: '🏆', category: 'Award', link: '', album: '', featured: false });
  const [albumForm, setAlbumForm] = useState({ title: '', description: '', type: 'Trip', location: '', date: '', featured: false });
  const [albumCover, setAlbumCover] = useState(null);
  const photoInputRef = useRef();
  const avatarInputRef = useRef();
  const albumCoverRef = useRef();

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/login');
  }, [isAdmin, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      profileAPI.get().then(r => setProfile(r.data));
      albumsAPI.getAll().then(r => setAlbums(r.data));
      photosAPI.getAll().then(r => setPhotos(r.data));
      achievementsAPI.getAll().then(r => setAchievements(r.data));
    }
  }, [isAdmin]);

  // ── PROFILE ──
  const saveProfile = async () => {
    setSaving(true);
    try { const r = await profileAPI.update(profile); setProfile(r.data); toast.success('Profile saved!'); }
    catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    try { const r = await profileAPI.uploadAvatar(fd); setProfile(r.data); toast.success('Avatar updated!'); }
    catch { toast.error('Upload failed'); }
  };

  // ── ALBUMS ──
  const openAlbumForm = (album = null) => {
    setEditingAlbum(album);
    setAlbumForm(album ? { title: album.title, description: album.description, type: album.type, location: album.location, date: album.date, featured: album.featured } : { title: '', description: '', type: 'Trip', location: '', date: '', featured: false });
    setAlbumCover(null);
    setShowAlbumForm(true);
  };

  const saveAlbum = async () => {
    if (!albumForm.title) return toast.error('Title required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(albumForm).forEach(([k, v]) => fd.append(k, v));
      if (albumCover) fd.append('cover', albumCover);
      if (editingAlbum) {
        const r = await albumsAPI.update(editingAlbum._id, fd);
        setAlbums(a => a.map(x => x._id === editingAlbum._id ? r.data : x));
        toast.success('Album updated!');
      } else {
        const r = await albumsAPI.create(fd);
        setAlbums(a => [{ ...r.data, photoCount: 0 }, ...a]);
        toast.success('Album created!');
      }
      setShowAlbumForm(false);
    } catch { toast.error('Failed to save album'); } finally { setSaving(false); }
  };

  const deleteAlbum = async (id) => {
    if (!confirm('Delete this album and ALL its photos?')) return;
    try { await albumsAPI.delete(id); setAlbums(a => a.filter(x => x._id !== id)); toast.success('Album deleted'); }
    catch { toast.error('Delete failed'); }
  };

  // ── PHOTOS ──
  const uploadPhotos = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploadingPhoto(true);
    for (const file of files) {
      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const fd = new FormData();
      fd.append('image', file); fd.append('title', title);
      if (selectedAlbum) fd.append('album', selectedAlbum);
      try {
        const r = await photosAPI.upload(fd);
        setPhotos(p => [r.data, ...p]);
        if (selectedAlbum) setAlbums(a => a.map(x => x._id === selectedAlbum ? { ...x, photoCount: (x.photoCount || 0) + 1 } : x));
      } catch { toast.error(`Failed: ${file.name}`); }
    }
    setUploadingPhoto(false); toast.success('Photos uploaded!'); e.target.value = '';
  };

  const deletePhoto = async (id) => {
    if (!confirm('Delete this photo?')) return;
    try {
      const photo = photos.find(p => p._id === id);
      await photosAPI.delete(id); setPhotos(p => p.filter(x => x._id !== id));
      if (photo?.album) setAlbums(a => a.map(x => x._id === (photo.album?._id || photo.album) ? { ...x, photoCount: Math.max(0, (x.photoCount || 1) - 1) } : x));
      toast.success('Photo deleted');
    } catch { toast.error('Delete failed'); }
  };

  const toggleFeatured = async (photo) => {
    try { const r = await photosAPI.update(photo._id, { featured: !photo.featured }); setPhotos(p => p.map(x => x._id === photo._id ? r.data : x)); }
    catch { toast.error('Update failed'); }
  };

  // ── ACHIEVEMENTS ──
  const openAchForm = (ach = null) => {
    setEditingAch(ach);
    setAchForm(ach ? { ...ach, album: ach.album || '' } : { title: '', description: '', year: new Date().getFullYear().toString(), icon: '🏆', category: 'Award', link: '', album: '', featured: false });
    setShowAchForm(true);
  };

  const saveAchievement = async () => {
    setSaving(true);
    try {
      const data = { ...achForm, album: achForm.album || null };
      if (editingAch) {
        const r = await achievementsAPI.update(editingAch._id, data);
        setAchievements(a => a.map(x => x._id === editingAch._id ? r.data : x));
        toast.success('Achievement updated!');
      } else {
        const r = await achievementsAPI.create(data);
        setAchievements(a => [r.data, ...a]);
        toast.success('Achievement added!');
      }
      setShowAchForm(false);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const deleteAch = async (id) => {
    if (!confirm('Delete?')) return;
    try { await achievementsAPI.delete(id); setAchievements(a => a.filter(x => x._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  if (authLoading) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={15}/> },
    { id: 'albums', label: `Albums (${albums.length})`, icon: <FolderOpen size={15}/> },
    { id: 'photos', label: `Photos (${photos.length})`, icon: <ImageIcon size={15}/> },
    { id: 'achievements', label: `Achievements (${achievements.length})`, icon: <Trophy size={15}/> }
  ];

  const displayedPhotos = selectedAlbum ? photos.filter(p => (p.album?._id || p.album) === selectedAlbum) : photos;

  return (
    <div className="min-h-screen pt-20 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-xs text-gold tracking-widest uppercase mb-2">Admin Panel</p>
        <h1 className="font-display text-4xl text-white">Portfolio Manager</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-10 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-5 py-3 border-b-2 transition-all -mb-px whitespace-nowrap ${tab === t.id ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-soft'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="md:col-span-2 flex items-center gap-6">
            <div className="w-20 h-20 border border-border bg-card overflow-hidden">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><User size={28} className="text-muted"/></div>}
            </div>
            <div>
              <button onClick={() => avatarInputRef.current?.click()} className="btn-outline flex items-center gap-2 text-xs"><Upload size={13}/> Change Avatar</button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar}/>
            </div>
          </div>
          {[
            { label: 'Full Name', field: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Tagline', field: 'tagline', type: 'text', placeholder: 'Creative Professional' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Location', field: 'location', type: 'text', placeholder: 'City, Country' },
            { label: 'Website', field: 'website', type: 'url', placeholder: 'https://yoursite.com' },
            { label: 'Resume URL', field: 'resumeUrl', type: 'url', placeholder: 'https://drive.google.com/...' },
            { label: 'GitHub', field: 'github', type: 'url', placeholder: 'https://github.com/username' },
            { label: 'LinkedIn', field: 'linkedin', type: 'url', placeholder: 'https://linkedin.com/in/username' },
            { label: 'Twitter', field: 'twitter', type: 'url', placeholder: 'https://twitter.com/username' },
            { label: 'Instagram', field: 'instagram', type: 'url', placeholder: 'https://instagram.com/username' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="label">{label}</label>
              <input type={type} className="input" placeholder={placeholder} value={profile[field] || ''} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}/>
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="label">Bio</label>
            <textarea className="input min-h-[120px] resize-y" placeholder="Tell your story..." value={profile.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}/>
          </div>
          <div className="md:col-span-2">
            <button onClick={saveProfile} disabled={saving} className="btn-gold flex items-center gap-2"><Save size={15}/> {saving ? 'Saving...' : 'Save Profile'}</button>
          </div>
        </div>
      )}

      {/* ── ALBUMS TAB ── */}
      {tab === 'albums' && (
        <div>
          <button onClick={() => openAlbumForm()} className="btn-gold flex items-center gap-2 mb-8"><Plus size={15}/> Create Album</button>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map(album => (
              <div key={album._id} className="border border-border bg-card overflow-hidden group">
                <div className="aspect-[16/9] bg-surface overflow-hidden relative">
                  {album.coverImage ? <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-border"/></div>}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => openAlbumForm(album)} className="text-white hover:text-gold transition-colors"><Edit3 size={18}/></button>
                    <button onClick={() => deleteAlbum(album._id)} className="text-white hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
                  </div>
                  <span className="absolute top-2 left-2 font-mono text-xs text-gold border border-gold/30 bg-ink/80 px-2 py-0.5 uppercase tracking-widest">{album.type}</span>
                  <span className="absolute bottom-2 right-2 font-mono text-xs text-white/70 bg-black/50 px-2 py-0.5 flex items-center gap-1"><ImageIcon size={10}/>{album.photoCount || 0}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-white mb-1">{album.title}</h3>
                  <div className="flex gap-3 text-xs text-muted font-mono mb-3">
                    {album.location && <span className="flex items-center gap-1"><MapPin size={10}/>{album.location}</span>}
                    {album.date && <span className="flex items-center gap-1"><Calendar size={10}/>{album.date}</span>}
                  </div>
                  <button onClick={() => { setSelectedAlbum(album._id); setTab('photos'); }} className="btn-outline text-xs flex items-center gap-1.5 w-full justify-center">
                    <Upload size={12}/> Add Photos
                  </button>
                </div>
              </div>
            ))}
            {albums.length === 0 && <p className="col-span-3 text-center py-12 font-mono text-xs text-muted tracking-widest uppercase">No albums yet. Create one above.</p>}
          </div>
        </div>
      )}

      {/* ── PHOTOS TAB ── */}
      {tab === 'photos' && (
        <div>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="label">Upload photos to album</label>
              <select className="input" value={selectedAlbum || ''} onChange={e => setSelectedAlbum(e.target.value || null)}>
                <option value="">— No Album (General) —</option>
                {albums.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
              </select>
            </div>
          </div>
          <div className="border-2 border-dashed border-border hover:border-gold transition-colors p-12 text-center mb-8 cursor-pointer relative" onClick={() => photoInputRef.current?.click()}>
            <Upload size={28} className="text-gold mx-auto mb-3"/>
            <p className="font-body text-soft mb-1">{selectedAlbum ? `Uploading to: ${albums.find(a => a._id === selectedAlbum)?.title}` : 'Click to upload photos'}</p>
            <p className="font-mono text-xs text-muted tracking-wide">PNG, JPG, WEBP up to 10MB · Multiple files supported</p>
            {uploadingPhoto && <p className="font-mono text-xs text-gold mt-3 tracking-widest uppercase animate-pulse">Uploading to Cloudinary...</p>}
            <input ref={photoInputRef} type="file" multiple accept="image/*" className="hidden" onChange={uploadPhotos}/>
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            <button onClick={() => setSelectedAlbum(null)} className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 border transition-all ${!selectedAlbum ? 'border-gold text-gold' : 'border-border text-muted hover:border-gold/50'}`}>All</button>
            {albums.map(a => (
              <button key={a._id} onClick={() => setSelectedAlbum(a._id)} className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 border transition-all ${selectedAlbum === a._id ? 'border-gold text-gold' : 'border-border text-muted hover:border-gold/50'}`}>{a.title}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedPhotos.map(photo => (
              <div key={photo._id} className="group relative border border-border bg-card overflow-hidden">
                <img src={photo.imageUrl} alt={photo.title} className="w-full aspect-square object-cover"/>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <button onClick={() => toggleFeatured(photo)} className="text-yellow-400 hover:text-yellow-300">{photo.featured ? <Star size={16} fill="currentColor"/> : <StarOff size={16}/>}</button>
                    <button onClick={() => deletePhoto(photo._id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-white/70 truncate">{photo.title}</p>
                    {photo.album && <p className="font-mono text-xs text-gold/70 truncate">{photo.album.title}</p>}
                  </div>
                </div>
                {photo.featured && <div className="absolute top-2 left-2 bg-gold text-ink font-mono text-xs px-1.5 py-0.5">★</div>}
              </div>
            ))}
          </div>
          {displayedPhotos.length === 0 && !uploadingPhoto && <p className="text-center py-12 font-mono text-xs text-muted tracking-widest uppercase">No photos yet.</p>}
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {tab === 'achievements' && (
        <div>
          <button onClick={() => openAchForm()} className="btn-gold flex items-center gap-2 mb-8"><Plus size={15}/> Add Achievement</button>
          <div className="flex flex-col gap-4">
            {achievements.map(ach => (
              <div key={ach._id} className="border border-border bg-card p-5 flex items-start gap-4">
                <span className="text-2xl mt-0.5">{ach.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-gold tracking-widest uppercase mb-1">{ach.year} · {ach.category}</p>
                      <h3 className="font-display text-lg text-white">{ach.title}</h3>
                      <p className="font-body text-sm text-soft mt-1 line-clamp-2">{ach.description}</p>
                      {ach.album && <p className="font-mono text-xs text-blue-400 mt-1 flex items-center gap-1"><ImageIcon size={11}/> Linked to album</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openAchForm(ach)} className="text-muted hover:text-gold transition-colors"><Edit3 size={15}/></button>
                      <button onClick={() => deleteAch(ach._id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 size={15}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {achievements.length === 0 && <p className="text-center py-12 font-mono text-xs text-muted tracking-widest uppercase">No achievements yet</p>}
          </div>
        </div>
      )}

      {/* ═══ ALBUM MODAL ═══ */}
      {showAlbumForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-white">{editingAlbum ? 'Edit' : 'Create'} Album</h2>
              <button onClick={() => setShowAlbumForm(false)} className="text-muted hover:text-white"><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="label">Album Title *</label>
                <input className="input" placeholder="e.g. Manali Trip 2024" value={albumForm.title} onChange={e => setAlbumForm(f => ({ ...f, title: e.target.value }))}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={albumForm.type} onChange={e => setAlbumForm(f => ({ ...f, type: e.target.value }))}>
                    {ALBUM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Date</label>
                  <input className="input" placeholder="e.g. Dec 2024" value={albumForm.date} onChange={e => setAlbumForm(f => ({ ...f, date: e.target.value }))}/>
                </div>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="e.g. Manali, Himachal Pradesh" value={albumForm.location} onChange={e => setAlbumForm(f => ({ ...f, location: e.target.value }))}/>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[80px] resize-y" placeholder="What's this album about?" value={albumForm.description} onChange={e => setAlbumForm(f => ({ ...f, description: e.target.value }))}/>
              </div>
              <div>
                <label className="label">Cover Image</label>
                <div className="flex items-center gap-4">
                  {(albumCover || editingAlbum?.coverImage) && (
                    <img src={albumCover ? URL.createObjectURL(albumCover) : editingAlbum.coverImage} alt="cover" className="w-16 h-16 object-cover border border-border"/>
                  )}
                  <button onClick={() => albumCoverRef.current?.click()} className="btn-outline flex items-center gap-2 text-xs"><Upload size={13}/> {albumCover ? 'Change' : 'Upload Cover'}</button>
                  <input ref={albumCoverRef} type="file" accept="image/*" className="hidden" onChange={e => setAlbumCover(e.target.files[0])}/>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={albumForm.featured} onChange={e => setAlbumForm(f => ({ ...f, featured: e.target.checked }))} className="accent-gold w-4 h-4"/>
                <span className="font-mono text-xs text-muted uppercase tracking-widest">Featured</span>
              </label>
              <button onClick={saveAlbum} disabled={saving} className="btn-gold flex items-center gap-2 mt-2"><Save size={15}/> {saving ? 'Saving...' : 'Save Album'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ACHIEVEMENT MODAL ═══ */}
      {showAchForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-white">{editingAch ? 'Edit' : 'Add'} Achievement</h2>
              <button onClick={() => setShowAchForm(false)} className="text-muted hover:text-white"><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Year</label>
                  <input className="input" value={achForm.year} onChange={e => setAchForm(f => ({ ...f, year: e.target.value }))}/>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={achForm.category} onChange={e => setAchForm(f => ({ ...f, category: e.target.value }))}>
                    {ACH_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ACH_ICONS.map(icon => (
                    <button key={icon} onClick={() => setAchForm(f => ({ ...f, icon }))}
                      className={`text-xl p-2 border ${achForm.icon === icon ? 'border-gold' : 'border-border'} hover:border-gold transition-colors`}>{icon}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Title</label>
                <input className="input" placeholder="Achievement title" value={achForm.title} onChange={e => setAchForm(f => ({ ...f, title: e.target.value }))}/>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[80px] resize-y" value={achForm.description} onChange={e => setAchForm(f => ({ ...f, description: e.target.value }))}/>
              </div>
              <div>
                <label className="label">Link to Album (optional)</label>
                <select className="input" value={achForm.album} onChange={e => setAchForm(f => ({ ...f, album: e.target.value }))}>
                  <option value="">— No album —</option>
                  {albums.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">External Link (optional)</label>
                <input className="input" placeholder="https://..." value={achForm.link} onChange={e => setAchForm(f => ({ ...f, link: e.target.value }))}/>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={achForm.featured} onChange={e => setAchForm(f => ({ ...f, featured: e.target.checked }))} className="accent-gold w-4 h-4"/>
                <span className="font-mono text-xs text-muted uppercase tracking-widest">Featured</span>
              </label>
              <button onClick={saveAchievement} disabled={saving} className="btn-gold flex items-center gap-2 mt-2"><Save size={15}/> {saving ? 'Saving...' : 'Save Achievement'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
