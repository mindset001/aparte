"use client";

import { useState } from "react";
import { useAppDispatch } from "../../store";
import { authStart, authSuccess, authFailure } from "../../store/slices/authSlice";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    dispatch(authStart());
    if (!form.fullName.trim()) {
      setError("Full name is required");
      dispatch(authFailure("Full name is required"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      dispatch(authFailure("Passwords do not match"));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password
      };
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok || !result.uuid) throw new Error(result.message || "Signup failed");
      setSuccess(true);
      dispatch(authSuccess({ user: { uuid: result.uuid, fullName: form.fullName, email: form.email } }));
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
      dispatch(authFailure(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-0 bg-white/90">
      <div className="px-10 py-12 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-2">Create Your Account</h2>
          <p className="text-gray-500 text-base">Sign up to list or find your next apartment</p>
        </div>
        {success ? (
          <div className="text-green-600 text-center font-medium">Account created! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="bg-gray-50"
              />
            </div>
            <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={loading}>
              {loading ? "Submitting..." : "Register"}
            </Button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            <div className="text-center mt-4 text-sm text-gray-600">
              Already a member?{' '}
              <Link href="/auth/login" className="text-indigo-700 font-medium hover:underline cursor-pointer">Login</Link>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
