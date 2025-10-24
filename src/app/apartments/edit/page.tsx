"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, Menu, ArrowLeft } from "lucide-react";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const userName = "John Doe";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-lg flex flex-col py-8 px-6 transition-all duration-200 ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="mb-10 flex items-center justify-between">
          <span className={`text-2xl font-bold text-indigo-700 transition-all duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>Aparte</span>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="/owner-dashboard" className={`block px-3 py-2 rounded ${sidebarOpen ? "text-indigo-700 bg-indigo-100 font-medium" : "text-indigo-700"}`}>{sidebarOpen ? "Dashboard" : <span className="sr-only">Dashboard</span>}</a>
          <a href="/apartments/upload" className={`block px-3 py-2 rounded ${sidebarOpen ? "hover:bg-indigo-50 text-gray-700" : "text-gray-700"}`}>{sidebarOpen ? "Upload Apartment" : <span className="sr-only">Upload</span>}</a>
          <a href="/apartments/owner-listings" className={`block px-3 py-2 rounded ${sidebarOpen ? "hover:bg-indigo-50 text-gray-700" : "text-gray-700"}`}>{sidebarOpen ? "My Listings" : <span className="sr-only">Listings</span>}</a>
          <a href="/auth/logout" className={`block px-3 py-2 rounded ${sidebarOpen ? "hover:bg-red-50 text-red-600" : "text-red-600"}`}>{sidebarOpen ? "Logout" : <span className="sr-only">Logout</span>}</a>
        </nav>
        <div className={`mt-10 text-xs text-gray-400 transition-all duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>&copy; {new Date().getFullYear()} Aparte</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="w-full bg-white shadow-sm h-16 flex items-center px-4 border-b mb-6 justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="text-gray-500 hover:text-indigo-700 focus:outline-none"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={24} />
            </button>
            <a href="/auth/logout" className="text-gray-400 hover:text-red-600 flex items-center" title="Logout">
              <LogOut size={22} />
            </a>
          </div>
          <span className="text-lg font-semibold text-indigo-700">Welcome, {userName}</span>
          <span className="w-6" />
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export default function EditApartmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Mock: get apartment data from query params (in real app, fetch by id)
  const id = searchParams.get("id") || "1";
  const [title, setTitle] = useState(searchParams.get("title") || "Modern 2BR Apartment");
  const [description, setDescription] = useState(searchParams.get("description") || "Spacious and modern 2 bedroom apartment in Ikeja, Lagos.");
  const [price, setPrice] = useState(searchParams.get("price") || "₦1,200,000/year");
  const [location, setLocation] = useState(searchParams.get("location") || "Ikeja, Lagos");
  const [images, setImages] = useState<string[]>(searchParams.get("image") ? [searchParams.get("image")!] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      const urls = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...urls].slice(0, 5));
    }
  }

  function handleRemoveImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you would handle the update logic
    alert("Apartment updated (UI only)");
    router.push("/apartments/owner-listings");
  }

  return (
    <SidebarLayout>
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-indigo-700 hover:underline mb-4"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold mb-6 text-indigo-800">Edit Apartment</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required className="w-full border rounded px-3 py-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input required className="w-full border rounded px-3 py-2" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input required className="w-full border rounded px-3 py-2" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (up to 5)</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Apartment ${idx + 1}`} className="w-32 h-32 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-indigo-300 rounded text-indigo-400 hover:border-indigo-500 hover:text-indigo-700 transition"
                >
                  + Add Image
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              disabled={images.length >= 5}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 font-semibold">Update Apartment</button>
        </form>
      </div>
    </SidebarLayout>
  );
}
