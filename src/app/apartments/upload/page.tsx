"use client";

import React, { useRef, useState } from "react";
import { notification } from "antd";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);
  const userName = user?.fullName || user?.email || "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 inset-y-0 left-0 bg-white border-r shadow-lg flex flex-col py-8 px-6 transition-all duration-200
        w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-64
        `}
        style={{ minWidth: '4rem' }}
      >
        <div className="mb-10 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-900 transition-colors">Aparte</a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-indigo-700 focus:outline-none"
            title="Close sidebar"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="/owner-dashboard" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">Dashboard</a>
          <a href="/apartments/upload" className="block px-3 py-2 rounded bg-indigo-100 text-indigo-700 font-medium">Upload Apartment</a>
          <a href="/apartments/owner-listings" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">My Listings</a>
          <a href="/chats" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">Chats</a>
          <a href="/auth/logout" className="block px-3 py-2 rounded hover:bg-red-50 text-red-600">Logout</a>
        </nav>
        <div className="mt-10 text-xs text-gray-400">&copy; {new Date().getFullYear()} Aparte</div>
      </aside>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        <header className="w-full bg-white shadow-sm h-16 flex items-center px-4 border-b mb-6 justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-indigo-700 focus:outline-none md:hidden"
            title="Open sidebar"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <span className="text-lg font-semibold text-indigo-700">Welcome, {userName}</span>
          <span className="w-6" />
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}


export default function UploadApartmentPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      setImages(prev => [...prev, ...files].slice(0, 5));
    }
  }

  function handleRemoveImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      notification.error({ message: "Not Authenticated", description: "You must be logged in to upload an apartment." });
      console.error("Not authenticated");
      return;
    }
    if (!form.title || !form.description || !form.price || !form.location) {
      notification.error({ message: "Missing Fields", description: "All fields are required." });
      console.error("Missing fields", form);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("location", form.location);
      images.forEach((file) => formData.append("images", file));
      if (user?.uuid) formData.append("ownerUuid", user.uuid);
      console.log("Submitting apartment:", {
        ...form,
        images,
        ownerUuid: user?.uuid
      });
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "apartments", {
        method: "POST",
        body: formData,
      });
      console.log("API response status:", res.status);
      const result = await res.json();
      console.log("API response data:", result);
      if (!res.ok) throw new Error(result.message || "Upload failed");
      notification.success({ message: "Apartment Uploaded", description: "Your apartment has been uploaded successfully!" });
      setForm({ title: "", description: "", price: "", location: "" });
      setImages([]);
    } catch (err: any) {
      notification.error({ message: "Upload Failed", description: err.message });
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarLayout>
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
        <h1 className="text-2xl font-bold mb-6 text-indigo-800">Upload New Apartment</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="e.g. Modern 2BR Apartment" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" rows={3} placeholder="Describe the apartment..." />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input name="price" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="₦1,200,000/year" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input name="location" value={form.location} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="e.g. Ikeja, Lagos" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (up to 5)</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={URL.createObjectURL(img)} alt={`Apartment ${idx + 1}`} className="w-32 h-32 object-cover rounded border" />
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
          <button type="submit" className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 font-semibold" disabled={loading}>
            {loading ? "Uploading..." : "Upload Apartment"}
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}
