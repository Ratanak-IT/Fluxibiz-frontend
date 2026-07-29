"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type RegisterFieldProps = React.ComponentProps<typeof Input> & {
    label: string;
    required?: boolean;
    density?: "compact" | "figma";
};

export function RegisterField({
    label,
    className,
    id: providedId,
    required = true,
    density = "compact",
    ...props
}: RegisterFieldProps) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
        <label
            htmlFor={id}
            className={cn(
                "grid font-sans",
                density === "figma" ? "gap-[15px]" : "gap-2.5",
            )}
        >
            <span
                className={cn(
                    "font-semibold leading-none text-[#636b74]",
                    density === "figma" ? "text-base" : "text-[15px]",
                )}
            >
                {label}{" "}
                {required ? <span className="text-[#c24040]">*</span> : null}
            </span>
            <Input
                id={id}
                required={required}
                className={cn(
                    "border-input bg-white text-[#636b74] shadow-none placeholder:text-[#636b74] focus-visible:ring-2",
                    density === "figma"
                        ? "h-[47px] rounded-[12px] px-5 py-2.5 text-base"
                        : "h-11 rounded-[11px] px-[18px] py-2 text-[15px]",
                    className,
                )}
                {...props}
            />
        </label>
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
                className="pr-14"
            />
            <button
                type="button"
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                onClick={() => setIsVisible((visible) => !visible)}
                className={cn(
                    "absolute bottom-0 right-0 grid place-items-center text-[#030712] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isFigma
                        ? "size-[47px] rounded-r-[12px]"
                        : "size-11 rounded-r-[11px]",
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

export function RegisterForm() {
    const router = useRouter();

    return (
        <form
            className="grid gap-2.5 font-sans"
            onSubmit={(event) => {
                event.preventDefault();
                router.push("/register/business");
            }}
        >
            <div className="grid gap-5 sm:grid-cols-[265px_265px] sm:justify-between sm:gap-[19px]">
                <RegisterField
                    label="First name"
                    density="figma"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Sokkhim"
                />
                <RegisterField
                    label="Last name"
                    density="figma"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Sokkhim"
                />
            </div>

            <RegisterField
                label="Phone Number"
                density="figma"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0998877666"
            />
            <RegisterField
                label="Email"
                density="figma"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Sokhim@gmail.com"
            />
            <PasswordField
                label="Password"
                density="figma"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••••••"
                minLength={8}
            />
            <PasswordField
                label="Confirm password"
                density="figma"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••••••"
                minLength={8}
            />

            <Button
                type="submit"
                className="mt-2 h-[50px] w-full rounded-[12px] text-[22px] font-semibold tracking-[1.32px]"
            >
                Continue
            </Button>

            <p className="mt-1 text-center text-[17px] leading-5 text-[#6b776f]">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring "
                >
                    Log in
                </Link>
            </p>
        </form>
    );
}
