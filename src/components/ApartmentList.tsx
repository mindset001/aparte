import Image from "next/image";
import Link from "next/link";

const mockApartments = [
  {
    id: 1,
    title: "Modern 2 Bedroom Apartment",
    description: "Spacious and bright apartment in the city center with all amenities included.",
    price: "$1,200/mo",
    location: "Ikeja, Lagos",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
    owner: "Jane Doe",
  },
  {
    id: 2,
    title: "Cozy Studio Flat",
    description: "Perfect for singles or students. Close to public transport and shops.",
    price: "$700/mo",
    location: "Yaba, Lagos",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    owner: "John Smith",
  },
  {
    id: 3,
    title: "Luxury Penthouse Suite",
    description: "Enjoy stunning views and top-class facilities in this exclusive penthouse.",
    price: "$3,500/mo",
    location: "Victoria Island, Lagos",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
    owner: "Ada Nwosu",
  },
];

export default function ApartmentList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockApartments.map((apt) => (
        <div key={apt.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src={apt.image}
              alt={apt.title}
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h2 className="text-xl font-bold text-indigo-800 mb-1">{apt.title}</h2>
            <div className="text-gray-500 text-sm mb-2">{apt.location}</div>
            <div className="text-gray-700 mb-3 flex-1">{apt.description}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-semibold text-indigo-700">{apt.price}</span>
              <span className="text-sm text-gray-400">by {apt.owner}</span>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Link href={`/apartments/${apt.id}`}>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer">View Apartment</button>
              </Link>
              <Link href={`/apartments/${apt.id}/message`}>
                <button className="w-full bg-indigo-700 text-white py-2 rounded-lg font-medium hover:bg-indigo-800 transition cursor-pointer">Message Owner</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
