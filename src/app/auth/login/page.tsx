import LoginForm from "@/components/auth/LoginForm";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />
      <main className="flex flex-1 items-center justify-center pt-20">
        <LoginForm />
      </main>
      <LandingFooter />
    </div>
  );
}
