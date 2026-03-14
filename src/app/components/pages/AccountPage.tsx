import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { User, Mail, CreditCard, LogOut, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader } from '../layout/PageLoader';
import { formatCredits } from '../../utils/fileUtils';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, credits } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/playground');
  };

  // Mock user data
  const userData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    tier: user?.tier || 'Free Tier',
    memberSince: 'March 2026',
    translationsCompleted: 12,
    charactersTranslated: '45,230',
  };

  return (
    <PageLoader loadingDuration={2500}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Account
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
            Manage your account settings and subscription
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-6">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg p-4 md:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#ecfeff] flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl mb-1 truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                    {userData.name}
                  </h2>
                  <p className="text-[#6B6B6B] flex items-center gap-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    <Mail className="w-4 h-4" />
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[rgba(0,0,0,0.08)]">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Member Since
                </p>
                <p className="font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  {userData.memberSince}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Translations Completed
                </p>
                <p className="font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  {userData.translationsCompleted}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Characters Translated
                </p>
                <p className="font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  {userData.charactersTranslated}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Credits Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-gradient-to-br from-black to-[#3A3A3A] text-white rounded-lg p-4 md:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    Available Credits
                  </h3>
                  <p className="text-3xl font-medium mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    {formatCredits(credits)}
                  </p>
                  <p className="text-sm text-white/70" style={{ fontFamily: 'var(--font-sans)' }}>
                    1 page = 1,200 credits • {Math.floor(credits / 1200)} pages remaining
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg p-4 md:p-8"
          >
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#ecfeff] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    Current Plan
                  </h3>
                  <p className="text-2xl font-medium mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    {userData.tier}
                  </p>
                  <p className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {userData.tier === 'Free Tier' 
                      ? '3,600 credits included (3 pages)' 
                      : 'Monthly credit allowance'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/billing')}
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-[#3A3A3A] transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md self-start"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Upgrade Plan
              </button>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg p-4 md:p-8"
          >
            <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Account Actions
            </h3>
            
            <div className="space-y-4">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-md hover:bg-[#ecfeff] transition-all text-left"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <User className="w-5 h-5 text-[#6B6B6B]" />
                <span>Edit Profile</span>
              </button>
              
              <button
                className="w-full flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-md hover:bg-[#ecfeff] transition-all text-left"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <Mail className="w-5 h-5 text-[#6B6B6B]" />
                <span>Change Email</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 border border-red-200 rounded-md hover:bg-red-50 transition-all text-left text-red-600"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLoader>
  );
}