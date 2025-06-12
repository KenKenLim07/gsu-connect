import { Link } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, NewspaperIcon, InformationCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleToggle = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setOpen((prev) => !prev);
    setTimeout(() => setIsTransitioning(false), 400); // Match animation duration
  }, [isTransitioning]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-sm font-bold text-gray-900">GSU Connect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/news" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
              <NewspaperIcon className="w-5 h-5" />
              <span>News</span>
            </Link>
            <Link to="/about" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
              <InformationCircleIcon className="w-5 h-5" />
              <span>About</span>
            </Link>
            <Link to="/login" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={handleToggle}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 flex flex-col justify-center items-center relative"
                animate={open ? "open" : "closed"}
              >
                <motion.span
                  className="w-6 h-0.5 bg-current block origin-center absolute"
                  variants={{
                    closed: { rotate: 0, y: -6 },
                    open: { 
                      rotate: 45, 
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1]
                      }
                    }
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current block absolute"
                  variants={{
                    closed: { opacity: 1, y: 0 },
                    open: { 
                      opacity: 0,
                      transition: {
                        duration: 0.2,
                        ease: "easeInOut"
                      }
                    }
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current block origin-center absolute"
                  variants={{
                    closed: { rotate: 0, y: 6 },
                    open: { 
                      rotate: -45, 
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1]
                      }
                    }
                  }}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b"
          >
            <div className="flex flex-col py-2 px-4 gap-2">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-2">
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link to="/news" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-2">
                <NewspaperIcon className="w-5 h-5" />
                <span>News</span>
              </Link>
              <Link to="/about" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-2">
                <InformationCircleIcon className="w-5 h-5" />
                <span>About</span>
              </Link>
              <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-2">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 