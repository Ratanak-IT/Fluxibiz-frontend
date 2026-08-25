"use client";

import { useState } from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

import { useUpdateMyProfileMutation } from "@/features/auth/telegramWebAppApi";

/**
 * Shown once, right after first login, blocking the shop until the customer
 * gives a phone number and delivery address — nothing here comes from
 * Telegram automatically. Name/avatar are read-only (from Telegram); phone
 * and address are plain manual fields.
 */
export function CompleteProfileScreen({
  businessId,
  businessName,
  fullName,
  photoUrl,
  onComplete,
}: {
  businessId: string;
  businessName: string;
  fullName: string;
  photoUrl?: string | null;
  onComplete: (data: { phoneNumber: string; address: string }) => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedPhone = phoneNumber.trim();
    const trimmedAddress = address.trim();
    if (!trimmedPhone || !trimmedAddress) {
      setError("Phone number and address are both required.");
      return;
    }

    try {
      await updateMyProfile({ businessId, phoneNumber: trimmedPhone, address: trimmedAddress }).unwrap();
      onComplete({ phoneNumber: trimmedPhone, address: trimmedAddress });
    } catch {
      setError("Couldn't save your info — check your connection and try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative size-16 overflow-hidden rounded-full bg-muted">
          {photoUrl ? (
            <Image src={photoUrl} alt={fullName} fill unoptimized sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserIcon className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">Welcome to {businessName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
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
            placeholder="e.g. 012 345 678"
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
            placeholder="Street, house number, area..."
            className="resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
