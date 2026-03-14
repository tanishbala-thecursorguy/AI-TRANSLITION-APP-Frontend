import { motion } from 'motion/react';
import { GooeyLoader } from '../../ui/gooey-loader';

interface LoadingStepProps {
  message: string;
}

export function LoadingStep({ message }: LoadingStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Gooey Loader */}
        <div className="flex items-center justify-center w-full min-h-[100px]">
          <GooeyLoader 
            primaryColor="#f87171"
            secondaryColor="#fca5a5"
            borderColor="#e5e7eb"
          />
        </div>

        <div className="text-center">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Processing
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[#6B6B6B]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {message}
          </motion.p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-black"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}