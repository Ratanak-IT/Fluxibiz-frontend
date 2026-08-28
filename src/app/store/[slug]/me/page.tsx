"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Receipt, User as UserIcon } from "lucide-react";

import { getTmaSession, updateTmaSession, type TmaSession } from "@/lib/tma/tmaSession";
import { useUpdateMyProfileMutation } from "@/features/auth/telegramWebAppApi";
import { profileErrorMessage } from "@/lib/tma/profileErrorMessage";
import { useIsMessenger } from "@/lib/tma/useIsMessenger";
import { useMiniAppMode } from "@/lib/tma/useMiniAppMode";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

/**
 * The Mini App's "Me" tab — everything CompleteProfileScreen first
 * collected (name, email, gender, phone, address), editable any time
 * (they might type it wrong once, move, or change their mind). Telegram's
 * avatar stays read-only since it isn't something set here.
 */
export default function TmaMePage() {
  const isMessenger = useIsMessenger();
  const { queryParam } = useMiniAppMode();
  const [session, setSession] = useState<TmaSession | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
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
    setEmail(current?.email ?? "");
    setGender(current?.gender ?? "");
    setPhoneNumber(current?.phoneNumber ?? "");
    setAddress(current?.address ?? "");
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    setError(null);
    setSaved(false);

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
      setError("Please fill in every field.");
      return;
    }

    try {
      const result = await updateMyProfile({ businessId: session.businessId, ...trimmed }).unwrap();
      updateTmaSession({
        fullName: result.fullName,
        email: trimmed.email,
        gender: trimmed.gender,
        phoneNumber: trimmed.phoneNumber,
        address: trimmed.address,
      });
      setSaved(true);
    } catch (cause) {
      setError(profileErrorMessage(cause, "Couldn't save your info — check your connection and try again."));
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
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
