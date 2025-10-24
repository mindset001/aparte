import Image from "next/image";

export default function LandingAbout() {
  return (
    <section id="about" className="w-full bg-white py-20 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">About Aparté</h2>
          <p className="text-lg text-gray-700">
            Aparté is your trusted platform for finding and listing apartments with ease. Whether you’re a property owner or a seeker, our intuitive interface and modern features make the process seamless and enjoyable.
          </p>
          <ul className="list-disc pl-6 text-gray-600 text-base space-y-1">
            <li>Simple and secure account creation</li>
            <li>Upload apartments with detailed info and images</li>
            <li>Browse listings and connect with owners directly</li>
            <li>Modern, responsive, and user-friendly design</li>
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
            alt="Modern apartment interior"
            width={400}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
