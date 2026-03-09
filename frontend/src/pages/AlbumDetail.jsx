import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Image } from 'lucide-react';
import { albumsAPI } from '../utils/api';
import Lightbox from '../components/Lightbox';
import toast from 'react-hot-toast';

export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const stagger = { show: { transition: { staggerChildren: 0.08 } } };

  useEffect(() => {
    albumsAPI.getOne(id)
      .then(r => setAlbum(r.data))
      .catch(() => { toast.error('Album not found'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!album) return null;

  const typeColors = { Trip: 'bg-blue-500/10 text-blue-400 border-blue-500/20', Achievement: 'bg-gold/10 text-gold border-gold/20', Event: 'bg-purple-500/10 text-purple-400 border-purple-500/20', Other: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {album.coverImage ? (
          <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        {/* Back button */}
        <Link to="/#gallery" className="absolute top-6 left-6 md:left-12 flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-white/70 hover:text-gold transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Album info */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block font-mono text-xs tracking-widest uppercase px-3 py-1 border rounded-full mb-3 ${typeColors[album.type] || typeColors.Other}`}>
              {album.type}
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-white mb-3">{album.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-soft">
              {album.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold" />{album.location}</span>}
              {album.date && <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gold" />{album.date}</span>}
              <span className="flex items-center gap-1.5"><Image size={14} className="text-gold" />{album.photos?.length || 0} photos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {album.description && (
        <div className="px-6 md:px-16 py-8 max-w-7xl mx-auto border-b border-border">
          <p className="font-body text-soft text-lg leading-relaxed max-w-2xl">{album.description}</p>
        </div>
      )}

      {/* Photos Grid */}
      <div className="px-6 md:px-16 py-12 max-w-7xl mx-auto">
        {album.photos?.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border">
            <p className="font-mono text-xs text-muted tracking-widest uppercase">No photos in this album yet</p>
          </div>
        ) : (
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            initial="hidden" animate="show" variants={stagger}
          >
            {album.photos?.map((photo, idx) => (
              <motion.div
                key={photo._id}
                variants={fadeUp}
                className="photo-card relative overflow-hidden border border-border break-inside-avoid cursor-pointer group"
                onClick={() => setLightbox({ open: true, index: idx })}
              >
                <img src={photo.imageUrl} alt={photo.title} className="w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <div>
                    <p className="font-display text-white text-lg">{photo.title}</p>
                    {photo.description && <p className="font-body text-sm text-soft/80 italic">{photo.description}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <Lightbox
          photos={album.photos || []}
          index={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
          onPrev={() => setLightbox(l => ({ ...l, index: Math.max(0, l.index - 1) }))}
          onNext={() => setLightbox(l => ({ ...l, index: Math.min((album.photos?.length || 1) - 1, l.index + 1) }))}
        />
      )}
    </div>
  );
}
