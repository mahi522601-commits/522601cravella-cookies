import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { createInquiry } from "@/services/firestore";
import { contactSchema } from "@/utils/validators";
import { useUiStore } from "@/store/uiStore";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const siteSettings = useUiStore((state) => state.siteSettings);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await createInquiry(values);
      toast.success("Inquiry sent successfully");
      reset();
    } catch (error) {
      toast.error(error.message || "Unable to send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Cravella Cookies</title>
        <meta
          name="description"
          content="Contact Cravella Cookies for orders, gifting, and delivery queries."
        />
      </Helmet>

      <section className="page-shell py-14">
        <div className="max-w-3xl">
          <p className="section-kicker">Contact</p>
          <h1 className="mt-3 text-5xl font-semibold">We’d love to hear from you.</h1>
          <p className="mt-4 text-lg text-brand-brown/75">
            Reach out for bulk orders, gifting, delivery questions, or cookie cravings.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={handleSubmit(onSubmit)} className="card-surface space-y-5 p-6 sm:p-7">
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-brown">Name</span>
              <input className="input-field" placeholder="Your name" {...register("name")} />
              {errors.name ? (
                <span className="mt-2 block text-sm font-semibold text-brand-error">
                  {errors.name.message}
                </span>
              ) : null}
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-brown">Phone</span>
              <input className="input-field" placeholder="10-digit phone number" {...register("phone")} />
              {errors.phone ? (
                <span className="mt-2 block text-sm font-semibold text-brand-error">
                  {errors.phone.message}
                </span>
              ) : null}
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-brown">Message</span>
              <textarea className="textarea-field" placeholder="Tell us what you need" {...register("message")} />
              {errors.message ? (
                <span className="mt-2 block text-sm font-semibold text-brand-error">
                  {errors.message.message}
                </span>
              ) : null}
            </label>
            <Button type="submit" loading={submitting}>
              Send Inquiry
            </Button>
          </form>

          <div className="space-y-6">
            <div className="card-surface p-6 sm:p-7">
              <h2 className="text-2xl font-semibold">WhatsApp</h2>
              <p className="mt-3 text-brand-brown/75">
                For quick support and order confirmation, chat with us directly.
              </p>
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}?text=Hi+CravellaCookies`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-brand-brown px-5 py-3 font-bold text-brand-cream"
              >
                Message on WhatsApp
              </a>
            </div>

            <div className="card-surface overflow-hidden">
              <iframe
                title="Cravella Cookies location"
                src="https://www.google.com/maps?q=Karimnagar&output=embed"
                className="h-80 w-full"
                loading="lazy"
              />
            </div>

            <div className="card-surface p-6 sm:p-7">
              <h2 className="text-2xl font-semibold">Business Hours</h2>
              <p className="mt-4 text-brand-brown/75">Monday - Saturday: 9:00 AM to 8:00 PM</p>
              <p className="mt-2 text-brand-brown/75">Sunday: Order support on WhatsApp</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
