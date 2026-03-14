import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GooeyLoader } from '../ui/gooey-loader';

interface PageLoaderProps {
  children: React.ReactNode;
  loadingDuration?: number; // in milliseconds, default 2500ms
}

export function PageLoader({ children, loadingDuration = 2500 }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDuration);

    return () => clearTimeout(timer);
  }, [loadingDuration]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[60vh] w-full"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Gooey Loader */}
            <div className="flex items-center justify-center w-full min-h-[100px]">
              <GooeyLoader 
                primaryColor="#f87171"
                secondaryColor="#fca5a5"
                borderColor="#e5e7eb"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[#6B6B6B] text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
