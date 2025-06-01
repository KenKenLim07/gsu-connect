import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

export default function MainLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-1 px-4 py-6 container mx-auto w-full"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
} 