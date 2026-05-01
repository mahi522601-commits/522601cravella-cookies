import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { fetchApprovedReviews } from "@/services/firestore";

const fallbackReviews = [
  {
    id: "sample-1",
    customerName: "Ananya",
    rating: 5,
    comment: "The texture was perfect and the packaging felt so premium.",
  },
  {
    id: "sample-2",
    customerName: "Rahul",
    rating: 5,
    comment: "Loved the freshness. You can genuinely feel the homemade quality.",
  },
  {
    id: "sample-3",
    customerName: "Sowmya",
    rating: 5,
    comment: "Beautiful cookies for gifting, and the WhatsApp support was super easy.",
  },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(fallbackReviews);

  useEffect(() => {
    let mounted = true;

    fetchApprovedReviews()
      .then((response) => {
        if (mounted && response.length) {
          setReviews(response.slice(0, 3));
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="page-shell py-20">
      <div className="text-center">
        <p className="section-kicker">Sweet words</p>
        <h2 className="section-heading mt-3">What customers love about Cravella</h2>
        <div className="decorative-underline mx-auto" />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="card-surface bg-noise p-6">
            <div className="flex gap-1 text-brand-gold">
              {Array.from({ length: review.rating || 5 }).map((_, index) => (
                <FiStar key={index} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-lg leading-8 text-brand-dark/80">“{review.comment}”</p>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-brand-brown/70">
              {review.customerName}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
