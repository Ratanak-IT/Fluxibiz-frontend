import type { Metadata } from "next";

import { RegistrationShell } from "@/components/login/RegistrationShell";
import { UserRegisterForm } from "@/components/login/UserRegisterForm";

export const metadata: Metadata = {
    title: "User registration | FluxiBiz",
    description: "Create your FluxiBiz user account.",
};

export default function UserRegisterPage() {
    return (
        <RegistrationShell contentClassName="max-w-[575px]">
            <UserRegisterForm />
        </RegistrationShell>
    );
}
