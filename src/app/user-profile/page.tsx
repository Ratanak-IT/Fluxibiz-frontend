import UserProfile from '@/components/user-profile/user-profile'
import React from 'react'
import StoreNavbar from '@/components/store/store-component/navbar'

export default function UserProfilePage() {
  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      <UserProfile />
      <StoreNavbar />
    </div>
  )
}
