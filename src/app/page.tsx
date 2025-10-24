
import LandingHeader from "@/components/LandingHeader";
import LandingHero from "@/components/LandingHero";
import LandingAbout from "@/components/LandingAbout";
import LandingServices from "@/components/LandingServices";
import LandingFooter from "@/components/LandingFooter";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <LandingHeader />
      <main className="flex-1 flex flex-col">
        <LandingHero />
        <LandingAbout />
        <LandingServices />
      </main>
      <LandingFooter />
    </div>
  );
}
