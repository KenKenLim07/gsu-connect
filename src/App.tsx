import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import MainLayout from './layouts/MainLayout';
import { handleRedirect } from './utils/redirect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Home = lazy(() => import('./pages/Home'));

// Loading component with fade transition
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] animate-fade-in">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    handleRedirect();
    // Set initial load to false after first render
    setIsInitialLoad(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <Suspense fallback={isInitialLoad ? <PageLoader /> : null}>
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
        </Suspense>
      <Toaster />
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
