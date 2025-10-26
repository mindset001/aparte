'use client'

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ApartmentList() {
  const [apartments, setApartments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchApartments() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "apartments");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch apartments");
        setApartments(data);
        console.log("Fetched apartments:", data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApartments();
  }, []);

  if (loading) return <div className="text-center py-10">Loading apartments...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {apartments.map((apt) => (
        <div key={apt._id || apt.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100">
          <div className="relative h-48 w-full">
            <Image
              src={apt.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={apt.title || "Apartment"}
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-lg">
                {apt.owner?.fullName ? apt.owner.fullName.split(' ').map((n: string) => n[0]).join('') : "A"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-indigo-800 leading-tight">{apt.title || "Untitled"}</h2>
                <div className="text-gray-500 text-xs">{apt.location || "Unknown location"}</div>
                <div className="text-xs text-gray-400">Owner: {apt.owner?.fullName || "Unknown"}</div>
                {apt.owner?.email && (
                  <div className="text-xs text-gray-400">Email: {apt.owner.email}</div>
                )}
              </div>
            </div>
            <div className="text-gray-700 mb-3 flex-1 text-sm">{apt.description || "No description"}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-semibold text-indigo-700">{apt.price || "N/A"}</span>
              {/* Owner info now shown above */}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Link href={`/apartments/${apt._id}`}>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer">View Apartment</button>
              </Link>
              <Link href={`/apartments/${apt._id}/message`}>
                <button className="w-full bg-indigo-700 text-white py-2 rounded-lg font-medium hover:bg-indigo-800 transition cursor-pointer">Message Owner</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

