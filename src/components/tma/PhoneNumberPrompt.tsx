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
import { useUpdateMyProfileMutation } from "@/features/auth/telegramWebAppApi";
import { updateTmaSession } from "@/lib/tma/tmaSession";
import { profileErrorMessage } from "@/lib/tma/profileErrorMessage";

/**
 * Mini App checkout no longer blocks first entry on a full profile form —
 * a phone number is the only thing the shop actually needs to fulfill an
 * order, so it's collected here, once, right before "Pay"/"Confirm Order"
 * instead of on first open.
 */
export function PhoneNumberPrompt({
  open,
  businessId,
  onSaved,
  onOpenChange,
}: {
  open: boolean;
  businessId: string;
  onSaved: (phoneNumber: string) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = phoneNumber.trim();
    if (!trimmed) {
      setError("Please enter a phone number to continue.");
      return;
    }

    setError(null);
    try {
      await updateMyProfile({ businessId, phoneNumber: trimmed }).unwrap();
      updateTmaSession({ phoneNumber: trimmed });
      onSaved(trimmed);
    } catch (cause) {
      setError(profileErrorMessage(cause, "Couldn't save your phone number — check your connection and try again."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Phone number required</DialogTitle>
            <DialogDescription>
              The shop needs a phone number to contact you about your order.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tma-phone-number" className="text-sm font-medium text-foreground">
              Phone number
            </label>
            <input
              id="tma-phone-number"
              type="tel"
              inputMode="tel"
              autoFocus
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
