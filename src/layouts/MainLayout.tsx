import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

export default function MainLayout() {
  const location = useLocation();
  const hasLoaded = useRef(false);
  if (!hasLoaded.current) hasLoaded.current = true;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {hasLoaded.current ? (
        <main className="flex-1 px-4 py-7 max-w-7xl mx-auto w-full mt-8">
          <Outlet />
        </main>
      ) : (
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 px-4 py-7 max-w-7xl mx-auto w-full mt-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      )}
    </div>
  );
} 