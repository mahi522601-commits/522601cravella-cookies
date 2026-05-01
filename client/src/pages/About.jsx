import { Helmet } from "react-helmet-async";
import { FiHeart, FiMapPin, FiShield, FiStar } from "react-icons/fi";

const founders = [
  { name: "Founder 01", role: "Recipe & R&D" },
  { name: "Founder 02", role: "Quality & Operations" },
  { name: "Founder 03", role: "Brand & Delivery" },
];

const values = [
  { icon: FiStar, label: "Quality" },
  { icon: FiShield, label: "Hygiene" },
  { icon: FiHeart, label: "Freshness" },
  { icon: FiMapPin, label: "Passion" },
];

const About = ({ privacyMode = false }) => {
  if (privacyMode) {
    return (
      <>
        <Helmet>
          <title>Privacy Policy | Cravella Cookies</title>
        </Helmet>
        <section className="page-shell py-14">
          <div className="card-surface max-w-4xl p-8 sm:p-10">
            <p className="section-kicker">Privacy</p>
            <h1 className="mt-3 text-4xl font-semibold">Privacy Policy</h1>
            <div className="mt-6 space-y-4 text-brand-brown/75">
              <p>
                We collect only the information needed to process orders, coordinate
                delivery, and support customers.
              </p>
              <p>
                Payment screenshots, contact details, and order notes are stored securely
                in Firebase for order verification and customer service.
              </p>
              <p>
                If you need your information updated or removed, contact us via WhatsApp.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>About | Cravella Cookies</title>
        <meta
          name="description"
          content="Learn how three students from Karimnagar started Cravella Cookies."
        />
      </Helmet>

      <section className="page-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="section-kicker">About Cravella</p>
            <h1 className="mt-3 text-5xl font-semibold">
              Homemade cookies from Karimnagar, crafted with ambition and care.
            </h1>
            <p className="mt-6 text-lg leading-8 text-brand-brown/75">
              We are from Karimnagar — we started our passion to give you quality and
              hygienic cookies. Started by 3 students at the age of 17. All over India
              delivery. Proudly serving the finest, homemade cookies from Karimnagar to you
              — deliciously and freshly baked cookies for every occasion.
            </p>
          </div>
          <div className="card-surface bg-noise p-8 sm:p-10">
            <p className="section-kicker">Our Address</p>
            <p className="mt-4 text-2xl font-semibold">
              Karimnagar, Vavilapally SR Junior College, 10-4-239
            </p>
            <p className="mt-4 text-brand-brown/70">
              Proudly baking for homes, celebrations, and gifting moments across India.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {founders.map((founder, index) => (
            <div key={founder.name} className="card-surface p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-2xl font-display text-brand-brown">
                {index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{founder.name}</h3>
              <p className="mt-2 text-brand-brown/70">{founder.role}</p>
              <p className="mt-4 text-sm text-brand-brown/70">
                Young founders turning a shared passion for quality baking into a premium local brand.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card-surface p-8">
            <p className="section-kicker">Our Values</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {values.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-[1.5rem] bg-brand-light px-5 py-5">
                  <Icon className="h-6 w-6 text-brand-brown" />
                  <p className="mt-4 text-xl font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-surface overflow-hidden">
            <div className="flex h-full min-h-[340px] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(201,136,42,0.25),_transparent_28%),linear-gradient(135deg,_rgba(59,31,20,1),_rgba(107,58,42,0.88))] p-10 text-brand-cream">
              <div className="max-w-xl text-center">
                <p className="section-kicker text-brand-beige/75">All over India Delivery</p>
                <h2 className="mt-4 text-4xl font-semibold text-white">From Karimnagar to every celebration.</h2>
                <p className="mt-4 text-brand-cream/80">
                  We ship nationwide so your favourite Cravella cookies can reach homes,
                  gifts, and festive tables all across the country.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
