import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants as constants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
} as const;

// Separate components for better organization
const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(-1)}
      className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      <span className="text-sm">Back</span>
    </motion.button>
  );
};

const AboutContent = () => (
  <motion.div 
    variants={CONTAINER_VARIANTS}
    initial="hidden"
    animate="visible"
    className="space-y-3 text-gray-600"
  >
    <motion.p variants={ITEM_VARIANTS} className="text-sm leading-relaxed">
      GSU Connect is a centralized digital platform I built to simplify how students, faculty, and staff at Guimaras State University access the latest official news and announcements from across all campuses.
    </motion.p>

    <motion.p variants={ITEM_VARIANTS} className="text-xs italic leading-relaxed">
      In many schools, updates are scattered across multiple sources—websites, Facebook pages, or bulletin boards—making it easy to miss important information. GSU Connect solves this by automatically scraping only the newest and most recent news from trusted university sources and displaying it in one organized, easy-to-navigate platform.
    </motion.p>

    <motion.div 
      variants={ITEM_VARIANTS}
      className="border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 rounded-lg p-3"
    >
      <h2 className="text-lg font-medium text-gray-900 mb-1.5">My goal is simple:</h2>
      <p className="text-sm leading-relaxed">
        To make sure everyone in the GSU community can stay updated without the hassle of checking multiple sites or missing urgent updates.
      </p>
    </motion.div>

    <motion.p variants={ITEM_VARIANTS} className="text-sm leading-relaxed">
      Whether you're a student tracking school events or a faculty member staying on top of announcements, GSU Connect helps you stay informed—fast, reliably, and all in one place.
    </motion.p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BackButton />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 rounded-lg p-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            About GSU Connect
          </motion.h1>
          
          <AboutContent />
        </motion.div>
      </div>
    </div>
  );
} 