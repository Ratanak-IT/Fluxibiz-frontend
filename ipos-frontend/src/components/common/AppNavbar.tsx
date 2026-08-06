"use client";

import NavbarAfterLoginComponent from "@/components/common/NavbarAfterLoginComponent";
import NavbarBeforeLoginComponent from "@/components/common/NavbarBeforeLoginComponent";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function AppNavbar() {
  const { isAuthenticated, isLoading, login, logout, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <NavbarAfterLoginComponent
        cartCount={0}
        onLogout={logout}
        user={user}
      />
    );
  }

  return (
    <NavbarBeforeLoginComponent isLoggingIn={isLoading} onLogin={login} />
  );
}
