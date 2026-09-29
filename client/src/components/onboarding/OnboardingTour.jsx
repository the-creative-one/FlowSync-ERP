import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";

const steps = [
  {
    title: "Welcome to FlowSync",
    description:
      "Your account starts with basic access by design. You can request additional permissions whenever you need them.",
    target: "dashboard",
  },
  {
    title: "Go to your Profile",
    description:
      "Your Profile is where you can manage your account, view your permissions, and request additional access.",
    target: "profile",
  },
  {
    title: "Request Additional Access",
    description:
      "Choose the features you need from the Request Additional Access section.",
    target: "permission",
  },
  {
    title: "Wait for Approval",
    description:
      "Your request is reviewed by an authorized manager or admin. Until approval, the requested feature remains unavailable.",
    target: "permission",
  },
  {
    title: "You're Ready",
    description:
      "That's it! Request the access you need, wait for approval, and start using the features available to your account.",
    target: "permission",
  },
];

function OnboardingTour() {
  const navigate = useNavigate();
  const {
    isOnboardingActive,
    currentStep,
    nextStep,
    previousStep,
    completeOnboarding,
  } = useOnboarding();

  if (!isOnboardingActive) {
    return null;
  }

  const step = steps[currentStep] || steps[0];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      return;
    }

    if (currentStep === 0) {
      nextStep();
      navigate("/profile");
      return;
    }

    nextStep();
  };

  const handleClose = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div
        className="
      pointer-events-auto
      fixed
      top-1/2
      left-1/2
     md:left-[calc(50%+90px)]
      -translate-x-1/2
      -translate-y-1/2
          w-[calc(100%-2rem)]
          max-w-md
          rounded
          bg-white
          dark:bg-[#111827]
          border
          border-gray-200
          dark:border-gray-800
          shadow-2xl
          p-5
          sm:p-6
        "
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close onboarding"
          className="
            absolute
            top-3
            right-3
            p-2
            rounded-full
            text-gray-400
            hover:text-gray-700
            hover:bg-gray-100
            dark:hover:text-white
            dark:hover:bg-gray-800
            transition
          "
        >
          <X size={17} />
        </button>

        <div className="pr-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D546C] dark:text-[#6EB6D6]">
            FlowSync Guide
          </p>

          <h2 className="mt-1.5 text-lg font-bold text-[#0C2B4E] dark:text-white">
            {step.title}
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-6">
            {step.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-5">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-7 bg-[#1D546C] dark:bg-blue-500"
                  : "w-1.5 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previousStep}
              disabled={isFirstStep}
              className="
                flex
                items-center
                gap-1
                px-3
                py-2
                rounded
                border
                border-gray-200
                dark:border-gray-700
                text-gray-600
                dark:text-gray-300
                hover:bg-gray-50
                dark:hover:bg-gray-800
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition
                text-sm
              "
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="
                flex
                items-center
                gap-1
                px-4
                py-2
                rounded
                bg-[#0C2B4E]
                hover:bg-[#16485c]
                text-white
                transition
                text-sm
              "
            >
              {isLastStep ? "Finish" : "Next"}

              {!isLastStep && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingTour;
