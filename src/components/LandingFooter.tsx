export default function LandingFooter() {
  return (
    <footer className="w-full bg-indigo-950 text-white py-8 px-4 mt-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">&copy; {new Date().getFullYear()} Aparté. All rights reserved.</div>
        <div className="flex gap-4 text-sm">
          <a href="#about" className="hover:underline cursor-pointer">About</a>
          <a href="#services" className="hover:underline cursor-pointer">Services</a>
          <a href="#contact" className="hover:underline cursor-pointer">Contact</a>
        </div>
      </div>
    </footer>
  );
}
