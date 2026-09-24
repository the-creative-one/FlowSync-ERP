import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import PageSEO from "../seo/PageSEO";
import toast from "react-hot-toast";
import api from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      return toast.error("Password is required");
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.",
      );
      return;
    }
    if (!confirmPassword.trim()) {
      return toast.error("Please confirm your password");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      setLoading(true);
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Reset Password | FlowSync"
        description="Create a new password and securely restore access to your FlowSync account."
        keywords="FlowSync, reset password, password recovery, account security"
      />
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#F4F7FA]
        dark:bg-[#020817]
        px-4
      "
      >
        <div className="fixed top-5 right-5">
          <ThemeToggle />
        </div>

        <div
          className="
          w-full
          max-w-md
          bg-white
          dark:bg-[#111827]
          rounded-xl
          shadow-xl
          border
          border-gray-100
          dark:border-gray-800
          p-8
        "
        >
          <h1
            className="
            text-3xl
            font-bold
            text-center
            text-[#0C2B4E]
            dark:text-white
          "
          >
            Reset Password
          </h1>

          <p
            className="
            text-center
            mt-2
            text-gray-500
            dark:text-gray-400
          "
          >
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* NEW PASSWORD */}

            <div className="relative">
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>

              <Lock
                size={18}
                aria-hidden="true"
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              />

              <input
                id="new-password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "password-error" : undefined}
                className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded
                py-3
                pl-12
                pr-12
                bg-white
                dark:bg-[#1F2937]
                dark:text-white
                outline-none
                focus:border-[#1D546C]
              "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p
                id="password-error"
                role="alert"
                className="text-sm text-red-500"
              >
                {error}
              </p>
            )}

            {/* CONFIRM PASSWORD */}

            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>

              <Lock
                size={18}
                aria-hidden="true"
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              />

              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded
                py-3
                pl-12
                pr-12
                bg-white
                dark:bg-[#1F2937]
                dark:text-white
                outline-none
                focus:border-[#1D546C]
              "
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-[#1D546C]
              hover:bg-[#16485c]
              text-white
              py-3
              rounded
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
            >
              {loading ? "Resetting..." : "Reset Password"}

              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>

          <p
            className="
            text-center
            mt-6
            text-gray-500
            dark:text-gray-400
          "
          >
            Back to{" "}
            <Link
              to="/"
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
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
