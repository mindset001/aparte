"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setLoginCredentials, setLoginLoading, setLoginError } from "@/store/slices/loginSlice";
import { authStart, authSuccess, authFailure } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(authStart());
    dispatch(setLoginLoading(true));
    dispatch(setLoginCredentials({ email: form.email, password: form.password }));
    setSuccess(false);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const result = await res.json();
      dispatch(setLoginLoading(false));
      if (!res.ok) {
        dispatch(setLoginError(result.message || "Invalid credentials"));
        dispatch(authFailure(result.message || "Invalid credentials"));
        setSuccess(false);
      } else {
        dispatch(setLoginError(undefined));
        setSuccess(true);
  // Ensure uuid is present for apartment upload
  const user = { ...result.user };
  if (!user.uuid && user.id) user.uuid = user.id;
  dispatch(authSuccess({ user }));
        router.push("/");
      }
    } catch (err: any) {
      dispatch(setLoginLoading(false));
      dispatch(setLoginError("Login failed"));
      dispatch(authFailure("Login failed"));
      setSuccess(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-0 bg-white/90">
      <div className="px-10 py-12 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-2">Sign In</h2>
          <p className="text-gray-500 text-base">Login to manage your apartments or connect with owners</p>
        </div>
        {success ? (
          <div className="text-green-600 text-center font-medium">Login successful! (UI only)</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-700 cursor-pointer"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="accent-indigo-600 h-4 w-4 rounded cursor-pointer"
                />
                Remember me
              </label>
              <Link href="#" className="text-indigo-700 text-sm hover:underline cursor-pointer">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            <div className="text-center mt-4 text-sm text-gray-600">
              New here?{' '}
              <Link href="/auth/register" className="text-indigo-700 font-medium hover:underline cursor-pointer">Register</Link>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
};

export default LoginForm;
