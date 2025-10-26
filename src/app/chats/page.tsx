"use client";

import React, { useState } from "react";
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
          <a href="/apartments/upload" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">Upload Apartment</a>
          <a href="/apartments/owner-listings" className="block px-3 py-2 rounded hover:bg-indigo-50 text-gray-700">My Listings</a>
          <a href="/chats" className="block px-3 py-2 rounded bg-indigo-100 text-indigo-700 font-medium">Chats</a>
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
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export default function ChatsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [apartments, setApartments] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [senderNames, setSenderNames] = React.useState<Record<string, string>>({});
  const router = useRouter();

  React.useEffect(() => {
    async function fetchChats() {
      if (!user?.uuid) return;
      setLoading(true);
      try {
        // Fetch all apartments (for sender and owner views)
        const resApt = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "apartments");
        const dataApt = await resApt.json();
        // Apartments owned by user
        const myApts = Array.isArray(dataApt) ? dataApt.filter((apt) => apt.owner?.uuid === user.uuid) : [];
        // Apartments where user has sent a message (but does NOT own)
        let sentAptIds = new Set<string>();
        let allMessages: any[] = [];
        const senderIdSet = new Set<string>();

        await Promise.all(
          dataApt.map(async (apt: any) => {
            try {
              const resMsg = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `messages/${apt._id || apt.id}`);
              const msgs = await resMsg.json();
              msgs.forEach((msg: any) => {
                // If user is owner, show only received messages
                if (apt.owner?.uuid === user.uuid && msg.sender !== user.uuid && msg.sender !== user._id && msg.sender !== user.id) {
                  allMessages.push({
                    ...msg,
                    apartmentId: apt._id || apt.id,
                    direction: "received"
                  });
                  senderIdSet.add(msg.sender);
                }
                // If user is sender (not owner), show only sent messages
                if ((msg.sender === user.uuid || msg.sender === user._id || msg.sender === user.id) && apt.owner?.uuid !== user.uuid) {
                  allMessages.push({
                    ...msg,
                    apartmentId: apt._id || apt.id,
                    direction: "sent"
                  });
                  sentAptIds.add(apt._id || apt.id);
                  senderIdSet.add(msg.sender);
                }
              });
            } catch {}
          })
        );
        // Apartments relevant to user (owner or sender)
        const relevantApts = dataApt.filter((apt: any) => apt.owner?.uuid === user.uuid || sentAptIds.has(apt._id || apt.id));
        setApartments(relevantApts);
        setMessages(allMessages);

        // Fetch sender names
        const senderNamesObj: Record<string, string> = {};
        await Promise.all(
          Array.from(senderIdSet).map(async (senderId) => {
            try {
              const resUser = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `users/${senderId}`);
              const userData = await resUser.json();
              senderNamesObj[senderId] = userData.fullName || userData.email || senderId;
            } catch {
              senderNamesObj[senderId] = senderId;
            }
          })
        );
        setSenderNames(senderNamesObj);
      } catch {
        setApartments([]);
        setMessages([]);
        setSenderNames({});
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [user?.uuid, user?.id, user?._id]);

  return (
    <SidebarLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-indigo-800">Chats</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400">No chats found.</div>
            ) : (
              messages.map((msg, i) => {
                const apt = apartments.find(a => (a._id || a.id) === msg.apartmentId);
                return (
                  <div key={msg._id || i} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-indigo-700">{msg.direction === "sent" ? "You" : senderNames[msg.sender] || msg.sender}</div>
                      <div className="text-sm text-gray-600 mb-1">{msg.content}</div>
                      {apt && (
                        <div className="text-xs text-gray-500">For: <span className="font-semibold">{apt.title}</span></div>
                      )}
                      <div className="mt-1">
                        {msg.direction === "sent" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 mr-2">You messaged owner</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 mr-2">Messaged you as owner</span>
                        )}
                        <span className="text-xs text-gray-400">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/apartments/${msg.apartmentId}/message`)}
                      className="text-indigo-600 hover:underline text-xs mt-2 md:mt-0"
                    >
                      Open Chat
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
