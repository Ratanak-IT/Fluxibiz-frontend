"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

import { getTmaSession, updateTmaSession, type TmaSession } from "@/lib/tma/tmaSession";
import { useUpdateMyProfileMutation } from "@/features/auth/telegramWebAppApi";

/**
 * The Mini App's "Me" tab — Telegram identity is read-only (comes from
 * Telegram, not something the customer sets here); phone/address are the
 * same fields CompleteProfileScreen first collected, editable any time
 * (they might type it wrong once, or move).
 */
export default function TmaMePage() {
  const [session, setSession] = useState<TmaSession | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  useEffect(() => {
    const current = getTmaSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(current);
    setPhoneNumber(current?.phoneNumber ?? "");
    setAddress(current?.address ?? "");
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setError(null);
    setSaved(false);

    const trimmedPhone = phoneNumber.trim();
    const trimmedAddress = address.trim();
    if (!trimmedPhone || !trimmedAddress) {
      setError("Phone number and address are both required.");
      return;
    }

    try {
      await updateMyProfile({
        businessId: session.businessId,
        phoneNumber: trimmedPhone,
        address: trimmedAddress,
      }).unwrap();
      updateTmaSession({ phoneNumber: trimmedPhone, address: trimmedAddress });
      setSaved(true);
    } catch {
      setError("Couldn't save your info — check your connection and try again.");
    }
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading...
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
          <p className="text-xs text-muted-foreground">Signed in with Telegram</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-foreground">
            Delivery address
          </label>
          <textarea
            id="address"
            rows={3}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
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
