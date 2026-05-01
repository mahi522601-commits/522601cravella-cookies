import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const AboutSection = () => (
  <section className="page-shell py-20">
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="card-surface bg-noise overflow-hidden p-8 sm:p-10">
        <p className="section-kicker">Our Story</p>
        <h2 className="mt-4 text-4xl font-semibold">
          Three students, one shared dream, and a whole lot of cookies.
        </h2>
        <p className="mt-5 text-base leading-8 text-brand-dark/78">
          We are from Karimnagar, and we started our passion to give you quality and
          hygienic cookies. Started by 3 students at the age of 17, Cravella Cookies
          now proudly serves all over India with freshly baked treats for every occasion.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.75rem] bg-brand-brown p-8 text-brand-cream shadow-soft">
          <h3 className="font-display text-3xl font-semibold text-white">
            Homemade with discipline. Delivered with heart.
          </h3>
          <p className="mt-4 max-w-xl leading-8 text-brand-cream/80">
            From hygienic preparation to careful shipping, every Cravella order is meant
            to feel warm, premium, and dependable.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {["Quality", "Hygiene", "Freshness", "Passion"].map((value) => (
            <span
              key={value}
              className="rounded-full border border-brand-brown/10 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-brand-brown shadow-soft"
            >
              {value}
            </span>
          ))}
        </div>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-brand-brown"
        >
          Read the full story
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default AboutSection;
