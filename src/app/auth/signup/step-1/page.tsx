
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupStep1() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "auth/signup/step-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (!res.ok || !result.uuid) throw new Error(result.message || "Signup failed");
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-0 bg-white/90">
      <div className="px-10 py-12 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-2">Sign Up</h2>
          <p className="text-gray-500 text-base">Enter your email and password to create your account</p>
        </div>
        {success ? (
          <div className="text-green-600 text-center font-medium">Account created! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
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
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={loading}>
              {loading ? "Submitting..." : "Register"}
            </Button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        )}
      </div>
    </Card>
  );
}
