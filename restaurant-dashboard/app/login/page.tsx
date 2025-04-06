"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/auth-context"
import { AlertCircle, Lock, Mail, Phone } from "lucide-react"

export default function LoginPage() {
  const { login, loginWithOTP, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("email")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    // Mock OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOtpSent(true)
    setError("")
  }

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await loginWithOTP(phone, otp)
    } catch (err) {
      setError("Invalid OTP")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-6"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-white">DV</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to DataViz</h1>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-white/10 p-6 shadow-xl">
          <div className="mb-6 flex">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === "email"
                  ? "border-b-2 border-violet-500 text-white"
                  : "border-b border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab("otp")}
              className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
                activeTab === "otp"
                  ? "border-b-2 border-violet-500 text-white"
                  : "border-b border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              OTP
            </button>
          </div>

          {activeTab === "email" ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-10 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-xs text-violet-400 hover:text-violet-300">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-10 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-10 py-2 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                    disabled={otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-300">
                    One-Time Password
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-800 py-2 text-center text-lg tracking-widest text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                    maxLength={6}
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-2 text-sm text-red-500">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-white/10 bg-transparent py-2 text-sm font-medium text-white transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{" "}
            <a href="#" className="text-violet-400 hover:text-violet-300">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

