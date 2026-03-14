import { motion, AnimatePresence } from 'motion/react';
import { X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/billing');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-[#ecfeff] rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#ecfeff] rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-black" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2
                  className="text-2xl mb-4"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Free Credits Used
                </h2>
                <p
                  className="text-[#3A3A3A] mb-3"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  You've used the free credits included with your account. To continue translating more pages, please upgrade your plan.
                </p>
                <p
                  className="text-sm text-[#6B6B6B]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Upgrading will unlock more credits so you can keep translating without interruption.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 bg-black text-white rounded-md hover:bg-[#3A3A3A] hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-[rgba(0,0,0,0.15)] rounded-md hover:bg-[#ecfeff] transition-all duration-300"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
