"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthenticateFacebookDeviceMutation, type FacebookWebAppAuthResponse } from "@/features/auth/facebookWebAppApi";
import { getOrCreateDeviceId } from "@/lib/tma/messengerDeviceStore";
import { profileErrorMessage } from "@/lib/tma/profileErrorMessage";

/**
 * Messenger's identity is a lot thinner than Telegram's: `getContext()` /
 * `signed_request` turned out to be unreliable in practice (Facebook-side
 * errors that never resolved), and even when it worked the Graph API name
 * lookup behind it quietly fell back to the literal placeholder "Facebook
 * User" whenever Meta's permissions didn't allow reading the real profile —
 * common. So the Mini App no longer attempts Facebook identity at all: this
 * asks for name and phone directly, once per device, right before the
 * customer can add to cart or pay, and registers a fresh session via
 * `/facebook-webapp/device-auth` (no prior token needed — there isn't one
 * yet the first time this runs).
 */
export function MessengerProfilePrompt({
  open,
  businessId,
  onSaved,
  onOpenChange,
}: {
  open: boolean;
  businessId: string;
  onSaved: (result: FacebookWebAppAuthResponse) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authenticateDevice, { isLoading }] = useAuthenticateFacebookDeviceMutation();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedPhone) {
      setError("Please fill in both your name and phone number to continue.");
      return;
    }

    setError(null);
    try {
      const result = await authenticateDevice({
        businessId,
        deviceId: getOrCreateDeviceId(),
        fullName: trimmedName,
        phoneNumber: trimmedPhone,
      }).unwrap();
      onSaved(result);
    } catch (cause) {
      setError(profileErrorMessage(cause, "Couldn't save your info — check your connection and try again."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>A couple of details first</DialogTitle>
            <DialogDescription>
              The shop needs your name and phone number to know who&apos;s ordering and to reach you about it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="messenger-name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="messenger-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="messenger-phone" className="text-sm font-medium text-foreground">
              Phone number
            </label>
            <input
              id="messenger-phone"
              type="tel"
              inputMode="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="e.g. 012 345 678"
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {error && <p className="whitespace-pre-wrap text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
