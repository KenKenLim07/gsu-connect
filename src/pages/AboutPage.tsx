import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 rounded-lg p-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold text-gray-900 mb-6"
          >
            About GSU Connect
          </motion.h1>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 text-gray-600"
          >
            <motion.p variants={itemVariants} className="text-sm leading-relaxed">
              GSU Connect is a centralized digital platform I built to simplify how students, faculty, and staff at Guimaras State University access the latest official news and announcements from across all campuses.
            </motion.p>

            <motion.p variants={itemVariants} className="text-sm leading-relaxed">
              In many schools, updates are scattered across multiple sources—websites, Facebook pages, or bulletin boards—making it easy to miss important information. GSU Connect solves this by automatically scraping only the newest and most recent news from trusted university sources and displaying it in one organized, easy-to-navigate platform.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">My goal is simple:</h2>
              <p className="text-sm leading-relaxed">
                To make sure everyone in the GSU community can stay updated without the hassle of checking multiple sites or missing urgent updates.
              </p>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm leading-relaxed">
              Whether you're a student tracking school events or a faculty member staying on top of announcements, GSU Connect helps you stay informed—fast, reliably, and all in one place.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 