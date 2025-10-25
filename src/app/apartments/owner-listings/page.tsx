"use client";

import React from "react";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const userName = "John Doe";
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
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
          <a href="/apartments/upload" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">Upload Apartment</a>
          <a href="/apartments/owner-listings" className="block px-3 py-2 rounded bg-indigo-100 text-indigo-700 font-medium">My Listings</a>
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
      <div className="flex-1 flex flex-col">
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

export default function OwnerListingsPage() {
  // Mock data for demonstration
  const apartments = [
    {
      id: "1",
      title: "Modern 2BR Apartment",
      location: "Ikeja, Lagos",
      price: "₦1,200,000/year",
      status: "Active",
      image: "/apartment1.jpg",
    },
    {
      id: "2",
      title: "Cozy Studio Flat",
      location: "Lekki, Lagos",
      price: "₦800,000/year",
      status: "Inactive",
      image: "/apartment2.jpg",
    },
  ];

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-800">My Apartment Listings</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {apartments.map((apt) => (
            <div key={apt.id} className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow p-4 gap-4">
              <img src={apt.image} alt={apt.title} className="w-32 h-32 object-cover rounded-md border mb-2 sm:mb-0" />
              <div className="flex-1 w-full">
                <div className="font-semibold text-indigo-700">{apt.title}</div>
                <div className="text-sm text-gray-500">{apt.location}</div>
                <div className="text-sm text-gray-700">{apt.price}</div>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${apt.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{apt.status}</span>
              </div>
              <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                <a
                  href={`/apartments/edit?id=${apt.id}&title=${encodeURIComponent(apt.title)}&description=${encodeURIComponent('Spacious and modern 2 bedroom apartment in ' + apt.location + '.')}&price=${encodeURIComponent(apt.price)}&location=${encodeURIComponent(apt.location)}&image=${encodeURIComponent(apt.image)}`}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  Edit
                </a>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
