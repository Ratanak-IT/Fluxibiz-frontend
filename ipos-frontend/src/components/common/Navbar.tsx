"use client";
 
import { useAuth } from "@/features/auth/useAuth";
import NavbarAfterLoginComponent from "@/components/common/NavbarAfterLoginComponent";
import NavbarBeforeLoginComponent from "@/components/common/NavbarBeforeLoginComponent";
 
export default function Navbar() {
    const { user, status, logout } = useAuth();
 
    if (status === "authenticated" && user) {
        return <NavbarAfterLoginComponent user={user} onLogout={logout} />;
    }

    return <NavbarBeforeLoginComponent pending={status === "loading"} />;
}
 