
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupStep2() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "",
    state: "",
    userType: "",
    picture: ""
  });
  const [uuid, setUuid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUuid = localStorage.getItem("signup_uuid");
    if (storedUuid) setUuid(storedUuid);
    else router.push("/auth/signup/step-1");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "auth/signup/step-2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, uuid })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Signup step 2 failed");
      setSuccess(true);
      localStorage.removeItem("signup_uuid");
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-0 bg-white/90">
      <div className="px-10 py-12 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-indigo-800 mb-2">Sign Up - Step 2</h2>
          <p className="text-gray-500 text-base">Complete your profile to finish registration</p>
        </div>
        {success ? (
          <div className="text-green-600 text-center font-medium">Signup completed!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                name="fullName"
                placeholder="Your name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <Input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <Input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <Input
                name="userType"
                placeholder="User type (e.g. owner, seeker)"
                value={form.userType}
                onChange={e => setForm({ ...form, userType: e.target.value })}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
              <Input
                name="picture"
                placeholder="Profile picture URL"
                value={form.picture}
                onChange={e => setForm({ ...form, picture: e.target.value })}
                className="bg-gray-50"
              />
            </div>
            <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={loading}>
              {loading ? "Submitting..." : "Finish"}
            </Button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        )}
      </div>
    </Card>
  );
}
