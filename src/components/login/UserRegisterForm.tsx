"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField, RegisterField } from "./RegisterForm";
import { useAuth } from "@/features/auth/useAuth";
import { useRegisterUserMutation } from "@/features/business-registration/businessApi";
import {
  userRegisterSchema,
  type UserRegisterFormData,
} from "@/lib/validations/authSchema";

const SOCIAL_PROVIDERS = [
  {
    label: "Google",
    icon: "/image/auth/google.svg",
    width: 30,
    height: 30,
  },
  {
    label: "Facebook",
    icon: "/image/auth/facebook.svg",
    width: 35,
    height: 36,
  },
] as const;

export function UserRegisterForm() {
  const { login, loginHref } = useAuth();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

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
        role: "CUSTOMER",
      };

      await registerUser(userPayload).unwrap();

      toast.success("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        login();
      }, 1200);
    } catch (err: any) {
      console.error("Failed to register customer account:", err);
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        err?.data?.detail ||
        "Registration failed. Please check your information and try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <form className="grid gap-3.5 font-sans" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <RegisterField
              {...field}
              label="First Name"
              autoComplete="given-name"
              placeholder="sokkhim"
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
              label="Last Name"
              autoComplete="family-name"
              placeholder="khorn"
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
            label="Phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0976775439"
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
            type="email"
            autoComplete="email"
            placeholder="sokkhim@gmail.com"
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
              label="Password"
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
              label="Confirm password"
              autoComplete="new-password"
              placeholder="••••••••••"
              error={errors.confirmPassword?.message}
            />
          )}
        />
      </div>

      <label className="flex min-h-8 items-center gap-2 text-[15px] tracking-[0.6px] text-[#636b74]">
        <Checkbox required className="size-[18px] rounded-[2px]" />
        <span>I accept the Terms &amp; Conditions</span>
      </label>

      <Button
        type="submit"
        disabled={isRegistering}
        className="h-[48px] w-full rounded-[11px] text-xl font-semibold tracking-[1.2px]"
      >
        {isRegistering ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-5 animate-spin" /> Registering...
          </span>
        ) : (
          "Register"
        )}
      </Button>

      <div className="flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[#313131]/25" />
        <span className="text-base font-medium text-[#313131]/50">
          Or login with
        </span>
        <span className="h-px flex-1 bg-[#313131]/25" />
      </div>

      <div className="grid gap-[10px] sm:grid-cols-2">
        {SOCIAL_PROVIDERS.map((provider) => (
          <button
            key={provider.label}
            type="button"
            onClick={() => login()}
            className="flex h-[50px] items-center justify-center gap-3 rounded-[11px] border border-border bg-white text-sm font-medium text-[#636b74] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      <p className="text-center text-base text-[#636b74]">
        Already signed up?{" "}
        <a
          href={loginHref}
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
          className="font-bold text-[#258bf1] hover:underline cursor-pointer"
        >
          click here
        </a>
      </p>
    </form>
  );
}
