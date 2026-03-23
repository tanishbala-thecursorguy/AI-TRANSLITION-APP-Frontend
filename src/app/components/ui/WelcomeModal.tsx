import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isNewUser: boolean;
}

export function WelcomeModal({ isOpen, onClose, isNewUser }: WelcomeModalProps) {
  const { user } = useAuth();

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
                  <div className="w-16 h-16 bg-[#ecfeff] rounded-full flex items-center justify-center">
                    {isNewUser ? (
                      <span className="text-3xl">🎉</span>
                    ) : (
                      <span className="text-3xl">👋</span>
                    )}
                  </div>
                </div>

                {/* Header */}
                <h2 
                  className="text-2xl mb-3 text-center"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {isNewUser ? 'Welcome to AI Translation' : 'Welcome Back'}
                </h2>

                {/* Message */}
                {isNewUser ? (
                  <>
                    <p 
                      className="text-base text-[#6B6B6B] mb-4 text-center leading-relaxed"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Welcome to AI Book Translation! You're all set to start translating your documents.
                    </p>
                    <p 
                      className="text-sm text-[#6B6B6B] text-center"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Upload your files and experience seamless translation powered by advanced AI.
                    </p>
                  </>
                ) : (
                  <p 
                    className="text-base text-[#6B6B6B] text-center leading-relaxed"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Welcome back! Continue translating your documents with ease.
                  </p>
                )}

                {/* Action Button */}
                <button
                  onClick={onClose}
                  className="w-full bg-[#2ebb77] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#25a063] transition-colors mt-6"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {isNewUser ? 'OK' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
