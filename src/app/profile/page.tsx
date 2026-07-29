
"use client";

import { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/useAuth";
import { useGetMyProfileQuery } from "@/features/user/userApi";

export default function ProfilePage() {
    const { user, status, login } = useAuth();

    const { data: profile, isLoading } = useGetMyProfileQuery(undefined, {
        skip: status !== "authenticated",
    });

    useEffect(() => {
        if (status === "unauthenticated") login();
    }, [status, login]);

    if (status !== "authenticated" || !user) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-16">
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
        );
    }

    const rows: { label: string; value?: string }[] = [
        { label: "Username", value: profile?.username ?? user.username },
        { label: "Email", value: profile?.email ?? user.email },
        { label: "First name", value: profile?.firstName ?? user.firstName },
        { label: "Last name", value: profile?.lastName ?? user.lastName },
        { label: "Phone number", value: profile?.phoneNumber },
        { label: "Gender", value: profile?.gender },
        { label: "Address", value: profile?.address },
        { label: "Role", value: profile?.role ?? user.roles.join(", ") },
    ];

    return (
        <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
            <div className="flex items-center gap-4">
                <Avatar className="size-20 border border-border">
                    {user.image && <AvatarImage src={user.image} alt={user.name} />}
                    <AvatarFallback className="text-xl">
                        {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold text-foreground">
                        {user.name}
                    </h1>
                    <p className="truncate text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>

            <dl className="mt-10 divide-y divide-border rounded-2xl border border-border">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between gap-6 px-5 py-4"
                    >
                        <dt className="text-sm font-semibold text-muted-foreground">
                            {row.label}
                        </dt>
                        <dd className="min-w-0 truncate text-sm font-medium text-foreground">
                            {isLoading ? (
                                <Skeleton className="h-4 w-32" />
                            ) : (
                                row.value || "—"
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}