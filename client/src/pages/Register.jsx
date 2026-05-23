import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    // Password Validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully");

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F7FA]">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-[#0C2B4E] text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#1D546C]/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex justify-center lg:justify-start mb-8">
            <img
              src="/FS Logo-transparent.png"
              alt="FlowSync Logo"
              className="h-20 object-contain"
            />
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
            Join FlowSync ERP and streamline your business operations with a
            modern and scalable platform.
          </p>

          <div className="mt-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:translate-x-2 transition duration-300">
              🚀 Modern ERP Experience
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:translate-x-2 transition duration-300">
              🔒 Secure Authentication
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:translate-x-2 transition duration-300">
              📱 Fully Responsive UI
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center lg:items-center items-start pt-24 pb-10 md:pt-16 md:pb-10 lg:py-0 px-4 md:px-6 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-5 left-5 z-20">
          <img
            src="/Favicon.png"
            alt="FlowSync"
            className="w-10 h-10 object-contain opacity-90"
          />
        </div>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8 animate-fadeIn">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0C2B4E] flex items-center justify-center gap-2">
              Create Account
            </h2>

            <p className="text-gray-500 mt-2 text-center">
              Create your FlowSync ERP account.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none transition
      ${
        errors.name
          ? "border-red-400"
          : "border-gray-300 focus:border-[#1D546C]"
      }`}
                />
              </div>

              {errors.name && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none transition
      ${
        errors.email
          ? "border-red-400"
          : "border-gray-300 focus:border-[#1D546C]"
      }`}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-2 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border rounded-xl py-3 pl-12 pr-12 outline-none transition
      ${
        errors.password
          ? "border-red-400"
          : "border-gray-300 focus:border-[#1D546C]"
      }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0C2B4E]"
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border rounded-xl py-3 pl-12 pr-12 outline-none transition
      ${
        errors.confirmPassword
          ? "border-red-400"
          : "border-gray-300 focus:border-[#1D546C]"
      }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0C2B4E]"
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

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#1D546C] hover:bg-[#16485c] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition duration-300 hover:scale-[1.02] active:scale-95"
            >
              Register
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-[#1D546C] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
