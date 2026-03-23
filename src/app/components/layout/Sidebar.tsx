import { motion, AnimatePresence } from 'motion/react';
import { X, Play, FileText, CreditCard, HelpCircle, UserCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Play, label: 'Playground', path: '/playground' },
  { icon: CheckCircle, label: 'Completed', path: '/completed' },
  { icon: FileText, label: 'Usage', path: '/usage' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: HelpCircle, label: 'Support', path: '/support' },
  { icon: UserCircle, label: 'Account', path: '/account' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Embedded Google Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        `}
      </style>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-[rgba(0,0,0,0.08)] z-50 overflow-y-auto sidebar-menu"
          >
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-[#F8F6F2] rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <h2
                className="text-2xl mb-12 mt-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                AI Book Translation
              </h2>

              {/* Menu items */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-[#8a8888] text-white'
                          : 'hover:bg-[#969696] text-[#3A3A3A]'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}