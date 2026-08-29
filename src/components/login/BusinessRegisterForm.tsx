"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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

type BusinessCategory = {
  id: string;
  name: string;
  subCategories: Array<{
    id: string;
    name: string;
  }>;
};

function CustomBusinessTypeSelect({
  value,
  onChange,
  categories,
  isLoading,
  error,
  placeholder,
  loadingText,
}: {
  value: string;
  onChange: (val: string) => void;
  categories?: BusinessCategory[];
  isLoading?: boolean;
  error?: string;
  placeholder: string;
  loadingText: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let selectedLabel = placeholder;
  if (value && categories) {
    for (const parent of categories) {
      const found = parent.subCategories.find((sub) => sub.id === value);
      if (found) {
        selectedLabel = `${parent.name} • ${found.name}`;
        break;
      }
    }
  }

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "h-[48px] w-full rounded-[12px]",
          "border border-input bg-white px-5 pr-4 text-left",
          "font-body text-[16px]",
          "transition-all duration-200",
          "flex items-center justify-between gap-2",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          "dark:border-gray-400 dark:bg-background dark:focus-visible:ring-primary/30",
          value && !error
            ? "font-normal text-[#636b74] dark:text-white border-primary dark:border-primary"
            : "font-normal text-[#636b74] dark:text-gray-400",
          isOpen &&
            "border-primary ring-2 ring-primary/20 dark:border-primary",
          error &&
            "border-red-500 focus-visible:ring-red-500/30 dark:border-red-500",
        )}
      >
        <span className="truncate">
          {isLoading ? loadingText : selectedLabel}
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-[#636b74] transition-transform duration-200 dark:text-gray-300",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-1.5 max-h-[280px] w-full overflow-y-auto rounded-xl",
            "border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-lg",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            "dark:border-gray-700 dark:bg-[#1c2924] dark:shadow-2xl",
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-sm text-gray-500">
              <Loader2 className="mr-2 size-4 animate-spin" /> {loadingText}
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map((parent) => (
              <div key={parent.id} className="mb-2.5 last:mb-0">
                <div className="px-3 py-1.5 text-[15px] font-bold uppercase tracking-wider text-primary dark:text-primary-foreground">
                  {parent.name}
                </div>
                <div className="mt-1 grid gap-0.5">
                  {parent.subCategories.map((sub) => {
                    const isSelected = value === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          onChange(sub.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[15px] transition-colors",
                          "hover:bg-gray-100 hover:text-[#636b74] dark:hover:bg-gray-800 dark:hover:text-white",
                          isSelected
                            ? "bg-gray-100 font-normal text-[#636b74] dark:bg-gray-800 dark:text-white"
                            : "font-normal text-[#636b74] dark:text-gray-200",
                        )}
                      >
                        <span className="truncate">{sub.name}</span>
                        {isSelected && (
                          <Check className="size-4 shrink-0 text-[#636b74] dark:text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-sm text-gray-500">
              No categories found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BusinessRegisterForm({
  userData,
  onSubmitFinal,
  isSubmitting = false,
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
      className="grid gap-3.5 font-body text-foreground dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label={t("storeNameLabel")}
            density="figma"
            placeholder={t("storeNamePlaceholder")}
            error={errors.storeName?.message}
          />
        )}
      />

      <Controller
        name="businessType"
        control={control}
        render={({ field }) => (
          <div className="grid gap-1 font-body">
            <label className="grid gap-1.5 font-body">
              <span className="text-base font-semibold leading-none text-[#636b74] dark:text-white">
                {t("businessTypeLabel")}{" "}
                <span className="text-[#c24040] dark:text-red-400">*</span>
              </span>

              <CustomBusinessTypeSelect
                value={field.value}
                onChange={field.onChange}
                categories={categories}
                isLoading={isLoadingCategories}
                error={errors.businessType?.message}
                placeholder={t("selectBusinessType")}
                loadingText={t("loadingBusinessTypes")}
              />
            </label>

            {errors.businessType?.message && (
              <span className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.businessType.message}
              </span>
            )}
          </div>
        )}
      />

      <Controller
        name="businessEmail"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label={t("businessEmailLabel")}
            density="figma"
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
            density="figma"
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
          "mt-2 h-[50px] w-full rounded-[12px]",
          "text-[22px] font-semibold tracking-[1.32px]",
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

      <p className="mt-1 text-center text-[17px] leading-5 text-[#6b776f] dark:text-white">
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