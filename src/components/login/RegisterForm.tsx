"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { cn } from "@/lib/utils";
import {
  userRegisterSchema,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

export type RegisterFieldProps =
  React.ComponentProps<typeof Input> & {
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
  ...props
}: RegisterFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className="grid gap-1 font-sans">
      <label
        htmlFor={id}
        className={cn(
          "grid font-sans",
          density === "figma" ? "gap-[10px]" : "gap-2.5",
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

        <Input
          id={id}
          className={cn(
            "border-input bg-white text-[#636b74] shadow-none",
            "placeholder:text-[#636b74]",
            "transition-colors",
            "focus-visible:ring-2",

            // Dark mode
            "dark:border-gray-400",
            "dark:bg-background",
            "dark:text-white",
            "dark:caret-white",
            "dark:placeholder:text-white",
            "dark:focus-visible:border-gray-400",
            "dark:focus-visible:ring-gray-400/30",

            density === "figma"
              ? "h-[47px] rounded-[12px] px-5 py-2.5 text-base"
              : "h-11 rounded-[11px] px-[18px] py-2 text-[15px]",

            error &&
              "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 dark:border-red-500 dark:focus-visible:border-red-500 dark:focus-visible:ring-red-500/30",

            className,
          )}
          {...props}
        />
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
  const isFigma = props.density === "figma";

  return (
    <div className="relative">
      <RegisterField
        {...props}
        type={isVisible ? "text" : "password"}
        className={cn("pr-14", props.className)}
      />

      <button
        type="button"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((visible) => !visible)}
        className={cn(
          "absolute bottom-0 right-0 grid place-items-center",
          "text-[#030712] transition-colors hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

          // White password icon in dark mode
          "dark:text-white dark:hover:text-primary",

          isFigma
            ? "size-[47px] rounded-r-[12px]"
            : "size-11 rounded-r-[11px]",

          props.error && "bottom-5",
        )}
      >
        {isVisible ? (
          <Eye className="size-5" aria-hidden="true" />
        ) : (
          <EyeOff className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
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
    if (onNext) {
      onNext(data);
    }
  };

  return (
    <form
      className="grid gap-3.5 font-sans text-foreground dark:text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-[19px]">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <RegisterField
              {...field}
              label="First name"
              density="figma"
              autoComplete="given-name"
              placeholder="Enter your first name"
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
              label="Last name"
              density="figma"
              autoComplete="family-name"
              placeholder="Enter your last name"
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
            label="Phone Number"
            density="figma"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Your Phone Number"
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
            label="Email"
            density="figma"
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
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
            label="Password"
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
            label="Confirm password"
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
        Continue
      </Button>

      <p className="mt-1 text-center text-[17px] leading-5 text-[#6b776f] dark:text-white">
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

            // Keep Login blue
            "dark:text-blue-400",
          )}
        >
          Log in
        </a>
      </p>
    </form>
  );
}