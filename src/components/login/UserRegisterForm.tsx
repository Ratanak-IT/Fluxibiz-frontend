"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField, RegisterField } from "./RegisterForm";

const keycloakLoginUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL}`

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
    return (
        <form
            className="grid gap-3.5 font-sans"
            onSubmit={(event) => event.preventDefault()}
        >
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                <RegisterField
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="sokkhim"
                    required={false}
                />
                <RegisterField
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="khorm"
                    required={false}
                />
            </div>
            <RegisterField
                label="Phone number"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0976775439"
            />
            <RegisterField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="sokkhim@gmail.com"
                required={false}
            />
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                <PasswordField
                    label="Password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••••"
                    minLength={8}
                />
                <PasswordField
                    label="Confirm password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="••••••••••"
                    minLength={8}
                />
            </div>

            <label className="flex min-h-8 items-center gap-2 text-[15px] tracking-[0.6px] text-[#636b74]">
                <Checkbox required className="size-[18px] rounded-[2px]" />
                <span>I accept the Terms &amp; Conditions</span>
            </label>

            <Link href={"/register/business"}>
                <Button
                    type="submit"
                    className="h-[48px] w-full rounded-[11px] text-xl font-semibold tracking-[1.2px]"
                >
                    Register
                </Button>
            </Link>
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
                <Link href={keycloakLoginUrl} className="text-[#258bf1] hover:underline">
                    click here
                </Link>
            </p>
        </form>
    );
}
