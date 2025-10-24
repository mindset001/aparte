import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <section className="w-full pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
      <div className="max-w-3xl w-full text-center space-y-8 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Find & List Apartments Easily
        </h1>
        <p className="text-xl md:text-2xl text-gray-700">
          Welcome to Aparté! Effortlessly create an account, upload your apartment, or browse listings and message owners directly.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <Button className="w-full md:w-auto text-lg px-8 py-6">Get Started</Button>
          </Link>
          <Link href="/apartments">
            <Button variant="outline" className="w-full md:w-auto text-lg px-8 py-6">Browse Apartments</Button>
          </Link>
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Image
          src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80"
          alt="Modern apartment building exterior"
          width={700}
          height={400}
          className="rounded-2xl shadow-xl border-4 border-white"
          priority
        />
      </div>
    </section>
  );
}
