"use client";

import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { useGetBusinessCategoriesQuery } from "@/features/business-registration/businessApi";
import { cn } from "@/lib/utils";
import {
  businessRegisterSchema,
  type BusinessRegisterFormData,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

import { RegisterField } from "./RegisterForm";

import { AuthErrorBanner } from "./AuthErrorBanner";

interface BusinessRegisterFormProps {
  userData?: UserRegisterFormData;
  onBack?: () => void;

  onSubmitFinal?: (data: {
    user: UserRegisterFormData;
    business: BusinessRegisterFormData;
  }) => Promise<void>;

  isSubmitting?: boolean;
  formError?: string | null;
}

export function BusinessRegisterForm({
  userData,
  onBack,
  onSubmitFinal,
  isSubmitting = false,
  formError,
}: BusinessRegisterFormProps) {
  const t = useTranslations("Register.business");
  const { login, loginHref } = useAuth();

  const { data: categories, isLoading: isLoadingCategories } =
    useGetBusinessCategoriesQuery();

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
      className="grid gap-4 font-body text-foreground"
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
          {t("backToUserAccount")}
        </button>
      )}

      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label={t("storeNameLabel")}
            placeholder={t("storeNamePlaceholder")}
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
              {t("businessTypeLabel")}{" "}
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
                  {isLoadingCategories
                    ? t("loadingBusinessTypes")
                    : t("selectBusinessType")}
                </option>

                {categories?.map((parent) =>
                  parent.subCategories.length > 0 ? (
                    <optgroup key={parent.id} label={parent.name}>
                      {parent.subCategories.map((sub) => (
                        <option
                          key={sub.id}
                          value={sub.id}
                          className="bg-white text-[#636b74] dark:bg-[#2d302f] dark:text-white"
                        >
                          {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : null,
                )}
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
            label={t("businessEmailLabel")}
            type="email"
            autoComplete="email"
            placeholder={t("businessEmailPlaceholder")}
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
            label={t("businessAddressLabel")}
            autoComplete="street-address"
            placeholder={t("businessAddressPlaceholder")}
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
            {t("registeringBusiness")}
          </span>
        ) : (
          t("registerBusiness")
        )}
      </Button>

      <p className="text-center text-[17px] leading-6 text-[#6b776f] dark:text-white">
        {t("alreadyHaveAccount")}{" "}
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
          {t("login")}
        </a>
      </p>
    </form>
  );
}