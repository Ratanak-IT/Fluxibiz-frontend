"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/lib/utils";
import {
  userRegisterSchema,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

export type RegisterFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  required?: boolean;
  density?: "compact" | "figma";
  error?: string;
};

export function RegisterField({
  label,
  className,
  id: providedId,
  required = true,
  density = "compact",
  error,
  isPassword = false,
  isVisible = false,
  onToggleVisibility,
  ...props
}: RegisterFieldProps & {
  isPassword?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className="grid gap-1 font-body">
      <label
        htmlFor={id}
        className={cn(
          "grid font-body gap-1.5",
        )}
      >
        <span
          className={cn(
            "font-semibold leading-none",
            "text-[#636b74] dark:text-white",
            density === "figma" ? "text-base" : "text-[15px]",
          )}
        >
          {label}{" "}
          {required ? (
            <span className="text-[#c24040] dark:text-red-400">*</span>
          ) : null}
        </span>

        <div className="relative flex items-center w-full">
          <Input
            id={id}
            className={cn(
              "font-body border-input bg-white text-[#636b74] shadow-none",
              "placeholder:font-body placeholder:text-[#636b74] placeholder:text-[16px]",
              "transition-colors",
              "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
              "dark:border-gray-400",
              "dark:bg-background",
              "dark:text-white",
              "dark:caret-white",
              "dark:placeholder:text-gray-400",
              "dark:focus-visible:border-primary dark:focus-visible:ring-primary/30",
              Boolean(props.value) && !error && "border-primary dark:border-primary",
              density === "figma"
                ? "h-[48px] rounded-[12px] px-5 py-2.5 text-[16px]"
                : "h-11 rounded-[11px] px-[18px] py-2 text-[16px]",
              isPassword && "pr-12",
              error &&
              "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 dark:border-red-500 dark:focus-visible:border-red-500 dark:focus-visible:ring-red-500/30",
              className,
            )}
            {...props}
          />

          {isPassword && onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              className="absolute right-3.5 flex h-full items-center justify-center text-gray-500 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-white"
            >
              {isVisible ? (
                <Eye className="size-5" aria-hidden="true" />
              ) : (
                <EyeOff className="size-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </label>

      {error && (
        <span className="text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}

type PasswordFieldProps = Omit<RegisterFieldProps, "type">;

export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <RegisterField
      {...props}
      type={isVisible ? "text" : "password"}
      isPassword
      isVisible={isVisible}
      onToggleVisibility={() => setIsVisible((prev) => !prev)}
    />
  );
}

interface RegisterFormProps {
  defaultValues?: Partial<UserRegisterFormData>;
  onNext?: (data: UserRegisterFormData) => void;
}

export function RegisterForm({
  defaultValues,
  onNext,
}: RegisterFormProps) {
  const fieldsT = useTranslations("Register.fields");
  const formT = useTranslations("Register.form");
  const { login, loginHref } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      password: defaultValues?.password ?? "",
      confirmPassword: defaultValues?.confirmPassword ?? "",
    },
  });

  const onSubmit = (data: UserRegisterFormData) => {
    onNext?.(data);
  };

  return (
    <form
      noValidate
      className="grid gap-3.5 font-body text-foreground dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid items-start gap-5 sm:grid-cols-2 sm:gap-[19px]">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <RegisterField
              {...field}
              label={fieldsT("firstName")}
              density="figma"
              autoComplete="given-name"
              placeholder={fieldsT("firstNamePlaceholder")}
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
              density="figma"
              autoComplete="family-name"
              placeholder={fieldsT("lastNamePlaceholder")}
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
            density="figma"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={fieldsT("phonePlaceholder")}
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
            density="figma"
            type="email"
            autoComplete="email"
            placeholder={fieldsT("emailPlaceholder")}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField
            {...field}
            label={fieldsT("password")}
            density="figma"
            autoComplete="new-password"
            placeholder="••••••••••••"
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
            density="figma"
            autoComplete="new-password"
            placeholder="••••••••••••"
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <Button
        type="submit"
        className={cn(
          "mt-2 h-[50px] w-full rounded-[12px]",
          "text-[22px] font-semibold tracking-[1.32px]",
          "dark:text-white",
        )}
      >
        {formT("continue")}
      </Button>

      <p className="mt-1 text-center text-[17px] leading-5 text-[#6b776f] dark:text-white">
        {formT("alreadyHaveAccount")}{" "}
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
          {formT("login")}
        </a>
      </p>
    </form>
  );
}