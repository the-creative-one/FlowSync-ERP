import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message);

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset email",
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
          Forgot Password
        </h1>

        <p
          className="
            text-center
            mt-2
            text-gray-500
            dark:text-gray-400
          "
        >
          Enter your email to receive a reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
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
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-xl
                py-3
                pl-12
                pr-4
                bg-white
                dark:bg-[#1F2937]
                dark:text-white
                outline-none
                focus:border-[#1D546C]
              "
            />
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
            {loading ? "Sending..." : "Send Reset Link"}

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
          Remember your password?{" "}
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

export default ForgotPassword;