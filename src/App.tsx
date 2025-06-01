import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './guards/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { handleRedirect } from './utils/redirect';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const NewsFeed = lazy(() => import('./pages/NewsFeed'));
const Forum = lazy(() => import('./pages/Forum'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <AuthProvider>
      <Router basename="/gsu-connect">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/news"
                element={
                  <ProtectedRoute>
                    <NewsFeed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum"
                element={
                  <ProtectedRoute>
                    <Forum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
