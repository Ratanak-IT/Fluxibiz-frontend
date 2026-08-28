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
import { useUpdateMyPhoneNumberMutation } from "@/features/checkout/checkoutApi";
import { updateTmaSession } from "@/lib/tma/tmaSession";
import { profileErrorMessage } from "@/lib/tma/profileErrorMessage";

/** Best-effort split of one name field into first/last for the backend's separate columns. */
function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

/**
 * Messenger's identity is a lot thinner than Telegram's: `getContext()` only
 * ever hands back a psid, and the Graph API name lookup that fills in for it
 * quietly falls back to the literal placeholder "Facebook User" whenever
 * Meta's permissions don't allow reading the real profile — which is common.
 * So unlike Telegram's checkout (phone only), Messenger asks for both name
 * and phone, once, right before the customer can add to cart or pay.
 */
export function MessengerProfilePrompt({
  open,
  businessId,
  defaultName,
  onSaved,
  onOpenChange,
}: {
  open: boolean;
  businessId: string;
  defaultName?: string;
  onSaved: (data: { fullName: string; phoneNumber: string }) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(defaultName && defaultName !== "Facebook User" ? defaultName : "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [updateProfile, { isLoading }] = useUpdateMyPhoneNumberMutation();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedPhone) {
      setError("Please fill in both your name and phone number to continue.");
      return;
    }

    setError(null);
    const { firstName, lastName } = splitName(trimmedName);
    try {
      await updateProfile({ businessId, phoneNumber: trimmedPhone, firstName, lastName }).unwrap();
      updateTmaSession({ phoneNumber: trimmedPhone, fullName: trimmedName });
      onSaved({ fullName: trimmedName, phoneNumber: trimmedPhone });
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
