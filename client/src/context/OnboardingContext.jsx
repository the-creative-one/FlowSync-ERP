import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const { user, loading: authLoading, fetchUser } = useAuth();

  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (authLoading || !user) {
      setIsOnboardingActive(false);
      return;
    }
    if (!user.hasCompletedOnboarding) {
      setIsOnboardingActive(true);
    } else {
      setIsOnboardingActive(false);
    }
  }, [user, authLoading]);

  const completeOnboarding = async () => {
    try {
      await api.patch("/auth/onboarding");
      setIsOnboardingActive(false);
      await fetchUser();
    } catch (error) {
      console.error(
        "Unable to complete onboarding:",
        error.response?.data || error.message,
      );
    }
  };

  const nextStep = () => {
    setCurrentStep((previous) => previous + 1);
  };

  const previousStep = () => {
    setCurrentStep((previous) => Math.max(0, previous - 1));
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingActive,
        currentStep,
        setCurrentStep,
        nextStep,
        previousStep,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
