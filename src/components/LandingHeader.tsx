"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "../store";
import { logout } from "../store/slices/authSlice";

export default function LandingHeader() {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-30">
      <Link href="/" className="text-2xl font-bold text-indigo-700 tracking-tight cursor-pointer">Aparté</Link>
      <nav className="flex gap-4 items-center">
        <Link href="#about" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer">About</Link>
        <Link href="#services" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer">Services</Link>
        <Link href="#contact" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer">Contact</Link>
        {loading ? (
          <Button disabled className="cursor-not-allowed">Loading...</Button>
        ) : isAuthenticated ? (
          <>
            <Link href="/owner-dashboard">
              <Button className="cursor-pointer">Dashboard</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="outline" className="cursor-pointer">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="cursor-pointer">Sign Up</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
