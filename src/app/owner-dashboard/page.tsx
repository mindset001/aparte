"use client";

import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  // Mock user name for demonstration
  const userName = "John Doe";
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
          <a href="/owner-dashboard" className={`block px-3 py-2 rounded text-indigo-700 bg-indigo-100 font-medium`}>Dashboard</a>
          <a href="/apartments/upload" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">Upload Apartment</a>
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

export default function OwnerDashboard() {
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

  const messages = [
    {
      apartmentId: "1",
      from: "Jane Doe",
      text: "Hi, is this apartment still available?",
      time: "Today, 10:15 AM",
    },
    {
      apartmentId: "2",
      from: "John Smith",
      text: "Can I schedule a viewing?",
      time: "Yesterday, 4:30 PM",
    },
  ];

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Apartments Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Apartments</h2>
          <div className="space-y-4">
            {apartments.map((apt) => (
              <div key={apt.id} className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
                <img src={apt.image} alt={apt.title} className="w-20 h-20 object-cover rounded-md border" />
                <div className="flex-1">
                  <div className="font-semibold text-indigo-700">{apt.title}</div>
                  <div className="text-sm text-gray-500">{apt.location}</div>
                  <div className="text-sm text-gray-700">{apt.price}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${apt.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Messages Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const apt = apartments.find(a => a.id === msg.apartmentId);
              return (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="font-semibold text-indigo-700">{msg.from}</div>
                  <div className="text-sm text-gray-600 mb-1">{msg.text}</div>
                  <div className="text-xs text-gray-400">{msg.time}</div>
                  {apt && (
                    <div className="text-xs text-gray-500 mt-1">For: <span className="font-semibold">{apt.title}</span></div>
                  )}
                  <a href={`/apartments/${msg.apartmentId}/message`} className="text-indigo-600 hover:underline text-xs mt-2 inline-block">View Conversation</a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
   
    </SidebarLayout>
  );
}
