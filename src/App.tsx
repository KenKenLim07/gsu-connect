import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import MainLayout from './layouts/MainLayout';
import { handleRedirect } from './utils/redirect';

// Direct imports for better mobile performance
import Login from './pages/Login';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';
import Home from './pages/Home';

function App() {
  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
