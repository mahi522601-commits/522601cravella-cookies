import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { settingsSchema } from "@/utils/validators";

const AdminSettings = () => {
  const { siteSettings, saveSettings } = useSiteSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: siteSettings,
  });

  useEffect(() => {
    reset(siteSettings);
  }, [siteSettings, reset]);

  const onSubmit = async (values) => {
    try {
      await saveSettings(values);
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error.message || "Unable to save settings");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Settings | Cravella Cookies</title>
      </Helmet>

      <form onSubmit={handleSubmit(onSubmit)} className="card-surface max-w-4xl space-y-5 p-6 sm:p-7">
        <div>
          <p className="section-kicker">Site Settings</p>
          <h1 className="mt-2 text-3xl font-semibold">Storefront controls</h1>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-brand-brown">WhatsApp Number</span>
          <input className="input-field" {...register("whatsappNumber")} />
          {errors.whatsappNumber ? <span className="mt-2 block text-sm font-semibold text-brand-error">{errors.whatsappNumber.message}</span> : null}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-brand-brown">UPI ID</span>
          <input className="input-field" {...register("upiId")} />
          {errors.upiId ? <span className="mt-2 block text-sm font-semibold text-brand-error">{errors.upiId.message}</span> : null}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-brand-brown">UPI Display Name</span>
          <input className="input-field" {...register("upiName")} />
          {errors.upiName ? <span className="mt-2 block text-sm font-semibold text-brand-error">{errors.upiName.message}</span> : null}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-brand-brown">Free Shipping Message</span>
          <input className="input-field" {...register("freeShippingMessage")} />
          {errors.freeShippingMessage ? <span className="mt-2 block text-sm font-semibold text-brand-error">{errors.freeShippingMessage.message}</span> : null}
        </label>
        <label className="flex items-center gap-3 rounded-[1.5rem] bg-brand-light px-4 py-4">
          <input type="checkbox" {...register("chatbotEnabled")} />
          <span className="font-semibold text-brand-dark">Chatbot Enabled</span>
        </label>
        <label className="flex items-center gap-3 rounded-[1.5rem] bg-brand-light px-4 py-4">
          <input type="checkbox" {...register("maintenanceMode")} />
          <span className="font-semibold text-brand-dark">Maintenance Mode</span>
        </label>
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Save Settings
          </Button>
        </div>
      </form>
    </>
  );
};

export default AdminSettings;
