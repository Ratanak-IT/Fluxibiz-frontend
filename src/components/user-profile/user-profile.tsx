"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Pencil, User, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "@/features/user/userApi";
import { resolveMediaUrl } from "@/lib/type/cartType";

const connectedProviders = [
  {
    name: "Google",
    email: "Connected via OAuth2 / Keycloak",
    connected: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5">
        <path
          fill="#4285F4"
          d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.56-5.17 3.56-8.73Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.24 21.3 7.3 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.3 0 3.24 2.7 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
    ),
  },
];

export default function UserProfile() {
  const { user, status, login } = useAuth();
  const { data: profile, isLoading } = useGetMyProfileQuery(undefined, {
    skip: status !== "authenticated",
  });
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      login();
    }
  }, [status, login]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setEmail(profile.email ?? user?.email ?? "");
      setPhone(profile.phoneNumber ?? "");
      setAddress(profile.address ?? "");
      setGender(profile.gender ?? "");
    } else if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
    }
  }, [profile, user]);

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || user?.name || "User Profile";
  const avatarSrc = resolveMediaUrl(profile?.profilePicture) ?? user?.image ?? "https://github.com/shadcn.png";
  const fallbackInitials = (fullName.slice(0, 2) || "UP").toUpperCase();

  async function handleSaveChanges() {
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        address,
        gender,
      }).unwrap();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update profile", err);
      setSaveError("Could not save profile changes. Please try again.");
    }
  }

  if (isLoading || status === "loading") {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 2xl:max-w-[1400px]">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative shrink-0">
              <Avatar className="size-28 border-2 border-white shadow-sm sm:size-32 dark:border-border">
                <AvatarImage src={avatarSrc} alt={fullName} />
                <AvatarFallback className="text-2xl">{fallbackInitials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                aria-label="Update profile photo"
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-green-600 text-white shadow-sm ring-2 ring-gray-50 transition-colors hover:bg-green-700 dark:bg-primary dark:ring-background"
              >
                <Pencil className="size-4" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl dark:text-foreground">
                {fullName}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {profile?.role ? `Role: ${profile.role}` : "Manage your account settings"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="border-0 p-0 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-foreground">
                  <User className="size-4 text-green-600 dark:text-primary" />
                  Personal Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Gender
                    </Label>
                    <Input
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      placeholder="e.g. Male, Female, Other"
                      className="h-11 rounded-full px-4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card className="border-0 p-0 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-foreground">
                  <Link2 className="size-4 text-green-600 dark:text-primary" />
                  Connected Accounts
                </h2>

                <div className="divide-y divide-neutral-100 dark:divide-border">
                  {connectedProviders.map(({ name, email, connected, icon }) => (
                    <div
                      key={name}
                      className="flex flex-col items-start justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200 bg-white dark:border-border">
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-foreground">
                            {name}
                          </p>
                          <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-full border-muted bg-muted/50 text-foreground cursor-default"
                      >
                        Connected
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="h-11 rounded-full bg-green-600 px-6 font-semibold text-white hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                {saveSuccess ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Saved
                  </span>
                ) : isSaving ? (
                  "Saving..."
                ) : (
                  "Save Changes"
                )}
              </Button>

              {saveError && (
                <p className="text-xs text-destructive">{saveError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}