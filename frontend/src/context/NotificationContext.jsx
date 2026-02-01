import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X, Trash2, LogOut, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirm, setConfirm] = useState(null);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showConfirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfirm({
                ...options,
                onConfirm: () => {
                    setConfirm(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirm(null);
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ showToast, showConfirm }}>
            {children}

            {/* Toasts Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirm && (
                    <ConfirmModal
                        title={confirm.title}
                        message={confirm.message}
                        type={confirm.type}
                        confirmText={confirm.confirmText}
                        cancelText={confirm.cancelText}
                        onConfirm={confirm.onConfirm}
                        onCancel={confirm.onCancel}
                    />
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    );
};

const Toast = ({ toast, onClose }) => {
    const icons = {
        success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
        error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', bar: 'bg-red-500' },
        warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', bar: 'bg-amber-500' },
        info: { icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-50', bar: 'bg-indigo-500' },
    };

    const { icon: Icon, color, bg, bar } = icons[toast.type] || icons.info;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto relative overflow-hidden flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-2xl shadow-2xl border border-white/50 backdrop-blur-xl ${bg}`}
        >
            <div className={`p-2 rounded-xl ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            <div className="flex-1 mr-2">
                <p className="font-bold text-slate-800 text-sm leading-tight">{toast.message}</p>
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            >
                <X size={18} />
            </button>

            {/* Progress Bar */}
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${bar}`}
            />
        </motion.div>
    );
};

const ConfirmModal = ({ title, message, type, confirmText, cancelText, onConfirm, onCancel }) => {
    const styles = {
        danger: {
            icon: LogOut,
            bg: 'bg-red-50',
            iconColor: 'text-red-600',
            btn: 'bg-red-600 hover:bg-red-700 shadow-red-200',
            bar: 'bg-red-600'
        },
        delete: {
            icon: Trash2,
            bg: 'bg-red-50',
            iconColor: 'text-red-600',
            btn: 'bg-red-600 hover:bg-red-700 shadow-red-200',
            bar: 'bg-red-600'
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
            bar: 'bg-amber-600'
        }
    };

    const style = styles[type] || styles.warning;
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                <div className="p-8 text-center">
                    <div className={`mx-auto w-20 h-20 ${style.bg} ${style.iconColor} rounded-3xl flex items-center justify-center mb-6`}>
                        <Icon size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
                </div>

                <div className="flex p-6 pt-0 gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        {cancelText || 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${style.btn}`}
                    >
                        {confirmText || 'Confirm'}
                    </button>
                </div>

                {/* Aesthetic Progress Decoration */}
                <div className={`h-1.5 w-full bg-slate-100`}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full ${style.bar}`}
                    />
                </div>
            </motion.div>
        </div>
    );
};
