import RegisterForm from "@/components/auth/RegisterForm";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />
      <main className="flex flex-1 items-center justify-center pt-20">
        <RegisterForm />
      </main>
      <LandingFooter />
    </div>
  );
}
