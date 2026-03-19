import { motion } from 'motion/react';
import { Menu, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
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
  const { isAuthenticated, user } = useAuth();

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#e1f3f3] border-b border-[rgba(0,0,0,0.08)] backdrop-blur-sm bg-opacity-95">
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

        {/* Right side - Login and Profile */}
        <div className="flex items-center gap-3">

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