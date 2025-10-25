import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import ChatBox from "@/components/ChatBox";

type PageProps = {
  params: {
    id: string;
  };
};

export default function MessageOwnerPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center pt-20 pb-12 px-4">
        <div className="max-w-3xl w-full">
          <ChatBox apartmentId={id} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
