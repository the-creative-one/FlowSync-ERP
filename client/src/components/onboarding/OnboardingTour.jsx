import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const steps = [
  {
    title: "Welcome to FlowSync",
    description:
      "Your account starts with basic access by design. You can request additional permissions whenever you need them.",
  },
  {
    title: "Go to your Profile",
    description:
      "Open your Profile from the bottom of the sidebar. This is where you can manage your account and request additional access.",
  },
  {
    title: "Request Additional Access",
    description:
      "In your Profile, find the Request Additional Access section and choose the features you need.",
  },
  {
    title: "Wait for Approval",
    description:
      "Your request is reviewed by an authorized manager or admin. Until it is approved, the requested feature will remain unavailable.",
  },
  {
    title: "Your Sidebar Updates",
    description:
      "Once your permission is approved, FlowSync updates your access and the corresponding feature will appear in your sidebar.",
  },
  {
    title: "You're Ready",
    description:
      "That's it! Request the access you need, wait for approval, and start using the features available to your account.",
  },
];

function OnboardingTour({ onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onFinish?.();
      return;
    }

    setCurrentStep((previous) => previous + 1);
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const handleSkip = () => {
    onFinish?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={handleSkip}
          aria-label="Close onboarding"
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800 transition"
        >
          <X size={18} />
        </button>

        <div className="pr-8">
          <p className="text-sm font-medium text-[#1D546C] dark:text-[#6EB6D6]">
            FlowSync Guide
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0C2B4E] dark:text-white">
            {step.title}
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">
            {step.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-7">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-[#1D546C] dark:bg-blue-500"
                  : "w-2 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={isFirstStep}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={17} />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0C2B4E] hover:bg-[#16485c] text-white transition"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight size={17} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingTour;
