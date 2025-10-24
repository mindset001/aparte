import Image from "next/image";

const mockApartments = [
  {
    id: "1",
    title: "Modern 2 Bedroom Apartment",
    description: "Spacious and bright apartment in the city center with all amenities included. Enjoy a large living room, modern kitchen, and a beautiful balcony.",
    price: "$1,200/mo",
    location: "Ikeja, Lagos",
    images: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"
    ],
    owner: "Jane Doe",
    ownerContact: "jane@example.com",
    features: ["2 Bedrooms", "2 Bathrooms", "Balcony", "Parking", "Furnished"],
  },
  {
    id: "2",
    title: "Cozy Studio Flat",
    description: "Perfect for singles or students. Close to public transport and shops. Includes a kitchenette and private bathroom.",
    price: "$700/mo",
    location: "Yaba, Lagos",
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    owner: "John Smith",
    ownerContact: "john@example.com",
    features: ["Studio", "1 Bathroom", "Kitchenette", "WiFi"],
  },
  {
    id: "3",
    title: "Luxury Penthouse Suite",
    description: "Enjoy stunning views and top-class facilities in this exclusive penthouse. Rooftop pool, gym, and 24/7 security included.",
    price: "$3,500/mo",
    location: "Victoria Island, Lagos",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
    ],
    owner: "Ada Nwosu",
    ownerContact: "ada@example.com",
    features: ["3 Bedrooms", "3 Bathrooms", "Rooftop Pool", "Gym", "24/7 Security"],
  },
];

export default function ApartmentDetails({ id }: { id: string }) {
  const apartment = mockApartments.find((apt) => apt.id === id) || mockApartments[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-2">{apartment.title}</h1>
      <div className="text-gray-500 text-base mb-4">{apartment.location}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto">
            {apartment.images.map((img, idx) => (
              <div key={idx} className="relative w-48 h-32 min-w-[12rem] rounded-lg overflow-hidden border">
                <Image src={img} alt={apartment.title + " image " + (idx + 1)} fill className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold mb-1">Features:</div>
            <ul className="flex flex-wrap gap-2">
              {apartment.features.map((f, i) => (
                <li key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">{f}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-gray-700 text-base mb-2">{apartment.description}</div>
          <div className="text-lg font-bold text-indigo-700">{apartment.price}</div>
          <div className="text-sm text-gray-500">Owner: {apartment.owner}</div>
          <button className="mt-2 w-full bg-indigo-700 text-white py-2 rounded-lg font-medium hover:bg-indigo-800 transition cursor-pointer">Message Owner</button>
        </div>
      </div>
    </div>
  );
}
