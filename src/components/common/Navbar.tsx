"use client";
 
import { useAuth } from "@/features/auth/useAuth";
import NavbarAfterLoginComponent from "@/components/common/NavbarAfterLoginComponent";
import NavbarBeforeLoginComponent from "@/components/common/NavbarBeforeLoginComponent";
import { useIsTma } from "@/lib/tma/useIsTma";

export default function Navbar() {
    const { user, status, logout } = useAuth();
    const isTma = useIsTma();

    // The Mini App gets its own business-specific TmaNavbar instead — this
    // one links to other businesses and the general /store directory, which
    // makes no sense inside a single business's own Telegram bot.
    if (isTma) {
        return null;
    }

    if (status === "authenticated" && user) {
        return <NavbarAfterLoginComponent user={user} onLogout={logout} />;
    }

    return <NavbarBeforeLoginComponent pending={status === "loading"} />;
}
 