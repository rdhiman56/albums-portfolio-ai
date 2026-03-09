import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ profile }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#gallery', label: 'Gallery' },
    { href: '/#achievements', label: 'Achievements' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink/90 backdrop-blur-xl border-b border-border' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="font-display text-lg md:text-xl font-medium text-white hover:text-gold transition-colors">
          {profile?.name?.split(' ')[0] || 'Portfolio'}<span className="text-gold">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-gold hover:text-gold-light transition-colors">
                <Settings size={14} /> Admin
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-muted hover:text-soft transition-colors">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors">
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-soft" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-xs tracking-widest uppercase text-soft hover:text-gold transition-colors">
              {l.label}
            </a>
          ))}
          {isAdmin ? (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className="font-mono text-xs tracking-widest uppercase text-gold">Admin</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="font-mono text-xs tracking-widest uppercase text-muted text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="font-mono text-xs tracking-widest uppercase text-muted">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
