import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { formatCredits, FREE_TRIAL_MAX_PAGES, calculateRequiredCredits } from '../../utils/fileUtils';

interface FreeTierLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentPages: number;
  availableCredits: number;
  onContinueWithLimit: (limitedPages: number) => void;
  onGrowCredits: () => void;
  isAuthenticated: boolean;
}

export function FreeTierLimitModal({
  isOpen,
  onClose,
  documentPages,
  availableCredits,
  onContinueWithLimit,
  onGrowCredits,
  isAuthenticated,
}: FreeTierLimitModalProps) {
  const limitedPages = FREE_TRIAL_MAX_PAGES;
  const limitedCredits = calculateRequiredCredits(limitedPages);
  const fullCredits = calculateRequiredCredits(documentPages);

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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="rounded-lg shadow-2xl max-w-md w-full overflow-y-auto relative bg-gradient-to-b from-white/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-8">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-[#F59E0B]" />
                  </div>
                </div>

                {/* Header */}
                <h2 
                  className="text-2xl mb-3 text-center"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  More Pages Detected
                </h2>

                {/* Message */}
                <p 
                  className="text-base text-[#6B6B6B] mb-4 text-center leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  This document contains more than 2 pages. The free trial allows translating up to 2 pages per document.
                </p>

                {/* Details Box */}
                <div className="bg-[#ecfeff] rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                      Document pages:
                    </span>
                    <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
                      {documentPages} pages ({formatCredits(fullCredits)} credits)
                    </span>
                  </div>
                  <div className="border-t border-[rgba(0,0,0,0.08)] pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                        Free trial limit:
                      </span>
                      <span className="text-sm font-semibold text-black" style={{ fontFamily: 'var(--font-sans)' }}>
                        {limitedPages} pages ({formatCredits(limitedCredits)} credits)
                      </span>
                    </div>
                  </div>
                </div>

                <p 
                  className="text-sm text-[#6B6B6B] text-center mb-6"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  You can continue translating the first 2 pages or upgrade your credits to translate the full document.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onContinueWithLimit(limitedPages);
                      onClose();
                    }}
                    className="w-full bg-[#2ebb77] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#25a063] transition-colors"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Continue with {limitedPages} Pages
                  </button>
                  <button
                    onClick={() => {
                      onGrowCredits();
                      onClose();
                    }}
                    className="w-full border border-[rgba(0,0,0,0.15)] text-black py-3 px-4 rounded-lg font-medium hover:bg-[#ecfeff] transition-colors"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Grow Credits
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
