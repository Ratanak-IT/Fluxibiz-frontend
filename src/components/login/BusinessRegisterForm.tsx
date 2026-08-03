"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { RegisterField } from "./RegisterForm";
import { useAuth } from "@/features/auth/useAuth";
import {
  businessRegisterSchema,
  type BusinessRegisterFormData,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

const keycloakLoginUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL}`;

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

  const onSubmit = async (businessData: BusinessRegisterFormData) => {
    if (userData && onSubmitFinal) {
      await onSubmitFinal({ user: userData, business: businessData });
    }
  };

  return (
    <form className="grid gap-4 font-sans" onSubmit={handleSubmit(onSubmit)}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-primary transition-colors mb-1"
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
            <span className="text-[15px] font-semibold leading-none text-[#636b74]">
              Business type <span className="text-[#d14341]">*</span>
            </span>
            <span className="relative">
              <select
                {...field}
                className="h-11 w-full appearance-none rounded-[11px] border border-input bg-white px-[18px] pr-12 text-[15px] text-[#636b74] outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  Select your business type
                </option>
                <option value="retail">Retail</option>
                <option value="restaurant">Restaurant</option>
                <option value="service">Service</option>
                <option value="cafe">Café &amp; Bakery</option>
                <option value="other">Other</option>
              </select>
              <Image
                src="/image/auth/select-chevron.svg"
                alt=""
                width={15}
                height={10}
                className="pointer-events-none absolute right-5 top-1/2 h-[9.684px] w-[14.995px] -translate-y-1/2"
              />
            </span>
            {errors.businessType?.message && (
              <span className="text-xs font-medium text-red-500">
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
        className="mt-2 h-[48px] w-full rounded-[11px] text-xl font-semibold tracking-[1.2px]"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" /> Registering Business...
          </span>
        ) : (
          "Register Business"
        )}
      </Button>

      <p className="text-[#6b776f] text-center text-[17px] leading-6">
        Already have an account?{" "}
        <a
          href={loginHref}
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
          className="text-blue-600 font-bold hover:underline cursor-pointer focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Log in
        </a>
      </p>
    </form>
  );
}
