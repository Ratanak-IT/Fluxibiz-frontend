'use client';
import Image from 'next/image';
import { useConnection } from './ConnectionProvider';

export function OfflineGate({ children }: { children: React.ReactNode }) {
  const isOnline = useConnection();

  if (!isOnline) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center text-center px-4 bg-white">
        <Image
          src="/no-internet.png"
          alt="No internet connection"
          width={450}
          height={340}
          priority
        />
        <h1 className="text-2xl font-semibold mt-6 mb-2 text-gray-900">
          Oops! No Internet Connection
        </h1>
        <p className="text-gray-500 mb-6 max-w-sm">
          Looks like you&apos;ve wandered off the grid. Check your Wi-Fi or mobile data and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}