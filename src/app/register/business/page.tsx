import type { Metadata } from "next";

import { BusinessRegisterForm } from "@/components/login/BusinessRegisterForm";
import { RegistrationShell } from "@/components/login/RegistrationShell";

export const metadata: Metadata = {
    title: "Business details | FluxiBiz",
    description: "Add your store details to finish creating your account.",
};

export default function BusinessRegisterPage() {
    return (
        <RegistrationShell contentClassName="lg:-translate-y-4">
            <BusinessRegisterForm />
        </RegistrationShell>
    );
}
