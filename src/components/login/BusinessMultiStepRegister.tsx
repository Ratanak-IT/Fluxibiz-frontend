"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { RegisterForm } from "./RegisterForm";
import { BusinessRegisterForm } from "./BusinessRegisterForm";
import {
  type UserRegisterFormData,
  type BusinessRegisterFormData,
} from "@/lib/validations/authSchema";
import { useRegisterUserMutation } from "@/features/business-registration/businessApi";

export function BusinessMultiStepRegister() {
  const t = useTranslations("Register.multiStep");

  const [step, setStep] = useState<1 | 2>(1);
  const [userData, setUserData] = useState<
    UserRegisterFormData | undefined
  >();

  const [registerUser, { isLoading: isRegisteringUser }] =
    useRegisterUserMutation();

  const isSubmitting = isRegisteringUser;

  const [formError, setFormError] = useState<string | null>(null);

  const handleNextStep = (data: UserRegisterFormData) => {
    setUserData(data);
    setFormError(null);
    setStep(2);

    toast.info(t("businessDetailsInfo"));
  };

  const handleFinalSubmit = async (data: {
    user: UserRegisterFormData;
    business: BusinessRegisterFormData;
  }) => {
    setFormError(null);
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

      toast.success(t("accountCreated"));

      setTimeout(() => {
        window.location.href =
          "https://bo-dashboard-ite-basic-lyart.vercel.app";
      }, 1500);
    } catch (err: unknown) {
      console.error("API Error during user registration:", err);

      const apiError = err as {
        data?: {
          message?: string;
          error?: string;
          detail?: string;
          errorDetail?: Array<{ field: string; message: string }>;
        };
      };

      let errorMsg = t("registrationFailed");

      if (apiError?.data?.errorDetail && apiError.data.errorDetail.length > 0) {
        errorMsg = apiError.data.errorDetail.map(e => e.message).join(", ");
      } else if (apiError?.data?.message) {
        errorMsg = apiError.data.message;
      } else if (apiError?.data?.error) {
        errorMsg = apiError.data.error;
      } else if (apiError?.data?.detail) {
        errorMsg = apiError.data.detail;
      }

      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 font-body text-foreground">
      {step === 1 && (
        <RegisterForm
          defaultValues={userData}
          onNext={handleNextStep}
        />
      )}

      {step === 2 && (
        <BusinessRegisterForm
          userData={userData}
          onBack={() => {
            setFormError(null);
            setStep(1);
          }}
          onSubmitFinal={handleFinalSubmit}
          isSubmitting={isSubmitting}
          formError={formError}
        />
      )}
    </div>
  );
}