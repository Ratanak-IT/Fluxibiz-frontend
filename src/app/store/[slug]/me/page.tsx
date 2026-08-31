"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Receipt, User as UserIcon } from "lucide-react";

import { getTmaSession, updateTmaSession, type TmaSession } from "@/lib/tma/tmaSession";
import { useUpdateMyProfileMutation } from "@/features/auth/telegramWebAppApi";
import { profileErrorMessage } from "@/lib/tma/profileErrorMessage";
import { useIsMessenger } from "@/lib/tma/useIsMessenger";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

/**
 * The Mini App's "Me" tab — name and phone, editable any time (they might
 * type it wrong once, or change their number). Email is a synthetic address
 * Keycloak assigns automatically and was never something to show or edit
 * here; gender and delivery address were part of an older, fuller profile
 * form this app no longer collects since only a phone number is required to
 * order. Telegram's avatar stays read-only since it isn't set here either.
 */
export default function TmaMePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const isMessenger = useIsMessenger();
  const { queryParam } = useMiniAppMode();
  const [session, setSession] = useState<TmaSession | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  useEffect(() => {
    const current = getTmaSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(current);
    const { firstName: fn, lastName: ln } = splitName(current?.fullName ?? "");
    setFirstName(fn);
    setLastName(ln);
    setPhoneNumber(current?.phoneNumber ?? "");
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setError(null);
    setSaved(false);

    const trimmed = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    if (!trimmed.firstName || !trimmed.lastName || !trimmed.phoneNumber) {
      setError("Please fill in every field.");
      return;
    }

    try {
      const result = await updateMyProfile({ businessId: session.businessId, ...trimmed }).unwrap();
      updateTmaSession({
        fullName: result.fullName,
        phoneNumber: trimmed.phoneNumber,
      });
      setSaved(true);
    } catch (cause) {
      setError(profileErrorMessage(cause, "Couldn't save your info — check your connection and try again."));
    }
  }

  if (!session) {
    // A Messenger visitor who hasn't added to cart or checked out yet has
    // no session at all — `getTmaSession()` reads synchronously, so this
    // isn't a "still loading" state, it's genuinely "nothing to show yet."
    // Telegram always authenticates before browsing starts, so it never
    // lands here.
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <UserIcon className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No profile yet</p>
        <p className="text-sm text-muted-foreground">
          Add something to your cart or start checkout to set up your profile.
        </p>
        <Link
          href={`/store/${slug}?${queryParam}`}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-muted">
          {session.photoUrl ? (
            <Image
              src={session.photoUrl}
              alt={session.fullName}
              fill
              unoptimized
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserIcon className="size-7 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{session.fullName}</p>
          <p className="text-xs text-muted-foreground">
            Signed in with {isMessenger ? "Messenger" : "Telegram"}
          </p>
        </div>
      </div>

      <Link
        href={`/store/${session.businessSlug}/history?${queryParam}`}
        className="flex items-center justify-between rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-2.5">
          <Receipt className="size-4.5 text-muted-foreground" />
          Payment History
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
            Phone number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            inputMode="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {error && <p className="whitespace-pre-wrap text-sm text-destructive">{error}</p>}
        {saved && !error && <p className="text-sm text-primary">Saved.</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
