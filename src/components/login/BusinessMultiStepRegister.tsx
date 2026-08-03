"use client";

import { useState } from "react";
import { toast } from "sonner";

import { RegisterForm } from "./RegisterForm";
import { BusinessRegisterForm } from "./BusinessRegisterForm";
import { useAuth } from "@/features/auth/useAuth";
import {
  type UserRegisterFormData,
  type BusinessRegisterFormData,
} from "@/lib/validations/authSchema";
import {
  useRegisterUserMutation,
  useCreateBusinessMutation,
} from "@/features/business-registration/businessApi";

export function BusinessMultiStepRegister() {
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);

  const [userData, setUserData] = useState<
    UserRegisterFormData | undefined
  >();

  const [registerUser, { isLoading: isRegisteringUser }] =
    useRegisterUserMutation();

  const [createBusiness, { isLoading: isCreatingBusiness }] =
    useCreateBusinessMutation();

  const isSubmitting = isRegisteringUser || isCreatingBusiness;

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
      // Step 1: Register user account on Keycloak / Backend
      const userPayload = {
        username: data.user.email,
        password: data.user.password,
        confirmPassword: data.user.confirmPassword,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phoneNumber: data.user.phone,
        gender: "UNSPECIFIED",
        role: "BUSINESS",
      };

      await registerUser(userPayload).unwrap();

      // Step 2: Attempt business record creation.
      // This endpoint may require an active JWT session token.
      try {
        const businessPayload = {
          name: data.business.storeName,
          email: data.business.businessEmail,
          address: data.business.businessAddress,
        };

        await createBusiness(businessPayload).unwrap();
      } catch (bizErr: unknown) {
        console.warn("Store creation pending user session:", bizErr);
      }

      toast.success(
        "Account created successfully! Redirecting to login...",
      );

      setTimeout(() => {
        login();
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
      {/* User Account Registration */}
      {step === 1 && (
        <RegisterForm
          defaultValues={userData}
          onNext={handleNextStep}
        />
      )}

      {/* Business Information Registration */}
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