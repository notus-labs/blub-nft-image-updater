import {
  CheckCircle,
  CircleNotch,
  Info,
  WarningCircle,
  WarningDiamond,
  X,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/twind';

import { Button } from './ui/button';

export type ToastType = 'info' | 'warning' | 'error' | 'success' | 'loading';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

interface ToastAction<T = any> {
  label: string;
  onClick: (data: T) => void;
  closeOnClick?: boolean;
}

interface ToastOptions<T = any> {
  duration?: number;
  description?: string;
  showLoadingTime?: boolean;
  action?: ToastAction<T>;
}

export interface Toast<T = any> {
  id: string;
  message: string | React.ReactNode;
  type: ToastType;
  duration?: number;
  description?: string;
  isPaused?: boolean;
  createdAt: number;
  loadingStartTime?: number;
  loadingEndTime?: number;
  action?: ToastAction<T>;
  actionData?: T;
}

type PromiseFunction<T> = () => Promise<T>;

interface ToastPromiseMessages<T = any> {
  loading: string;
  success: string | ((result: T) => string | React.ReactNode);
  error: string | ((error: any) => string | React.ReactNode);
  finally?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions
  ) => string;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);
const DEFAULT_DURATION = 3000;

export const ToastProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>('bottom-right');
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const addToast = (
    message: string,
    type: ToastType,
    {
      duration = DEFAULT_DURATION,
      description,
      showLoadingTime,
      action,
    }: ToastOptions = {}
  ) => {
    const id = `${Date.now().toString()}-${Math.random().toString(36).substring(2, 15)}`;
    const newToast: Toast = {
      id,
      message,
      type,
      action,
      duration,
      description,
      isPaused: false,
      createdAt: Date.now(),
      loadingStartTime: showLoadingTime ? Date.now() : undefined,
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration !== 0 && duration !== Infinity) {
      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const pauseToast = (id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  const resumeToast = (id: string) => {
    const toast = toasts.find((t) => t.id === id);

    if (toast && toast.duration && toast.duration > 0) {
      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  };

  const updateToast = (id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((toast) => {
        if (toast.id === id) {
          const updatedToast = { ...toast, ...updates };

          if (updates.duration !== undefined) {
            if (timersRef.current[id]) {
              clearTimeout(timersRef.current[id]);
              delete timersRef.current[id];
            }

            if (updates.duration > 0) {
              timersRef.current[id] = setTimeout(() => {
                removeToast(id);
              }, updates.duration);
            }
          }

          return updatedToast;
        }
        return toast;
      })
    );
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        position,
        setPosition,
        pauseToast,
        resumeToast,
        updateToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: {
      info: (message: string, options?: ToastOptions) =>
        context.addToast(message, 'info', options),
      warning: (message: string, options?: ToastOptions) =>
        context.addToast(message, 'warning', options),
      error: (message: string, options?: ToastOptions) =>
        context.addToast(message, 'error', options),
      success: (message: string, options?: ToastOptions) =>
        context.addToast(message, 'success', options),
      promise: async <T,>(
        promiseOrFn: Promise<T> | PromiseFunction<T>,
        messages: ToastPromiseMessages<T>,
        options?: ToastOptions<T>
      ) => {
        const toastId = context.addToast(messages.loading, 'loading', {
          ...options,
          duration: 0,
        });

        try {
          const promise =
            typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
          const result = await promise;

          const successMessage =
            typeof messages.success === 'function'
              ? messages.success(result)
              : messages.success;

          context.updateToast(toastId, {
            type: 'success',
            message: successMessage,
            description: options?.description,
            duration: options?.duration ?? DEFAULT_DURATION,
            loadingEndTime: options?.showLoadingTime ? Date.now() : undefined,
            action: options?.action,
            actionData: result,
          });
          return result;
        } catch (error) {
          const errorMessage =
            typeof messages.error === 'function'
              ? messages.error(error)
              : messages.error;

          context.updateToast(toastId, {
            type: 'error',
            message: errorMessage,
            description: options?.description,
            duration: options?.duration ?? DEFAULT_DURATION,
            loadingEndTime: options?.showLoadingTime ? Date.now() : undefined,
          });
        } finally {
          if (messages.finally) {
            messages.finally();
          }
        }
      },
    },
    setPosition: context.setPosition,
  };
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const Toaster = ({
  maxToasts = 3,
  defaultPosition = 'bottom-right',
}: {
  maxToasts?: number;
  defaultPosition?: ToastPosition;
}) => {
  const {
    toasts,
    removeToast,
    pauseToast,
    position,
    setPosition,
    resumeToast,
  } = useContext(ToastContext);

  const getAnimationValues = (position: ToastPosition) => {
    if (position.startsWith('top')) {
      return { initial: -50, exit: -20 };
    }
    return { initial: 50, exit: 20 };
  };

  const animationValues = getAnimationValues(position);

  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition]);

  return createPortal(
    <div
      className={`toaster pointer-events-auto fixed z-[99999] flex min-w-[22.5rem] flex-col gap-2 ${positionClasses[position]}`}
    >
      <AnimatePresence mode="popLayout">
        {toasts
          .sort((a, b) => a.createdAt - b.createdAt)
          .slice(maxToasts * -1)
          .map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, scale: 0.3, y: animationValues.initial }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: animationValues.exit }}
              transition={{
                duration: 0.2,
                opacity: {
                  duration: 0.15,
                  ease: 'easeOut',
                },
                y: {
                  duration: 0.2,
                  ease: 'easeOut',
                },
                layout: {
                  duration: 0.5,
                  ease: 'easeOut',
                  type: 'spring',
                  bounce: 0,
                },
              }}
              onMouseEnter={() => pauseToast(toast.id)}
              onMouseLeave={() => resumeToast(toast.id)}
              className={cn(
                'flex cursor-default items-start gap-2 rounded-3xl border border-[#e4e4e4] bg-[#f4f4f4] p-5 dark:border-[#242424] dark:bg-[#141414]',
                {
                  'bg-opacity-80': toast.isPaused,
                  'bg-opacity-100': !toast.isPaused,
                }
              )}
              style={{
                zIndex: index + 1,
              }}
            >
              <ToastIcon type={toast.type} />

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex h-6 items-center">
                  <p className="flex h-3 items-center text-subheader font-semibold tracking-tight text-foreground dark:text-foreground-dark">
                    {toast.message}
                  </p>
                </div>
                {toast.description && (
                  <p className="text-metadata-1 tracking-tight text-[#808080]">
                    {toast.description}
                  </p>
                )}
                {toast.loadingStartTime && toast.loadingEndTime && (
                  <div className="mt-2.5 inline-flex">
                    <LoadingTimeBadge
                      type={toast.type}
                      startTime={toast.loadingStartTime}
                      endTime={toast.loadingEndTime}
                    />
                  </div>
                )}
                {toast.action && toast.type !== 'loading' && (
                  <div className="mt-3">
                    <ToastAction
                      action={toast.action}
                      data={toast.actionData}
                      onClose={() => removeToast(toast.id)}
                    />
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeToast(toast.id)}
                className="flex h-6 items-center justify-center"
              >
                <X className="size-5 text-[#808080] transition-colors duration-200 hover:text-[#000000] dark:hover:text-[#ffffff]" />
              </motion.button>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

interface ToastIconConfig {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  containerClass: string;
  iconClass: string;
}

const toastIconConfig: Record<ToastType, ToastIconConfig> = {
  success: {
    Icon: CheckCircle,
    containerClass:
      'border-success-300 dark:border-dark-mode-green bg-[#E3F6ED] dark:bg-[#091D17]',
    iconClass: 'text-light-mode-green-800 dark:text-dark-mode-green-800',
  },
  error: {
    Icon: WarningCircle,
    containerClass:
      'border-[#FDA29B] dark:border-dark-mode-red bg-[#FDE9E7] dark:bg-[#240F11]',
    iconClass: 'text-light-mode-red-800 dark:text-dark-mode-red-800',
  },
  warning: {
    Icon: WarningDiamond,
    containerClass:
      'border-warning-300 dark:border-dark-mode-orange bg-[#FEF2E1] dark:bg-[#25180C]',
    iconClass: 'text-light-mode-orange-800 dark:text-dark-mode-orange-800',
  },
  info: {
    Icon: Info,
    containerClass:
      'border-primary-300 dark:border-primary-800 bg-[#E0EEFF] dark:bg-[#071429]',
    iconClass: 'text-primary-800 dark:text-primary',
  },
  loading: {
    Icon: CircleNotch,
    containerClass:
      'bg-[#EFF8FF] dark:bg-[#0D1A2E] border-[#84CAFF] dark:border-[#1E3A8F]',
    iconClass: 'text-[#3B82F6] dark:text-[#84CAFF] animate-spin',
  },
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const config = toastIconConfig[type];
  const { Icon, containerClass, iconClass } = config;

  return (
    <div
      className={cn(
        'flex size-6 items-center justify-center rounded-full border-2 p-0.5',
        containerClass
      )}
    >
      <Icon className={cn('size-full', iconClass)} />
    </div>
  );
};

const LoadingTimeBadge = ({
  type,
  startTime,
  endTime,
}: {
  type: ToastType;
  startTime?: number;
  endTime?: number;
}) => {
  if (!startTime || !endTime || !type) return null;

  const durationMs = endTime - startTime;
  const formattedDuration = formatDuration(durationMs);

  const config = toastIconConfig[type];
  const { containerClass, iconClass } = config;

  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-full bg-black/10 px-2 py-0.5 text-metadata-2 font-medium',
        containerClass,
        iconClass
      )}
    >
      Completed in {formattedDuration}
    </span>
  );
};

const formatDuration = (durationMs: number): string => {
  const minutes = durationMs / (1000 * 60);

  if (minutes < 1) {
    const seconds = durationMs / 1000;
    return `${Math.round(seconds * 10) / 10} seconds`;
  } else {
    return `${Math.round(minutes * 100) / 100} minutes`;
  }
};

const ToastAction = <T,>({
  action,
  data,
  onClose,
}: {
  action: ToastAction<T>;
  data: T;
  onClose: () => void;
}) => {
  const handleClick = () => {
    action.onClick(data);
    if (action.closeOnClick) {
      onClose();
    }
  };

  return (
    <Button
      variant="accent"
      size="sm"
      onClick={() => handleClick()}
      className={cn('rounded-xl px-4')}
    >
      {action.label}
    </Button>
  );
};
