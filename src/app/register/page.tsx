import type { Metadata } from "next";

import RegisterComponent from "@/components/login/RegisterComponent";

export const metadata: Metadata = {
    title: "Create your account | FluxiBiz",
    description: "Create a FluxiBiz account to start managing your business.",
};

export default function RegisterPage() {
    return <RegisterComponent />;
}
