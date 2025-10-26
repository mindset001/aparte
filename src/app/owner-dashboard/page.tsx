"use client";

import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { useAppSelector } from "@/store";
import { useRouter } from "next/navigation";

function SidebarLayout({ children, user }: { children: React.ReactNode; user: any }) {
  const router = useRouter();
  React.useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);
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
  const { user } = useAppSelector((state) => state.auth);
  const [apartments, setApartments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [messagesByApartment, setMessagesByApartment] = React.useState<Record<string, any[]>>({});
  const [senderNames, setSenderNames] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    async function fetchApartmentsAndMessages() {
      if (!user?.uuid) return;
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "apartments");
        const data = await res.json();
        // Filter apartments by owner uuid (populated)
        const myApts = Array.isArray(data)
          ? data.filter((apt) => apt.owner?.uuid === user.uuid)
          : [];
        setApartments(myApts);

        // Fetch recent messages for each apartment
        const messagesObj: Record<string, any[]> = {};
        const senderIdSet = new Set<string>();
        await Promise.all(
          myApts.map(async (apt) => {
            try {
              const resMsg = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `messages/${apt._id || apt.id}`);
              const msgs = await resMsg.json();
              console.log("Fetched messages for apartment", apt._id || apt.id, msgs);
              const recentMsgs = Array.isArray(msgs) ? msgs.slice(-3).reverse() : [];
              messagesObj[apt._id || apt.id] = recentMsgs;
              recentMsgs.forEach((msg: any) => {
                if (msg.sender) senderIdSet.add(msg.sender);
              });
            } catch {
              messagesObj[apt._id || apt.id] = [];
            }
          })
        );
        setMessagesByApartment(messagesObj);

        // Fetch sender names for all unique sender ids
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
      } catch (err) {
        setApartments([]);
        setMessagesByApartment({});
      } finally {
        setLoading(false);
      }
    }
    fetchApartmentsAndMessages();
  }, [user?.uuid]);

  return (
    <SidebarLayout user={user}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Apartments Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Apartments</h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : apartments.length === 0 ? (
            <div className="text-center text-gray-500">No apartments found.</div>
          ) : (
            <div className="space-y-4">
              {apartments.map((apt) => (
                <div key={apt._id || apt.id} className="flex flex-col bg-white rounded-lg shadow p-4 gap-2">
                  <div className="flex items-center gap-4">
                    <img src={apt.images?.[0] || "/apartment1.jpg"} alt={apt.title} className="w-20 h-20 object-cover rounded-md border" />
                    <div className="flex-1">
                      <div className="font-semibold text-indigo-700">{apt.title}</div>
                      <div className="text-sm text-gray-500">{apt.location}</div>
                      <div className="text-sm text-gray-700">{apt.price}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700`}>Active</span>
                    </div>
                  </div>
                  {/* Recent messages for this apartment */}
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold text-indigo-600 mb-1">Recent Messages</h3>
                    {messagesByApartment[apt._id || apt.id]?.length ? (
                      <div className="space-y-2">
                        {messagesByApartment[apt._id || apt.id].map((msg, i) => (
                          <div key={msg._id || i} className="bg-indigo-50 rounded p-2">
                            <div className="text-xs text-gray-700 font-semibold">From: {senderNames[msg.sender] || msg.sender}</div>
                            <div className="text-sm text-gray-800">{msg.content}</div>
                            <div className="text-xs text-gray-400">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No messages yet.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
