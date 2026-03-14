import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  tier: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  credits: number;
  deductCredits: (amount: number) => boolean;
  upgradePlan: (newTier: string, creditsToAdd: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FREE_TRIAL_CREDITS = 3600;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock login
    setUser({
      email,
      name: email.split('@')[0],
      tier: 'Free Tier',
      credits: FREE_TRIAL_CREDITS,
    });
  };

  const signup = (name: string, email: string, password: string) => {
    // Mock signup - auto login after signup
    setUser({
      email,
      name,
      tier: 'Free Tier',
      credits: FREE_TRIAL_CREDITS,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const deductCredits = (amount: number): boolean => {
    if (!user) return false;
    
    if (user.credits >= amount) {
      setUser({ ...user, credits: user.credits - amount });
      return true;
    }
    return false;
  };

  const upgradePlan = (newTier: string, creditsToAdd: number) => {
    if (!user) return;
    
    setUser({
      ...user,
      tier: newTier,
      credits: user.credits + creditsToAdd,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        credits: user?.credits || 0,
        deductCredits,
        upgradePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}