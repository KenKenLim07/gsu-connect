import { Link, useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, NewspaperIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from "@/features/theme/useDarkMode";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

function DarkModeSwitch({ isDark, toggleDark }: { isDark: boolean; toggleDark: () => void }) {
  return (
    <button
      onClick={toggleDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary
        ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute left-1 top-0.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300
          ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {isDark ? (
          <MoonIcon className="w-4 h-4 text-gray-500" />
        ) : (
          <SunIcon className="w-4 h-4 text-yellow-400" />
        )}
      </span>
    </button>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleDark } = useDarkMode();

  const handleToggle = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setOpen((prev) => !prev);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const handleMenuClose = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setOpen(false);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/news", icon: NewspaperIcon, label: "News" },
    { to: "/about", icon: InformationCircleIcon, label: "About" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled || open ? 'bg-white shadow-sm dark:bg-gray-950 dark:shadow-black/30' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">GSU Connect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
            </Link>
            ))}
            {/* Dark mode toggle */}
            <div className="ml-4"><DarkModeSwitch isDark={isDark} toggleDark={toggleDark} /></div>
          </div>

          {/* Mobile Menu Button and Dark Mode Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeSwitch isDark={isDark} toggleDark={toggleDark} />
            <motion.button
              onClick={handleToggle}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 flex flex-col justify-center items-center relative"
                animate={open ? "open" : "closed"}
              >
                <motion.span
                  className="w-6 h-[3px] bg-current block origin-center absolute"
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
                  className="w-6 h-[3px] bg-current block absolute"
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
                  className="w-6 h-[3px] bg-current block origin-center absolute"
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white dark:bg-gray-950 border-b overflow-hidden"
          >
            <motion.div 
              className="flex flex-col py-2 px-4 gap-2"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1
                  }
                },
                closed: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1
                  }
                }
              }}
            >
              {menuItems.map((item) => (
                <motion.div
                  key={item.to}
                  variants={{
                    open: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        x: { stiffness: 1000, velocity: -100 },
                        opacity: { duration: 0.2 }
                      }
                    },
                    closed: {
                      x: -50,
                      opacity: 0,
                      transition: {
                        x: { stiffness: 1000 },
                        opacity: { duration: 0.1 }
                      }
                    }
                  }}
                >
                  <Link 
                    to={item.to} 
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClose();
                      // Small delay to ensure state updates before navigation
                      setTimeout(() => {
                        navigate(item.to);
                      }, 100);
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white py-2"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 