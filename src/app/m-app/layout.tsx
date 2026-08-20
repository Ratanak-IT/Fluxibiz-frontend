import type { ReactNode } from "react";

export default function MiniAppLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 antialiased">
            {children}
        </div>
    );
}
