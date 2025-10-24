import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import ApartmentList from "@/components/ApartmentList";

export default function ApartmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center pt-20 pb-12 px-4">
        <div className="max-w-5xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-8 text-center">Browse Apartments</h1>
          <ApartmentList />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
