import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import ApartmentDetails from "@/components/ApartmentDetails";

export default async function ApartmentDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center pt-20 pb-12 px-4">
        <div className="max-w-4xl w-full">
          <ApartmentDetails id={id} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}