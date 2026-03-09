import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { profileAPI } from './utils/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AlbumDetail from './pages/AlbumDetail';

function AppContent() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { profileAPI.get().then(r => setProfile(r.data)).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-ink text-white">
      <Navbar profile={profile} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1c1c1c', color: '#e8e8e8', border: '1px solid #2a2a2a', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#c8a96e', secondary: '#0d0d0d' } }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
