"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField, RegisterField } from "./RegisterForm";
import { useAuth } from "@/features/auth/useAuth";
import { useRegisterUserMutation } from "@/features/business-registration/businessApi";
import { cn } from "@/lib/utils";
import {
  userRegisterSchema,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

const SOCIAL_PROVIDERS = [
  {
    label: "Google",
    idp: "google",
    icon: "/image/auth/google.svg",
    width: 30,
    height: 30,
  },
  {
    label: "Facebook",
    idp: "facebook",
    icon: "/image/auth/facebook.svg",
    width: 35,
    height: 36,
  },
] as const;

import { useState } from "react";
import { AuthErrorBanner } from "./AuthErrorBanner";

export function UserRegisterForm() {
  const fieldsT = useTranslations("Register.fields");
  const userT = useTranslations("Register.user");
  const { login, loginHref } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UserRegisterFormData) => {
    setFormError(null);
    try {
      const userPayload = {
        username: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone,
        gender: "UNSPECIFIED",
        role: "CUSTOMER" as const,
      };

      await registerUser(userPayload).unwrap();

      toast.success(userT("registrationSuccess"));

      setTimeout(() => {
        login();
      }, 1200);
    } catch (err: unknown) {
      console.error("Failed to register customer account:", err);

      const apiError = err as {
        data?: {
          message?: string;
          error?: string;
          detail?: string;
        };
      };

      const errorMsg =
        apiError?.data?.message ||
        apiError?.data?.error ||
        apiError?.data?.detail ||
        userT("registrationFailed");

      toast.error(errorMsg);
    }
  };

  return (
    <form
      className="grid gap-3.5 font-body text-foreground dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <RegisterField
              {...field}
              label={fieldsT("firstName")}
              autoComplete="given-name"
              placeholder={userT("firstNamePlaceholder")}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <RegisterField
              {...field}
              label={fieldsT("lastName")}
              autoComplete="family-name"
              placeholder={userT("lastNamePlaceholder")}
              error={errors.lastName?.message}
            />
          )}
        />
      </div>

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label={fieldsT("phoneNumber")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={userT("phonePlaceholder")}
            error={errors.phone?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <RegisterField
            {...field}
            label={fieldsT("email")}
            type="email"
            autoComplete="email"
            placeholder={userT("emailPlaceholder")}
            error={errors.email?.message}
          />
        )}
      />

      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordField
              {...field}
              label={fieldsT("password")}
              autoComplete="new-password"
              placeholder="••••••••••"
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <PasswordField
              {...field}
              label={fieldsT("confirmPassword")}
              autoComplete="new-password"
              placeholder="••••••••••"
              error={errors.confirmPassword?.message}
            />
          )}
        />
      </div>

      <label
        className={cn(
          "flex min-h-8 items-center gap-2",
          "text-[15px] tracking-[0.6px]",
          "text-[#636b74] dark:text-white",
        )}
      >
        <Checkbox
          required
          className={cn(
            "size-[18px] rounded-[2px]",
            "border-gray-400",
            "dark:border-gray-400",
            "dark:bg-background",
            "dark:data-[state=checked]:border-primary",
            "dark:data-[state=checked]:bg-primary",
            "dark:data-[state=checked]:text-white",
          )}
        />

        <span>{userT("acceptTerms")}</span>
      </label>

      <Button
        type="submit"
        disabled={isRegistering}
        className={cn(
          "h-[48px] w-full rounded-[11px]",
          "text-xl font-semibold tracking-[1.2px]",
          "dark:text-white",
        )}
      >
        {isRegistering ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            {userT("registering")}
          </span>
        ) : (
          userT("register")
        )}
      </Button>

      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[#313131]/25 dark:bg-white/30" />

        <span className="text-base font-medium text-[#313131]/50 dark:text-white">
          {userT("orLoginWith")}
        </span>

        <span className="h-px flex-1 bg-[#313131]/25 dark:bg-white/30" />
      </div>

      <div className="grid gap-[10px] sm:grid-cols-2">
        {SOCIAL_PROVIDERS.map((provider) => (
          <button
            key={provider.label}
            type="button"
            onClick={() => login(undefined, provider.idp)}
            className={cn(
              "flex h-[50px] items-center justify-center gap-3",
              "rounded-[11px] border border-border",
              "bg-white text-sm font-medium text-[#636b74]",
              "transition-colors hover:bg-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "dark:border-gray-400",
              "dark:bg-background",
              "dark:text-white",
              "dark:hover:bg-white/10",
            )}
          >
            <Image
              src={provider.icon}
              alt=""
              width={provider.width}
              height={provider.height}
              className={
                provider.label === "Google"
                  ? "size-[30px]"
                  : "h-[35.937px] w-[35px]"
              }
            />

            {provider.label}
          </button>
        ))}
      </div>

      <p className="text-center text-base text-[#636b74] dark:text-white">
        {userT("alreadyHaveAccount")}{" "}
        <a
          href={loginHref}
          onClick={(event) => {
            event.preventDefault();
            login();
          }}
          className={cn(
            "cursor-pointer font-bold text-[#258bf1]",
            "hover:underline",
            "dark:text-blue-400",
          )}
        >
          {userT("login")}
        </a>
      </p>
    </form>
  );
}