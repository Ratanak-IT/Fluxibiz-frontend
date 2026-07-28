"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RegisterField } from "./RegisterForm";

const keycloakLoginUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL}`

export function BusinessRegisterForm() {
    return (
        <form className="grid gap-4 font-sans" onSubmit={(event) => event.preventDefault()}>
            <RegisterField
                label="Store name"
                name="storeName"
                placeholder="Your Store name"
            />

            <label className="grid gap-2.5">
                <span className="text-[15px] font-semibold leading-none text-[#636b74]">
                    Business type <span className="text-[#d14341]">*</span>
                </span>
                <span className="relative">
                    <select
                        name="businessType"
                        required
                        defaultValue=""
                        className="h-11 w-full appearance-none rounded-[11px] border border-input bg-white px-[18px] pr-12 text-[15px] text-[#636b74] outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                        <option value="" disabled>
                            Select your business type
                        </option>
                        <option value="retail">Retail</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="service">Service</option>
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
            </label>

            <RegisterField
                label="Business Email"
                name="businessEmail"
                type="email"
                autoComplete="email"
                placeholder="Fill in your business email"
            />
            <RegisterField
                label="Business address"
                name="businessAddress"
                autoComplete="street-address"
                placeholder="No. 21C, Street 612, Phnom Penh"
            />

            <Button
                type="submit"
                className="h-[48px] w-full rounded-[11px] text-xl font-semibold tracking-[1.2px]"
            >
                Register
            </Button>

            <p className="text-center text-[17px] leading-6 text-[#6b776f]">
                Already have an account?{" "}
                <Link
                    href={keycloakLoginUrl}
                    className="text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Log in
                </Link>
            </p>
        </form>
    );
}
