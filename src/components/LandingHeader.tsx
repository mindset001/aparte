"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "../store";
import { logout } from "../store/slices/authSlice";

export default function LandingHeader() {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-30">
      <Link href="/" className="text-2xl font-bold text-indigo-700 tracking-tight cursor-pointer">Aparté</Link>
      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-4 items-center">
        <Link href="#about" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer">About</Link>
        <Link href="#services" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer">Services</Link>
        <Link href="#contact" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer">Contact</Link>
        {loading ? (
          <Button disabled className="cursor-not-allowed">Loading...</Button>
        ) : isAuthenticated ? (
          <Link href="/owner-dashboard">
            <Button className="cursor-pointer">Dashboard</Button>
          </Link>
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
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 hover:text-indigo-700 focus:outline-none"
  onClick={() => setMenuOpen((open: boolean) => !open)}
        aria-label="Open menu"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="8" x2="24" y2="8"/><line x1="4" y1="16" x2="24" y2="16"/></svg>
      </button>
      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-2 py-4 px-6 md:hidden animate-slideDown z-40">
          <Link href="#about" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="#services" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="#contact" className="text-gray-700 hover:text-indigo-700 transition cursor-pointer" onClick={() => setMenuOpen(false)}>Contact</Link>
          {loading ? (
            <Button disabled className="cursor-not-allowed w-full">Loading...</Button>
          ) : isAuthenticated ? (
            <Link href="/owner-dashboard" onClick={() => setMenuOpen(false)}>
              <Button className="cursor-pointer w-full">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="cursor-pointer w-full">Login</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                <Button className="cursor-pointer w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
