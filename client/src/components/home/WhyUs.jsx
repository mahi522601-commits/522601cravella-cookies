import { FiHeart, FiMapPin, FiShield, FiTruck } from "react-icons/fi";

const features = [
  {
    icon: FiHeart,
    title: "Crafted with care",
    body: "Every batch is mixed, baked, and packed with small-batch attention.",
  },
  {
    icon: FiShield,
    title: "Hygienic kitchen",
    body: "Clean preparation, careful packing, and ingredient-first quality standards.",
  },
  {
    icon: FiTruck,
    title: "All India delivery",
    body: "Fresh cookies from Karimnagar delivered across India in 3–7 business days.",
  },
  {
    icon: FiMapPin,
    title: "Proudly local",
    body: "Born in Karimnagar, rooted in community, and built with student passion.",
  },
];

const WhyUs = () => (
  <section className="bg-brand-dark py-20 text-brand-cream">
    <div className="page-shell">
      <div className="max-w-2xl">
        <p className="section-kicker text-brand-beige/70">Why choose Cravella</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-white">
          Artisan warmth, premium ingredients, and sincere care in every bite.
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold text-brand-dark">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-brand-cream/75">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
