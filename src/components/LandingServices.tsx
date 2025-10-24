import Image from "next/image";

const services = [
  {
    title: "Easy Account Creation",
    description: "Sign up in seconds and start listing or searching for apartments right away.",
    image: "https://cdn.jsdelivr.net/gh/feathericons/feather/icons/user-plus.svg",
    color: "bg-indigo-100",
  },
  {
    title: "Seamless Apartment Uploads",
    description: "Add apartment details, upload images, and manage your listings with a modern UI.",
    image: "https://cdn.jsdelivr.net/gh/feathericons/feather/icons/home.svg",
    color: "bg-blue-100",
  },
  {
    title: "Direct Messaging",
    description: "Contact apartment owners directly and get quick responses to your inquiries.",
    image: "https://cdn.jsdelivr.net/gh/feathericons/feather/icons/message-circle.svg",
    color: "bg-green-100",
  },
  {
    title: "Responsive & Modern Design",
    description: "Enjoy a beautiful, mobile-friendly experience on any device.",
    image: "https://cdn.jsdelivr.net/gh/feathericons/feather/icons/smartphone.svg",
    color: "bg-yellow-100",
  },
];

export default function LandingServices() {
  return (
    <section id="services" className="w-full bg-indigo-50 py-20 px-4 flex flex-col items-center">
      <div className="max-w-5xl w-full text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">Our Services</h2>
        <p className="text-lg text-gray-700">Everything you need for a smooth apartment experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl w-full">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-transparent hover:border-indigo-200"
          >
            <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-5 shadow-md ${service.color}`}>
              <Image
                src={service.image}
                alt={service.title}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-indigo-800 mb-2 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
            <p className="text-gray-600 text-base">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
