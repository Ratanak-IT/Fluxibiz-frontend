"use client";

import { useState } from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

import { useUpdateMyProfileMutation } from "@/features/auth/telegramWebAppApi";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

/** Best-effort split of Telegram's single display name into first/last, just to pre-fill — both stay editable. */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

/**
 * Shown once, right after first login, blocking the shop until the customer
 * fills in everything the store needs to actually serve them — Telegram
 * only ever gives a name and a photo, never email, gender, phone, or an
 * address. Name is pre-filled from Telegram as a starting point but stays
 * editable, same as everything else here.
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
  onComplete: (data: {
    email: string;
    gender: string;
    phoneNumber: string;
    address: string;
  }) => void;
}) {
  const initialName = splitName(fullName);
  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = {
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
    };

    if (
      !trimmed.email ||
      !trimmed.firstName ||
      !trimmed.lastName ||
      !trimmed.gender ||
      !trimmed.phoneNumber ||
      !trimmed.address
    ) {
      setError("Please fill in every field before continuing.");
      return;
    }

    try {
      await updateMyProfile({ businessId, ...trimmed }).unwrap();
      onComplete({
        email: trimmed.email,
        gender: trimmed.gender,
        phoneNumber: trimmed.phoneNumber,
        address: trimmed.address,
      });
    } catch (cause) {
      // Temporary diagnostics — Telegram's mobile clients have no devtools,
      // so surfacing the actual status/body is the only way to see why the
      // save was rejected (validation vs. network vs. something else).
      const detail =
        cause && typeof cause === "object"
          ? JSON.stringify(cause).slice(0, 300)
          : String(cause);
      setError(`Couldn't save your info.\n\n[debug] ${detail}`);
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
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Gender</span>
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGender(option.value)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  gender === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
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

        {error && <p className="whitespace-pre-wrap text-sm text-destructive">{error}</p>}

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
