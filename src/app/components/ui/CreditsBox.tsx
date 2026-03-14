import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { formatCredits, FREE_TRIAL_CREDITS } from '../../utils/fileUtils';
import { useEffect, useState } from 'react';

export function CreditsBox() {
  const navigate = useNavigate();
  const { isAuthenticated, credits } = useAuth();
  
  // Force re-render when credits change
  const [creditDisplay, setCreditDisplay] = useState(0);
  
  useEffect(() => {
    setCreditDisplay(credits);
  }, [credits]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0891b2]/15 to-[#22d3ee]/15 border-2 border-[#0891b2] shadow-lg cursor-pointer select-none hover:shadow-xl hover:border-[#0e7490] transition-all"
      onClick={() => navigate('/billing')}
      title="Click to view billing & upgrade"
    >
      <Zap className="w-5 h-5 flex-shrink-0 text-[#0891b2]" fill="#0891b2" />
      <div className="flex flex-col leading-none">
        <span className="text-xs text-[#6B6B6B] mb-0.5" style={{ fontFamily: 'var(--font-sans)' }}>Credits</span>
        <span className="text-base font-bold text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
          {formatCredits(isAuthenticated ? creditDisplay : FREE_TRIAL_CREDITS)}
        </span>
      </div>
    </motion.div>
  );
}
