import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import MainLayout from './layouts/MainLayout';
import { handleRedirect } from './utils/redirect';

// Lazy load pages with prefetch
const lazyLoad = (importFunc: () => Promise<any>) => {
  const Component = lazy(importFunc);
  // Prefetch the component
  importFunc();
  return Component;
};

const Login = lazyLoad(() => import('./pages/Login'));
const NewsPage = lazyLoad(() => import('./pages/NewsPage'));
const AboutPage = lazyLoad(() => import('./pages/AboutPage'));
const Home = lazyLoad(() => import('./pages/Home'));

// Loading component with fade transition
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] animate-fade-in">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Route wrapper with Suspense
const SuspenseRoute = ({ element: Element }: { element: React.LazyExoticComponent<any> }) => (
  <Suspense fallback={<PageLoader />}>
    <Element />
  </Suspense>
);

function App() {
  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<SuspenseRoute element={Home} />} />
          <Route path="/news" element={<SuspenseRoute element={NewsPage} />} />
          <Route path="/about" element={<SuspenseRoute element={AboutPage} />} />
          <Route path="/login" element={<SuspenseRoute element={Login} />} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
