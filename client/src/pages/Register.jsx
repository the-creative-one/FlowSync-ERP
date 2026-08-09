import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

import toast from "react-hot-toast";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // REGISTER STATE
  // --------------------------------------------------

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // --------------------------------------------------
  // VERIFICATION STATE
  // --------------------------------------------------

  const [showVerification, setShowVerification] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");

  const [verificationError, setVerificationError] = useState("");

  const [verifying, setVerifying] = useState(false);

  const [resending, setResending] = useState(false);

  const [timeLeft, setTimeLeft] = useState(180);

  // --------------------------------------------------
  // HANDLE INPUT
  // --------------------------------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  useEffect(() => {
    if (!showVerification || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showVerification, timeLeft]);

  // --------------------------------------------------
  // FORMAT TIMER
  // --------------------------------------------------

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setVerificationCode("");
      setVerificationError("");
      setTimeLeft(180);
      setShowVerification(true);

      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // --------------------------------------------------
  // VERIFY EMAIL
  // --------------------------------------------------

  const handleVerify = async (e) => {
    e.preventDefault();

    setVerificationError("");

    if (!verificationCode.trim()) {
      setVerificationError("Verification code is required");
      return;
    }

    if (verificationCode.trim().length !== 6) {
      setVerificationError("Enter the 6-digit verification code");
      return;
    }

    if (timeLeft <= 0) {
      setVerificationError(
        "This verification code has expired. Please request a new one.",
      );
      return;
    }

    try {
      setVerifying(true);

      await api.post("/auth/verify-email", {
        email: formData.email,
        code: verificationCode.trim(),
      });

      toast.success("Email verified successfully");

      navigate("/");
    } catch (error) {
      setVerificationError(
        error.response?.data?.message ||
          "Invalid verification code. Please try again.",
      );
    } finally {
      setVerifying(false);
    }
  };

  // --------------------------------------------------
  // RESEND CODE
  // --------------------------------------------------

  const handleResendCode = async () => {
    try {
      setResending(true);
      setVerificationError("");

      await api.post("/auth/resend-verification", {
        email: formData.email,
      });

      setVerificationCode("");
      setTimeLeft(180);

      toast.success("A new verification code has been sent");
    } catch (error) {
      setVerificationError(
        error.response?.data?.message || "Unable to resend verification code",
      );
    } finally {
      setResending(false);
    }
  };

  // --------------------------------------------------
  // GO BACK TO REGISTER
  // --------------------------------------------------

  const handleBackToRegister = () => {
    setShowVerification(false);
    setVerificationCode("");
    setVerificationError("");
    setTimeLeft(180);
  };

  return (
    <div
      className="
        min-h-screen
        flex
        bg-[#F4F7FA]
        dark:bg-[#020817]
        transition-colors
        duration-300
      "
    >
      {/* THEME TOGGLE */}

      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* LEFT SECTION */}

      <div
        className="
          hidden
          lg:flex
          w-1/2
          bg-[#0C2B4E]
          dark:bg-[#020617]
          text-white
          flex-col
          justify-center
          px-16
          relative
          overflow-hidden
          transition-colors
          duration-300
        "
      >
        {/* GLOW */}

        <div className="absolute top-0 left-0 w-72 h-72 bg-[#1D546C]/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* LOGO */}

          <div className="flex justify-center lg:justify-start mb-8">
            <Link to="/">
              <img
                src="/White-Logo.png"
                alt="FlowSync Logo"
                className="h-20 object-contain"
              />
            </Link>
          </div>

          {/* TEXT */}

          <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
            Join FlowSync ERP and streamline your business operations with a
            modern and scalable platform.
          </p>

          {/* FEATURES */}

          <div className="mt-10 space-y-4">
            <div
              className="
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                rounded-2xl
                p-5
                hover:translate-x-2
                transition
                duration-300
              "
            >
              🚀 Modern ERP Experience
            </div>

            <div
              className="
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                rounded-2xl
                p-5
                hover:translate-x-2
                transition
                duration-300
              "
            >
              🔒 Secure Authentication
            </div>

            <div
              className="
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                rounded-2xl
                p-5
                hover:translate-x-2
                transition
                duration-300
              "
            >
              📱 Fully Responsive UI
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div
        className="
          flex-1
          flex
          justify-center
          lg:items-center
          items-start
          pt-24
          pb-10
          md:pt-16
          md:pb-10
          lg:py-0
          px-4
          md:px-6
          relative
          overflow-y-auto
        "
      >
        {/* MOBILE LOGO */}

        <div className="lg:hidden fixed top-5 left-5 z-20">
          <Link to="/">
            <img
              src="/White-Logo.png"
              alt="FlowSync"
              className="w-10 h-10 object-contain opacity-90"
            />
          </Link>
        </div>

        {/* REGISTER / VERIFICATION CARD */}

        <div
          className="
            w-full
            max-w-md
            bg-white
            dark:bg-[#111827]
            rounded-3xl
            shadow-xl
            border
            border-gray-100
            dark:border-gray-800
            p-6
            md:p-8
            animate-fadeIn
            transition-colors
            duration-300
          "
        >
          {!showVerification ? (
            <>
              {/* REGISTER HEADER */}

              <div className="mb-8">
                <h2
                  className="
                    text-3xl
                    font-bold
                    text-[#0C2B4E]
                    dark:text-white
                    text-center
                  "
                >
                  Create Account
                </h2>

                <p
                  className="
                    text-gray-500
                    dark:text-gray-400
                    mt-2
                    text-center
                  "
                >
                  Create your FlowSync ERP account.
                </p>
              </div>

              {/* REGISTER FORM */}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* NAME */}

                <div>
                  <div className="relative">
                    <User
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`
                        w-full
                        border
                        rounded-xl
                        py-3
                        pl-12
                        pr-4
                        outline-none
                        transition
                        duration-300
                        bg-white
                        dark:bg-[#1F2937]
                        dark:text-white
                        dark:placeholder:text-gray-400

                        ${
                          errors.name
                            ? "border-red-400"
                            : `
                              border-gray-300
                              dark:border-gray-700
                              focus:border-[#1D546C]
                              dark:focus:border-blue-500
                            `
                        }
                      `}
                    />
                  </div>

                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}

                <div>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`
                        w-full
                        border
                        rounded-xl
                        py-3
                        pl-12
                        pr-4
                        outline-none
                        transition
                        duration-300
                        bg-white
                        dark:bg-[#1F2937]
                        dark:text-white
                        dark:placeholder:text-gray-400

                        ${
                          errors.email
                            ? "border-red-400"
                            : `
                              border-gray-300
                              dark:border-gray-700
                              focus:border-[#1D546C]
                              dark:focus:border-blue-500
                            `
                        }
                      `}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}

                <div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`
                        w-full
                        border
                        rounded-xl
                        py-3
                        pl-12
                        pr-12
                        outline-none
                        transition
                        duration-300
                        bg-white
                        dark:bg-[#1F2937]
                        dark:text-white
                        dark:placeholder:text-gray-400

                        ${
                          errors.password
                            ? "border-red-400"
                            : `
                              border-gray-300
                              dark:border-gray-700
                              focus:border-[#1D546C]
                              dark:focus:border-blue-500
                            `
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-[#0C2B4E]
                        dark:hover:text-white
                        transition
                      "
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}

                <div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`
                        w-full
                        border
                        rounded-xl
                        py-3
                        pl-12
                        pr-12
                        outline-none
                        transition
                        duration-300
                        bg-white
                        dark:bg-[#1F2937]
                        dark:text-white
                        dark:placeholder:text-gray-400

                        ${
                          errors.confirmPassword
                            ? "border-red-400"
                            : `
                              border-gray-300
                              dark:border-gray-700
                              focus:border-[#1D546C]
                              dark:focus:border-blue-500
                            `
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-[#0C2B4E]
                        dark:hover:text-white
                        transition
                      "
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  className="
                    w-full
                    bg-[#1D546C]
                    hover:bg-[#16485c]
                    dark:bg-blue-600
                    dark:hover:bg-blue-500
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    duration-300
                    hover:scale-[1.02]
                    active:scale-95
                  "
                >
                  Register
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* LOGIN */}

              <p
                className="
                  text-center
                  text-gray-500
                  dark:text-gray-400
                  mt-8
                "
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                    text-[#1D546C]
                    dark:text-blue-400
                    font-semibold
                    hover:underline
                  "
                >
                  Login
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* VERIFICATION HEADER */}

              <div className="mb-8 text-center">
                <div
                  className="
                    mx-auto
                    w-16
                    h-16
                    rounded-2xl
                    bg-[#1D546C]/10
                    dark:bg-blue-500/10
                    flex
                    items-center
                    justify-center
                    mb-5
                  "
                >
                  <ShieldCheck
                    size={32}
                    className="text-[#1D546C] dark:text-blue-400"
                  />
                </div>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-[#0C2B4E]
                    dark:text-white
                  "
                >
                  Verify Your Email
                </h2>

                <p
                  className="
                    text-gray-500
                    dark:text-gray-400
                    mt-2
                    leading-relaxed
                  "
                >
                  We sent a 6-digit verification code to
                </p>

                <p
                  className="
                    font-semibold
                    text-[#1D546C]
                    dark:text-blue-400
                    mt-1
                    break-all
                  "
                >
                  {formData.email}
                </p>
              </div>

              {/* VERIFICATION FORM */}

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <div className="relative">
                    <ShieldCheck
                      size={18}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                        setVerificationCode(value);
                        setVerificationError("");
                      }}
                      className={`
                        w-full
                        border
                        rounded-xl
                        py-3
                        pl-12
                        pr-4
                        outline-none
                        transition
                        duration-300
                        bg-white
                        dark:bg-[#1F2937]
                        dark:text-white
                        dark:placeholder:text-gray-400
                        text-center
                        tracking-[0.35em]
                        font-semibold

                        ${
                          verificationError
                            ? "border-red-400"
                            : `
                              border-gray-300
                              dark:border-gray-700
                              focus:border-[#1D546C]
                              dark:focus:border-blue-500
                            `
                        }
                      `}
                    />
                  </div>

                  {verificationError && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                      {verificationError}
                    </p>
                  )}
                </div>

                {/* TIMER */}

                <div className="text-center">
                  {timeLeft > 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Code expires in{" "}
                      <span className="font-semibold text-[#1D546C] dark:text-blue-400">
                        {formatTime()}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-500">
                      This verification code has expired.
                    </p>
                  )}
                </div>

                {/* VERIFY BUTTON */}

                <button
                  type="submit"
                  disabled={verifying || timeLeft <= 0}
                  className="
                    w-full
                    bg-[#1D546C]
                    hover:bg-[#16485c]
                    dark:bg-blue-600
                    dark:hover:bg-blue-500
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    duration-300
                    hover:scale-[1.02]
                    active:scale-95
                  "
                >
                  {verifying ? "Verifying..." : "Verify Email"}

                  {!verifying && <ArrowRight size={18} />}
                </button>

                {/* RESEND */}

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive the code?
                  </p>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resending}
                    className="
                      mt-2
                      inline-flex
                      items-center
                      gap-2
                      text-[#1D546C]
                      dark:text-blue-400
                      font-semibold
                      hover:underline
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    <RefreshCw
                      size={15}
                      className={resending ? "animate-spin" : ""}
                    />

                    {resending ? "Sending..." : "Resend Code"}
                  </button>
                </div>
              </form>

              {/* LOGIN */}

              <p
                className="
                  text-center
                  text-gray-500
                  dark:text-gray-400
                  mt-8
                "
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                    text-[#1D546C]
                    dark:text-blue-400
                    font-semibold
                    hover:underline
                  "
                >
                  Login
                </Link>
              </p>

              {/* BACK TO REGISTER */}

              <button
                type="button"
                onClick={handleBackToRegister}
                className="
                  block
                  mx-auto
                  mt-4
                  text-sm
                  text-gray-400
                  hover:text-[#1D546C]
                  dark:hover:text-blue-400
                  transition
                "
              >
                ← Change registration details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
