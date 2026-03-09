import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, []);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] lightbox-overlay bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10" onClick={onClose}>
          <X size={28} />
        </button>

        {/* Prev */}
        {index > 0 && (
          <button
            className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft size={36} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={photo._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={photo.imageUrl} alt={photo.title} className="max-h-[75vh] max-w-full object-contain shadow-2xl" />
          <div className="text-center">
            <p className="font-display text-xl text-white">{photo.title}</p>
            {photo.description && <p className="font-body text-sm text-soft mt-1">{photo.description}</p>}
            <p className="font-mono text-xs text-muted mt-1 tracking-widest uppercase">{photo.category}</p>
          </div>
        </motion.div>

        {/* Next */}
        {index < photos.length - 1 && (
          <button
            className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors z-10 p-2"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight size={36} />
          </button>
        )}

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-muted tracking-widest">
          {index + 1} / {photos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
