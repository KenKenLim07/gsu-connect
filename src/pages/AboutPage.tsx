import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, easeOut } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Static content data
const aboutContent = {
  intro: "I built GSU Connect because I noticed that important information at Guimaras State University was often fragmented—spread across different university websites and Facebook pages. This made it easy for students, faculty, and staff to miss announcements, events, or updates that mattered.",
  solution: "GSU Connect solves this by linking and centralizing those scattered sources. It automatically pulls the latest news and announcements from trusted university platforms and presents them in one simple, easy-to-use hub.",
  goal: "To help the entire GSU community stay informed—without the hassle of checking multiple sites or missing out on urgent updates. By connecting various official sources into one streamlined platform, GSU Connect makes staying updated fast, reliable, and effortless."
};

// Separate components for better organization
const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(-1)}
      className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white mb-2 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      <span className="text-sm">Back</span>
    </motion.button>
  );
};

const AboutContent = () => {
  const content = aboutContent;
  const hasAnimated = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      setShouldAnimate(true);
      hasAnimated.current = true;
    }
  }, []);

  // Animation for all blocks
  const COMMON_ANIMATION = shouldAnimate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOut }
      }
    : {};

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-200">
      <motion.p
        {...COMMON_ANIMATION}
        className="text-base md:text-lg font-normal leading-relaxed text-gray-900 dark:text-gray-100"
      >
        {content.intro}
      </motion.p>
      <motion.p
        {...COMMON_ANIMATION}
        className="text-sm italic text-gray-600 dark:text-gray-300 border-l-4 border-primary/60 pl-3 py-1 bg-gray-50 dark:bg-gray-900/40 rounded"
      >
        {content.solution}
      </motion.p>
      <motion.div
        initial={shouldAnimate ? { opacity: 0, scale: 0.97 } : false}
        animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
        transition={shouldAnimate ? { duration: 0.5, ease: easeOut, delay: 0.2 } : undefined}
        className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-3 shadow-sm"
      >
        <h2 className="text-base font-semibold text-primary mb-1">My goal is simple:</h2>
        <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
          {content.goal}
        </p>
      </motion.div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BackButton />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors duration-200 rounded-lg p-3"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
          >
            About GSU Connect
          </motion.h1>
          
          <AboutContent />
        </motion.div>
      </div>
    </div>
  );
} 