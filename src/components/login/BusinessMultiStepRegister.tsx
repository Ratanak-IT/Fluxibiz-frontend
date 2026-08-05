"use client";

import { useState } from "react";
import { toast } from "sonner";

import { RegisterForm } from "./RegisterForm";
import { BusinessRegisterForm } from "./BusinessRegisterForm";
import {
  type UserRegisterFormData,
  type BusinessRegisterFormData,
} from "@/lib/validations/authSchema";
import {
  useRegisterUserMutation,
} from "@/features/business-registration/businessApi";

export function BusinessMultiStepRegister() {
  const [step, setStep] = useState<1 | 2>(1);

  const [userData, setUserData] = useState<
    UserRegisterFormData | undefined
  >();

  const [registerUser, { isLoading: isRegisteringUser }] =
    useRegisterUserMutation();

  const isSubmitting = isRegisteringUser;

  const handleNextStep = (data: UserRegisterFormData) => {
    setUserData(data);
    setStep(2);

    toast.info(
      "Please enter your business details to complete registration.",
    );
  };

  const handleFinalSubmit = async (data: {
    user: UserRegisterFormData;
    business: BusinessRegisterFormData;
  }) => {
    try {
      const userPayload = {
        username: data.user.email,
        password: data.user.password,
        confirmPassword: data.user.confirmPassword,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phoneNumber: data.user.phone,
        gender: "UNSPECIFIED",
        role: "BUSINESS" as const,
        businessName: data.business.storeName,
        businessAddress: data.business.businessAddress,
        businessCategoryId: data.business.businessType,
      };

      await registerUser(userPayload).unwrap();

      toast.success("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "https://bo-dashboard-ite-basic-lyart.vercel.app";
      }, 1500);
    } catch (err: any) {
      console.error("API Error during user registration:", err);

      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        err?.data?.detail ||
        "Registration failed. Please check your information and try again.";

      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      {step === 1 && (
        <RegisterForm
          defaultValues={userData}
          onNext={handleNextStep}
        />
      )}

      {step === 2 && (
        <BusinessRegisterForm
          userData={userData}
          onBack={() => setStep(1)}
          onSubmitFinal={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}