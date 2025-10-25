"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
          <a href="/owner-dashboard" className={`block px-3 py-2 rounded ${sidebarOpen ? "text-indigo-700 bg-indigo-100 font-medium" : "text-indigo-700"}`}>
            {sidebarOpen ? "Dashboard" : <span className="sr-only">Dashboard</span>}
          </a>
          <a href="/apartments/upload" className={`block px-3 py-2 rounded ${sidebarOpen ? "hover:bg-indigo-50 text-gray-700" : "text-gray-700"}`}>
            {sidebarOpen ? "Upload Apartment" : <span className="sr-only">Upload</span>}
          </a>
          <a href="/apartments/owner-listings" className={`block px-3 py-2 rounded ${sidebarOpen ? "hover:bg-indigo-50 text-gray-700" : "text-gray-700"}`}>
            {sidebarOpen ? "My Listings" : <span className="sr-only">Listings</span>}
          </a>
          <a href="/auth/logout" className={`block px-3 py-2 rounded ${sidebarOpen ? "hover:bg-red-50 text-red-600" : "text-red-600"}`}>
            {sidebarOpen ? "Logout" : <span className="sr-only">Logout</span>}
          </a>
        </nav>
        <div className={`mt-10 text-xs text-gray-400 transition-all duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
          &copy; {new Date().getFullYear()} Aparte
        </div>
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

type EditApartmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditApartmentPage({ params }: EditApartmentPageProps) {
  const router = useRouter();
  const [apartmentId, setApartmentId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the apartment ID from params and fetch data
  useEffect(() => {
    async function loadApartmentData() {
      try {
        const resolvedParams = await params;
        setApartmentId(resolvedParams.id);
        
        // In a real app, you would fetch the apartment data by ID from your API
        // For now, using mock data based on the ID
        const mockApartmentData = {
          id: resolvedParams.id,
          title: `Modern ${resolvedParams.id === '1' ? '2BR' : '3BR'} Apartment`,
          description: `Spacious and modern ${resolvedParams.id === '1' ? '2' : '3'} bedroom apartment in a prime location.`,
          price: resolvedParams.id === '1' ? '₦1,200,000/year' : '₦1,800,000/year',
          location: resolvedParams.id === '1' ? 'Ikeja, Lagos' : 'Victoria Island, Lagos',
          images: resolvedParams.id === '1' 
            ? ['/api/placeholder/300/200'] 
            : ['/api/placeholder/300/200', '/api/placeholder/300/200']
        };

        setTitle(mockApartmentData.title);
        setDescription(mockApartmentData.description);
        setPrice(mockApartmentData.price);
        setLocation(mockApartmentData.location);
        setImages(mockApartmentData.images);
      } catch (error) {
        console.error('Error loading apartment data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadApartmentData();
  }, [params]);

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
    // Here you would handle the update logic with the apartmentId
    console.log('Updating apartment:', { apartmentId, title, description, price, location, images });
    alert(`Apartment ${apartmentId} updated successfully!`);
    router.push("/apartments/owner-listings");
  }

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
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
        
        <h1 className="text-2xl font-bold mb-2 text-indigo-800">Edit Apartment</h1>
        <p className="text-gray-600 mb-6">Editing apartment ID: {apartmentId}</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              required 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              required 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              rows={3} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input 
                required 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input 
                required 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Images (up to 5)</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={img} 
                    alt={`Apartment ${idx + 1}`} 
                    className="w-32 h-32 object-cover rounded border" 
                  />
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
          
          <button 
            type="submit" 
            className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 font-semibold transition duration-200"
          >
            Update Apartment
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}