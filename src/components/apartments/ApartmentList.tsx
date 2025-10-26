"use client";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function ApartmentList() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApartments() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "apartments");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch apartments");
        setApartments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApartments();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6">Apartment Listings</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading apartments...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : apartments.length === 0 ? (
        <div className="text-center text-gray-500">No apartments found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apartments.map((apt: any) => (
            <Card key={apt._id} className="p-6 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-indigo-700">{apt.title}</h3>
              <p className="text-gray-700">{apt.description}</p>
              <div className="text-sm text-gray-500">Location: {apt.location}</div>
              <div className="text-sm text-gray-500">Price: ₦{apt.price}</div>
              {apt.images && apt.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {apt.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={`${(process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")}${img}`}
                      alt="Apartment"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">Owner: {apt.owner}</div>
              {/* Optionally add a message or contact button here */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
