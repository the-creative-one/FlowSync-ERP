import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      return toast.error("Password is required");
    }

    if (password.length < 6) {
      return toast.error(
        "Password must be at least 6 characters",
      );
    }

    if (password !== confirmPassword) {
      return toast.error(
        "Passwords do not match",
      );
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        },
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
          rounded-3xl
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

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          {/* NEW PASSWORD */}

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
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-xl
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
              onClick={() =>
                setShowPassword(
                  !showPassword,
                )
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}

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
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value,
                )
              }
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-xl
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
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword,
                )
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
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
              rounded-xl
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}

            <ArrowRight size={18} />
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
  );
}

export default ResetPassword;