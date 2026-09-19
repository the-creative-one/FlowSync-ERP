import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { login } = useAuth();

  //
  // VALIDATION
  //

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //
  // LOGIN
  //

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.token, response.data.user);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
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

      {/* LEFT PANEL */}

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

          <div className="flex justify-center lg:justify-start mb-4">
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
            Manage orders, operations, analytics and business workflows
            seamlessly in one powerful ERP platform.
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
              📦 Smart Order Management
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
              📊 Real-Time Analytics
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
              ⚡ Fast & Responsive Dashboard
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
          items-center
          pb-10
          pt-16
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
              className="w-40 h-10 object-contain opacity-90"
            />
          </Link>
        </div>

        {/* LOGIN CARD */}

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
          {/* HEADER */}

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
              Welcome Back
            </h2>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                mt-2
                text-center
              "
            >
              Login to continue managing your ERP system.
            </p>
          </div>

          {/* FORM */}

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
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
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.email}</p>
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }}
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

            {/* FORGOT PASSWORD */}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="
                  text-sm
                  text-[#1D546C]
                  dark:text-blue-400
                  hover:underline
                "
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}

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
              Login
              <ArrowRight size={18} />
            </button>
          </form>

          {/* REGISTER */}

          <p
            className="
              text-center
              text-gray-500
              dark:text-gray-400
              mt-8
            "
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="
                text-[#1D546C]
                dark:text-blue-400
                font-semibold
                hover:underline
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
