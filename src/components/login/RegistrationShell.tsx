import Image from "next/image";
import type { ReactNode } from "react";

import registerIllustration from "../../../public/image/auth/register-illustration.png";
import { cn } from "@/lib/utils";

type RegistrationShellProps = {
    children: ReactNode;
    contentClassName?: string;
    variant?: "compact" | "figma";
};

export function RegistrationShell({
    children,
    contentClassName,
    variant = "compact",
}: RegistrationShellProps) {
    const isFigma = variant === "figma";

    return (
        <section className="registration-page fixed inset-0 z-50 overflow-y-auto bg-white transition-colors ">
    <div
        className={cn(
            "mx-auto flex min-h-full w-full items-center justify-center px-4 sm:px-8 md:px-10",
            isFigma
                ? "max-w-[1440px] py-4 lg:px-[100px]"
                : "max-w-[1360px] py-6 sm:py-7 lg:px-20",
        )}
    >
        <div
            className={cn(
                "grid w-full items-center bg-white shadow-[4px_4px_10px_4px_#e5e7eb] transition-colors",
                ")]",
                isFigma
                    ? "max-w-[1240px] gap-6 sm:gap-8 lg:gap-20 rounded-[16px] sm:rounded-[20px] lg:rounded-[25px] p-4 sm:p-6 lg:p-5 lg:h-[min(700px,calc(100dvh-32px))] lg:min-h-[650px] lg:grid-cols-[minmax(0,620px)_minmax(360px,513px)]"
                    : "max-w-[1120px] gap-6 sm:gap-8 lg:gap-16 rounded-[16px] sm:rounded-[20px] lg:rounded-[22px] p-4 sm:p-5 lg:p-[18px] lg:min-h-[700px] lg:grid-cols-[minmax(0,540px)_minmax(340px,460px)]",
            )}
        >
            <div
                className={cn(
                    "mx-auto w-full",
                    isFigma ? "max-w-[580px]" : "max-w-[520px]",
                    contentClassName,
                )}
            >
                <h1
                    className={cn(
                        "text-center font-bold text-primary ",
                        isFigma
                            ? "mb-2 sm:mb-3 text-xl sm:text-2xl md:text-[30px] tracking-[-0.6px]"
                            : "mb-4 sm:mb-6 text-lg sm:text-xl md:text-[27px] tracking-[-0.54px]",
                    )}
                >
                    Create Your Account
                </h1>
                {children}
            </div>

            <div
                className={cn(
                    "relative mx-auto hidden aspect-[512.828/523.867] w-full overflow-hidden lg:block",
                   
                    isFigma
                        ? "max-w-[513px] rounded-[25px]"
                        : "max-w-[460px] rounded-[22px]",
                )}
            >
                <Image
                    src={registerIllustration}
                    alt="Account security illustration"
                    width={645}
                    height={645}
                    priority
                    sizes="513px"
                    className="absolute left-[-12.92%] top-[-12.26%] h-[123.18%] w-[125.83%] max-w-none"
                />
            </div>
        </div>
    </div>
</section>
    );
}
