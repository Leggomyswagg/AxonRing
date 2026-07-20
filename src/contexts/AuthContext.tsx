// ── Auth stub — Famous.ai auth removed ──
// Replace with your preferred auth solution if needed (Base44, Clerk, etc.)
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: null;
  loading: false;
  signIn: () => Promise<{}>;
  signUp: () => Promise<{}>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={{ user: null, loading: false, signIn: async () => ({}), signUp: async () => ({}), signOut: async () => {} }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
