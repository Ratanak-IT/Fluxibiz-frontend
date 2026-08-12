'use client';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { useConnection } from './ConnectionProvider';
import { NO_INTERNET_IMAGE_BASE64 } from './no-internet-base64';

export function OfflineGate({ children }: { children: React.ReactNode }) {
  const isOnline = useConnection();
  const [checking, setChecking] = useState(false);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        window.location.reload();
      } else {
        setChecking(false);
        toast.error("Still offline. Please check your Wi-Fi or mobile data.");
      }
    }, 600);
  };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-background">
        <Image
          src={NO_INTERNET_IMAGE_BASE64}
          alt="No internet connection"
          width={450}
          height={340}
          priority
          unoptimized
          className="h-auto max-w-[85vw] sm:max-w-md"
        />
        <h1 className="mt-6 mb-2 text-2xl font-bold text-gray-900 dark:text-foreground">
          Oops! No Internet Connection
        </h1>
        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-muted-foreground">
          Looks like you&apos;ve wandered off the grid. Check your Wi-Fi or mobile data and try again.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          disabled={checking}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00932A] px-6 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-[#007d24] disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking connection...' : 'Retry'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}