"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface ToastType {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
}

interface ToastContextType {
    showToast: (toast: Omit<ToastType, 'id'>) => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
    showSuccess: () => { },
    showError: () => { },
    showWarning: () => { },
    showInfo: () => { },
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = useCallback((toast: Omit<ToastType, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    }, []);

    const showSuccess = useCallback((title: string, message?: string) => {
        showToast({ type: 'success', title, message });
    }, [showToast]);

    const showError = useCallback((title: string, message?: string) => {
        showToast({ type: 'error', title, message });
    }, [showToast]);

    const showWarning = useCallback((title: string, message?: string) => {
        showToast({ type: 'warning', title, message });
    }, [showToast]);

    const showInfo = useCallback((title: string, message?: string) => {
        showToast({ type: 'info', title, message });
    }, [showToast]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Auto-remove toasts after 5 seconds
    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                setToasts(prev => prev.slice(1));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [toasts]);

    const icons: Record<ToastType['type'], string> = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info',
    };

    const colors: Record<ToastType['type'], string> = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    const borderColors: Record<ToastType['type'], string> = {
        success: 'border-l-green-500',
        error: 'border-l-red-500',
        warning: 'border-l-yellow-500',
        info: 'border-l-blue-500',
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        style={{
                            animationDelay: `${index * 50}ms`,
                            transform: `translateY(${index * -4}px)`
                        }}
                        className={`pointer-events-auto animate-slide-up bg-white dark:bg-[#1a2634] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 border-l-4 ${borderColors[toast.type]} p-4 flex items-start gap-3 min-w-[320px] max-w-md backdrop-blur-sm`}
                    >
                        <div className={`w-8 h-8 ${colors[toast.type]} rounded-full flex items-center justify-center shrink-0 shadow-lg`}>
                            <span className="material-symbols-outlined text-white text-lg">{icons[toast.type]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary dark:text-white truncate">{toast.title}</h4>
                            {toast.message && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{toast.message}</p>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
