'use client';
import { useConnection } from './ConnectionProvider';

export function OfflineBanner() {
  const isOnline = useConnection();
  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[100] bg-red-600 text-white text-sm text-center py-2 px-4">
      You&apos;re offline. Some features may not work.
    </div>
  );
}