'use client';
import { createContext, useContext } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const ConnectionContext = createContext(true);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  return (
    <ConnectionContext.Provider value={isOnline}>
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = () => useContext(ConnectionContext);