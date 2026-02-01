import { Compass, Menu, User, PlusCircle, LogIn, MessageCircle, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;


    return (
        <nav className="fixed w-full z-50 top-0 left-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg text-white">
                            <Compass size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            UniMarket
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`relative py-1 font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                            Explore
                            {isActive('/') && <motion.div layoutId="navActive" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                        </Link>
                        {user && (
                            <Link to="/messages" className={`relative py-1 font-medium flex items-center gap-1 transition-colors ${isActive('/messages') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                                <MessageCircle size={20} /> Messages
                                {isActive('/messages') && <motion.div layoutId="navActive" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                            </Link>
                        )}

                        <Link to="/sell" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
                            <PlusCircle size={20} /> Sell Item
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className={`relative py-1 font-medium flex items-center gap-1 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                                    <User size={20} /> Profile
                                    {isActive('/profile') && <motion.div layoutId="navActive" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className={`relative py-1 font-medium flex items-center gap-1 transition-colors ${isActive('/login') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                                <LogIn size={20} /> Login
                                {isActive('/login') && <motion.div layoutId="navActive" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                            </Link>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all active:scale-90"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all active:scale-90"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none"
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4 shadow-lg">
                            <Link to="/" onClick={() => setIsOpen(false)} className={`block font-medium p-3 rounded-xl transition-all ${isActive('/') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>Explore</Link>
                            {user && <Link to="/messages" onClick={() => setIsOpen(false)} className={`block font-medium p-3 rounded-xl transition-all ${isActive('/messages') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>Messages</Link>}

                            <Link to="/sell" onClick={() => setIsOpen(false)} className={`block font-bold p-3 rounded-xl transition-all ${isActive('/sell') ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary border-l-4 border-primary' : 'text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}>Sell Now</Link>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className={`block font-medium p-3 rounded-xl transition-all ${isActive('/profile') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>Profile</Link>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className={`block font-medium p-3 rounded-xl transition-all ${isActive('/login') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>

    );
};

export default Navbar;
