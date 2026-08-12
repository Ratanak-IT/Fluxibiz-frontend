
import Image from 'next/image';
import { NO_INTERNET_IMAGE_BASE64 } from '@/components/offline/no-internet-base64';

export default function OfflinePage() {
  return (
   
    
     <div className="h-screen w-screen flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-[#2e302f]">
      <Image
        src={NO_INTERNET_IMAGE_BASE64}
        alt="No internet connection"
        width={450}
        height={340}
        priority
        unoptimized
      />
      <h1 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-[#f3f7f4]">
        Oops! No Internet Connection
      </h1>
      <p className="text-gray-500 mb-6 max-w-sm dark:text-[#a7b4ad]">
        Looks like you&apos;ve wandered off the grid. Check your Wi-Fi or mobile data and try again.
      </p>
      {/* <RetryButton /> */}
    </div>
  
   
  );
}