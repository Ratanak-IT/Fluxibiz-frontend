import type { Metadata } from "next";

import { RegistrationShell } from "@/components/login/RegistrationShell";
import { BusinessMultiStepRegister } from "@/components/login/BusinessMultiStepRegister";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Business Registration | FluxiBiz",
    description: "Create your user account and business details on FluxiBiz.",
    alternates: {
        canonical: `${SITE_URL}/register/business`,
    },
};

export default function BusinessRegisterPage() {
    return (
        <RegistrationShell contentClassName="lg:-translate-y-4">
            <BusinessMultiStepRegister />
        </RegistrationShell>
    );
}
