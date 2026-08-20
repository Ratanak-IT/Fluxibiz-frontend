import type { Metadata } from 'next'
import UserProfile from '@/components/user-profile/user-profile'
import React from 'react'
import StoreNavbar from '@/components/store/store-component/navbar'
import { NOINDEX } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Your Profile',
  robots: NOINDEX,
}

export default function UserProfilePage() {
  return (
    <div className="relative min-h-screen bg-gray-50 pb-24 dark:bg-background lg:pb-0">
      <UserProfile />
      <StoreNavbar />
    </div>
  );
}
