"use client";

import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/lib/utils";
import {
  businessRegisterSchema,
  type BusinessRegisterFormData,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

import { RegisterField } from "./RegisterForm";

interface BusinessRegisterFormProps {
  userData?: UserRegisterFormData;
  onBack?: () => void;

  onSubmitFinal?: (data: {
    user: UserRegisterFormData;
    business: BusinessRegisterFormData;
  }) => Promise<void>;

  isSubmitting?: boolean;
}

export function BusinessRegisterForm({
  userData,
  onBack,
  onSubmitFinal,
  isSubmitting = false,
}: BusinessRegisterFormProps) {
  const { login, loginHref } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessRegisterFormData>({
    resolver: zodResolver(businessRegisterSchema),

    defaultValues: {
      storeName: "",
      businessType: "",
      businessEmail: userData?.email ?? "",
      businessAddress: "",
      description: "",
    },
  });

  const onSubmit = async (
    businessData: BusinessRegisterFormData,
  ) => {
    if (userData && onSubmitFinal) {
      await onSubmitFinal({
        user: userData,
        business: businessData,
      });
    }
  };

  return (
    <form
      className="grid gap-4 font-sans text-foreground"
      onSubmit={handleSubmit(onSubmit)}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "mb-1 flex w-fit items-center gap-1.5",
            "text-sm font-semibold",
            "text-neutral-600 transition-colors hover:text-primary",
            "focus-visible:rounded-md focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "dark:text-white dark:hover:text-primary",
          )}
        >
          <ArrowLeft className="size-4" />
          Back to User Account
        </button>
      )}

      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label="Store name"
            placeholder="Your Store name"
            error={errors.storeName?.message}
          />
        )}
      />

      <Controller
        name="businessType"
        control={control}
        render={({ field }) => (
          <label className="grid gap-1.5">
            <span className="text-[15px] font-semibold leading-none text-[#636b74] dark:text-white">
              Business type{" "}
              <span className="text-[#d14341] dark:text-red-400">*</span>
            </span>

            <span className="relative">
              <select
  {...field}
  className={cn(
    "h-11 w-full appearance-none rounded-[11px]",
    "border border-input bg-white px-[18px] pr-12",
    "text-[15px] text-[#636b74]",
    "outline-none transition-colors",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",

    "dark:border-gray-400",
    "dark:bg-background",
    "dark:text-white",
    "dark:focus-visible:border-gray-400",
    "dark:focus-visible:ring-gray-400/30",

    errors.businessType &&
      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30 dark:border-red-500",
  )}
>
  <option
    value=""
    disabled
    className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
  >
    Select your business type
  </option>

  <option
    value="retail"
    className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
  >
    Retail
  </option>

  <option
    value="restaurant"
    className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
  >
    Restaurant
  </option>

  <option
    value="service"
    className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
  >
    Service
  </option>

  <option
    value="cafe"
    className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
  >
    Café &amp; Bakery
  </option>

  <option
    value="other"
    className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
  >
    Other
  </option>
</select>

              <Image
                src="/image/auth/select-chevron.svg"
                alt=""
                width={15}
                height={10}
                className={cn(
                  "pointer-events-none absolute right-5 top-1/2",
                  "h-[9.684px] w-[14.995px] -translate-y-1/2",
                  "dark:brightness-0 dark:invert dark:opacity-60",
                )}
              />
            </span>

            {errors.businessType?.message && (
              <span className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.businessType.message}
              </span>
            )}
          </label>
        )}
      />

      <Controller
        name="businessEmail"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label="Business Email"
            type="email"
            autoComplete="email"
            placeholder="Fill in your business email"
            error={errors.businessEmail?.message}
          />
        )}
      />

      <Controller
        name="businessAddress"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label="Business address"
            autoComplete="street-address"
            placeholder="No. 21C, Street 612, Phnom Penh"
            error={errors.businessAddress?.message}
          />
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "mt-2 h-[48px] w-full rounded-[11px]",
          "text-xl font-semibold tracking-[1.2px]",
          "dark:text-white",
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            Registering Business...
          </span>
        ) : (
          "Register Business"
        )}
      </Button>

      <p className="text-center text-[17px] leading-6 text-[#6b776f] dark:text-white">
        Already have an account?{" "}
        <a
          href={loginHref}
          onClick={(event) => {
            event.preventDefault();
            login();
          }}
          className={cn(
            "cursor-pointer font-bold text-blue-600 hover:underline",
            "focus-visible:rounded-sm focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "dark:text-blue-400",
          )}
        >
          Log in
        </a>
      </p>
    </form>
  );
}