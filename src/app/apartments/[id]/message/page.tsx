import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import ChatBox from "@/components/ChatBox";

export default function MessageOwnerPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center pt-20 pb-12 px-4">
        <div className="max-w-3xl w-full">
          <ChatBox apartmentId={params.id} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
