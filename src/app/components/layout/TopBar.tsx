import { motion } from 'motion/react';
import { Menu, Zap, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { formatCredits, FREE_TRIAL_CREDITS } from '../../utils/fileUtils';
import { AuthModal } from '../ui/AuthModal';
import { WelcomeModal } from '../ui/WelcomeModal';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [logoVisible, setLogoVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, credits, user } = useAuth();

  // Force re-render when credits change
  const [creditDisplay, setCreditDisplay] = useState(0);
  
  useEffect(() => {
    setCreditDisplay(credits);
  }, [credits]);

  // Track if user was just authenticated (for welcome modal)
  const handleSignupComplete = () => {
    // Reset the session flag so welcome modal shows for new signup
    sessionStorage.removeItem('hasSeenWelcome');
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if this is a new login/signup
      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setIsNewUser(true);
        setShowWelcomeModal(true);
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }
    }
  }, [isAuthenticated, user]);

  // Derive initials for avatar
  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : 'U';

  // Display credits: if authenticated use real credits, else show free trial credits
  const displayCredits = isAuthenticated ? credits : FREE_TRIAL_CREDITS;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[rgba(0,0,0,0.08)] backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between h-20 px-6 lg:px-12">
        {/* Hamburger menu */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[#F8F6F2] rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Centered logo with writing animation */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: logoVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-3xl whitespace-nowrap"
            style={{ fontFamily: 'var(--font-cursive)' }}
          >
            AI Book Translation
          </h1>
        </motion.div>

        {/* Right side - Credits Box Always Visible */}
        <div className="flex items-center gap-3">
          {/* Credits Box - Prominent display in top right corner */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0891b2]/15 to-[#22d3ee]/15 border-2 border-[#0891b2] shadow-lg cursor-pointer select-none hover:shadow-xl hover:border-[#0e7490] transition-all"
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

          {/* Before login: Show Login button */}
          {!isAuthenticated && (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0891b2] text-white rounded-lg hover:bg-[#0e7490] transition-colors text-sm font-medium shadow-md"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
          )}

          {/* After login: Show Profile icon */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/account')}
              className="w-10 h-10 bg-[#0891b2] text-white rounded-full flex items-center justify-center hover:bg-[#0e7490] transition-colors text-sm font-medium shadow-md"
              aria-label="User profile"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {initials}
            </button>
          )}
        </div>
      </div>
    </header>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignupComplete={handleSignupComplete}
      />
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          setIsNewUser(false);
        }}
        isNewUser={isNewUser}
      />
    </>
  );
}