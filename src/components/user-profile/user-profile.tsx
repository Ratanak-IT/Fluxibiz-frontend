"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Pencil, User, Check, Loader2, Camera, Trash2, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useRemoveProfilePictureMutation,
} from "@/features/user/userApi";
import { resolveMediaUrl } from "@/lib/type/cartType";
import { toast } from "sonner";
import { UserProfileSkeleton } from "@/components/common/Skeletons";
import { validateEmailFormat } from "@/lib/validations/authSchema";

const userProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      if (!val || val.trim() === "") return;
      const res = validateEmailFormat(val);
      if (res !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: res,
        });
      }
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || val.trim().length >= 8,
      "Phone number must be at least 8 digits (e.g. +855 12 345 678)"
    ),
  address: z.string().optional(),
  gender: z.string().optional(),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

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
  const [removeProfilePicture, { isLoading: isDeletingPhoto }] =
    useRemoveProfilePictureMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      gender: "UNSPECIFIED",
    },
  });

  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");

  useEffect(() => {
    if (status === "unauthenticated") {
      login();
    }
  }, [status, login]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? user?.email ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.address ?? "",
        gender: profile.gender ? profile.gender.toUpperCase() : "UNSPECIFIED",
      });
    } else if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phoneNumber: "",
        address: "",
        gender: "UNSPECIFIED",
      });
    }
  }, [profile, user, reset]);

  // Handle local image file selection (Preview only, uploaded on Save Changes)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    toast.info("Photo selected. Click 'Save Changes' to update your profile.");
  }

  // Handle profile photo removal
  async function handleRemovePhoto() {
    try {
      await removeProfilePicture().unwrap();
      setSelectedFile(null);
      setImagePreview(null);
      toast.success("Profile photo removed.");
    } catch (err) {
      console.error("Failed to remove profile picture", err);
      setSaveError("Failed to remove profile picture.");
      toast.error("Failed to remove profile picture.");
    }
  }

  const fullName =
    [watchFirstName, watchLastName].filter(Boolean).join(" ") ||
    user?.name ||
    "User Profile";

  const resolvedApiAvatar = resolveMediaUrl(profile?.profilePicture);
  const avatarSrc =
    imagePreview ||
    (profile ? (resolvedApiAvatar || undefined) : (user?.image || undefined));

  const fallbackInitials = (fullName.slice(0, 2) || "UP").toUpperCase();
  const hasCustomPicture = Boolean(selectedFile || profile?.profilePicture);

  async function handleSaveChanges(data: UserProfileFormData) {
    setSaveError(null);
    setSaveSuccess(false);

    // Compare form values against current profile/user data to send ONLY changed fields
    const currentFirstName = profile?.firstName ?? user?.firstName ?? "";
    const currentLastName = profile?.lastName ?? user?.lastName ?? "";
    const currentPhone = profile?.phoneNumber ?? "";
    const currentAddress = profile?.address ?? "";
    const currentGender = (profile?.gender ?? "UNSPECIFIED").toUpperCase();

    const newFirstName = data.firstName?.trim() ?? "";
    const newLastName = data.lastName?.trim() ?? "";
    const newPhone = data.phoneNumber?.trim() ?? "";
    const newAddress = data.address?.trim() ?? "";
    const newGender = (data.gender ?? "UNSPECIFIED").toUpperCase();

    const isFirstNameChanged = newFirstName !== currentFirstName;
    const isLastNameChanged = newLastName !== currentLastName;
    const isPhoneChanged = newPhone !== currentPhone;
    const isAddressChanged = newAddress !== currentAddress;
    const isGenderChanged = newGender !== currentGender;
    const isFileChanged = Boolean(selectedFile);

    if (
      !isFirstNameChanged &&
      !isLastNameChanged &&
      !isPhoneChanged &&
      !isAddressChanged &&
      !isGenderChanged &&
      !isFileChanged
    ) {
      toast.info("No changes were made to your profile.");
      return;
    }

    try {
      await updateProfile({
        firstName: isFirstNameChanged ? (newFirstName || undefined) : undefined,
        lastName: isLastNameChanged ? (newLastName || undefined) : undefined,
        phoneNumber: isPhoneChanged ? (newPhone || undefined) : undefined,
        address: isAddressChanged ? (newAddress || undefined) : undefined,
        gender: isGenderChanged ? newGender : undefined,
        file: isFileChanged ? selectedFile : undefined,
      }).unwrap();

      setSelectedFile(null);
      setImagePreview(null);
      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to update profile", err);
      let errMsg = "Could not save profile changes. Please check your input.";

      if (typeof err?.data === "string") {
        errMsg = err.data;
      } else if (err?.data?.message && typeof err.data.message === "string") {
        errMsg = err.data.message;
      } else if (err?.data?.detail && typeof err.data.detail === "string") {
        errMsg = err.data.detail;
      } else if (err?.data?.error && typeof err.data.error === "string") {
        errMsg = err.data.error;
      } else if (err?.data?.errors && typeof err.data.errors === "object") {
        const firstKey = Object.keys(err.data.errors)[0];
        if (firstKey) {
          errMsg = `${firstKey}: ${err.data.errors[firstKey]}`;
        }
      } else if (err?.error && typeof err.error === "string") {
        errMsg = err.error;
      }

      setSaveError(errMsg);
      toast.error(errMsg);
    }
  }

  if (isLoading || status === "loading") {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 2xl:max-w-[1400px]">
        <div className="mx-auto max-w-3xl">
          {/* Header & Avatar Upload Section */}
          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="group relative shrink-0">
              <Avatar className="size-28 border-2 border-white shadow-md sm:size-32 dark:border-border">
                <AvatarImage src={avatarSrc} alt={fullName} className="object-cover" />
                <AvatarFallback className="bg-muted text-2xl font-bold">
                  {fallbackInitials}
                </AvatarFallback>
              </Avatar>

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload profile photo"
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-[#00932A] text-white shadow-md ring-2 ring-white transition-transform hover:scale-105 hover:bg-[#007d24] dark:ring-background"
              >
                <Camera className="size-4.5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-foreground">
                  {fullName}
                </h1>
                {profile?.role && (
                  <span className="rounded-full bg-[#00932A]/10 px-3 py-0.5 text-xs font-semibold text-[#00932A]">
                    {profile.role}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {profile?.email || user?.email || "Manage your account information and preferences"}
              </p>

              {/* Photo Actions */}
              <div className="mt-3 flex items-center gap-2">
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 gap-1.5 rounded-full border-gray-300 text-xs font-semibold hover:border-[#00932A] hover:text-[#00932A] dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-[#00932A] dark:hover:text-[#00932A]"
                >
                  <Pencil className="size-3.5" />
                  Change Photo
                </Button> */}

                {hasCustomPicture && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    disabled={isDeletingPhoto}
                    className="h-8 gap-1.5 rounded-full text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {isDeletingPhoto ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleSaveChanges)} className="space-y-6">
            {/* Personal Information Card */}
            <Card className="border border-neutral-200/80 p-0 shadow-sm dark:border-border dark:bg-card">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-foreground">
                  <User className="size-4.5 text-[#00932A]" />
                  Personal Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-xs font-semibold text-muted-foreground dark:text-neutral-300"
                    >
                      First Name
                    </Label>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="firstName"
                          placeholder="Enter first name"
                          className="h-11 rounded-full px-4 border-gray-200 dark:border-border dark:bg-card/80 dark:text-foreground dark:placeholder:text-neutral-500 focus-visible:ring-[#00932A]"
                        />
                      )}
                    />
                    {errors.firstName?.message && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-xs font-semibold text-muted-foreground dark:text-neutral-300"
                    >
                      Last Name
                    </Label>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="lastName"
                          placeholder="Enter last name"
                          className="h-11 rounded-full px-4 border-gray-200 dark:border-border dark:bg-card/80 dark:text-foreground dark:placeholder:text-neutral-500 focus-visible:ring-[#00932A]"
                        />
                      )}
                    />
                    {errors.lastName?.message && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold text-muted-foreground dark:text-neutral-300"
                    >
                      Email Address (Read-only)
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          disabled
                          placeholder="user@example.com"
                          className="h-11 rounded-full px-4 bg-neutral-100 text-neutral-500 opacity-80 cursor-not-allowed dark:bg-neutral-800/80 dark:text-neutral-400 dark:border-neutral-800"
                        />
                      )}
                    />
                    {errors.email?.message && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-xs font-semibold text-muted-foreground dark:text-neutral-300"
                    >
                      Phone Number
                    </Label>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="phoneNumber"
                          type="tel"
                          placeholder="+855 12 345 678"
                          className="h-11 rounded-full px-4 border-gray-200 dark:border-border dark:bg-card/80 dark:text-foreground dark:placeholder:text-neutral-500 focus-visible:ring-[#00932A]"
                        />
                      )}
                    />
                    {errors.phoneNumber?.message && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-xs font-semibold text-muted-foreground dark:text-neutral-300"
                    >
                      Gender
                    </Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <select
                            {...field}
                            id="gender"
                            className="h-11 w-full rounded-full border border-[#00932A] bg-white px-4 pr-12 text-sm font-medium text-slate-900 shadow-sm transition-colors outline-none appearance-none focus:border-[#00932A] focus:ring-2 focus:ring-[#00932A]/30 hover:bg-[#f3fcf5] dark:border-[#21B94B] dark:bg-card dark:text-white dark:hover:bg-[#132018]"
                          >
                            <option value="UNSPECIFIED" className="bg-white text-foreground dark:bg-card dark:text-white">Unspecified</option>
                            <option value="MALE" className="bg-white text-foreground dark:bg-card dark:text-white">Male</option>
                            <option value="FEMALE" className="bg-white text-foreground dark:bg-card dark:text-white">Female</option>
                            <option value="OTHER" className="bg-white text-foreground dark:bg-card dark:text-white">Other</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-xs font-semibold text-muted-foreground dark:text-neutral-300"
                    >
                      Address
                    </Label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="address"
                          placeholder="Phnom Penh, Cambodia"
                          className="h-11 rounded-full px-4 border-gray-200 dark:border-border dark:bg-card/80 dark:text-foreground dark:placeholder:text-neutral-500 focus-visible:ring-[#00932A]"
                        />
                      )}
                    />
                    {errors.address?.message && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.address.message}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card className="border border-neutral-200/80 p-0 shadow-sm dark:border-border dark:bg-card">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-foreground">
                  <Link2 className="size-4.5 text-[#00932A]" />
                  Connected Accounts
                </h2>

                <div className="divide-y divide-neutral-100 dark:divide-border">
                  {connectedProviders.map(({ name, email, icon }) => (
                    <div
                      key={name}
                      className="flex flex-col items-start justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-border dark:bg-card">
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-foreground">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground">{email}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-200 bg-gray-50 text-xs font-semibold text-neutral-700 cursor-default dark:border-border dark:bg-muted"
                      >
                        Connected
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Action & Alerts */}
            <div className="flex flex-col items-end gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 min-w-[140px] rounded-full bg-[#00932A] px-8 text-sm font-bold text-white shadow-sm hover:bg-[#007d24] focus-visible:ring-2 focus-visible:ring-[#00932A]"
              >
                {saveSuccess ? (
                  <span className="flex items-center gap-2">
                    <Check className="size-4 stroke-[3]" /> Saved Successfully
                  </span>
                ) : isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>

              {saveError && (
                <p className="text-xs font-medium text-destructive">{saveError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}