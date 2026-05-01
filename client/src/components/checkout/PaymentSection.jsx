import { FiCopy, FiSmartphone } from "react-icons/fi";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";
import toast from "react-hot-toast";
import ScreenshotUpload from "./ScreenshotUpload";
import UpiQRCode from "./UpiQRCode";
import { buildPaymentLinks, isMobileDevice } from "@/services/upi";

const providerMeta = {
  PhonePe: { Icon: SiPhonepe, accent: "bg-[#5F259F] text-white" },
  GooglePay: { Icon: SiGooglepay, accent: "bg-[#FFFFFF] text-[#1A73E8]" },
  Paytm: { Icon: SiPaytm, accent: "bg-[#00BAF2] text-white" },
};

const PaymentSection = ({
  totalAmount,
  siteSettings,
  paymentMethod,
  setPaymentMethod,
  screenshot,
  setScreenshot,
  register,
  errors,
}) => {
  const links = buildPaymentLinks(totalAmount, {
    upiId: siteSettings.upiId,
    upiName: siteSettings.upiName,
  });
  const mobile = isMobileDevice();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(siteSettings.upiId);
    toast.success("UPI ID copied");
  };

  return (
    <section className="card-surface p-6 sm:p-7">
      <div>
        <p className="section-kicker">Step 3</p>
        <h2 className="mt-2 text-2xl font-semibold">Payment</h2>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          {mobile ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-brand-brown">Tap to Pay instantly</p>
              {Object.entries(links).map(([provider, url]) => {
                const { Icon, accent } = providerMeta[provider];
                return (
                  <button
                    key={provider}
                    className={`flex w-full items-center justify-between rounded-[1.5rem] px-4 py-4 text-left shadow-soft ${accent}`}
                    onClick={() => {
                      setPaymentMethod(provider);
                      window.location.href = url;
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-bold">{provider}</p>
                        <p className="text-sm opacity-80">Tap to Pay</p>
                      </div>
                    </div>
                    <FiSmartphone className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          ) : null}

          <UpiQRCode
            totalAmount={totalAmount}
            upiId={siteSettings.upiId}
            upiName={siteSettings.upiName}
          />

          <div className="rounded-[1.5rem] border border-brand-brown/10 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-brown/65">
                  Desktop fallback
                </p>
                <p className="mt-1 font-semibold text-brand-dark">{siteSettings.upiId}</p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-brand-brown px-4 py-2 text-sm font-bold text-brand-cream"
                onClick={handleCopy}
              >
                <FiCopy className="h-4 w-4" />
                Copy UPI ID
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.keys(providerMeta).map((provider) => (
              <button
                key={provider}
                className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  paymentMethod === provider
                    ? "border-brand-brown bg-brand-brown text-brand-cream"
                    : "border-brand-brown/10 bg-brand-light text-brand-dark"
                }`}
                onClick={() => setPaymentMethod(provider)}
              >
                <p className="font-bold">{provider}</p>
                <p className="mt-1 text-sm opacity-80">Preferred app</p>
              </button>
            ))}
          </div>

          <ScreenshotUpload value={screenshot} onChange={setScreenshot} />

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-brown">
                UPI Reference Number
              </span>
              <input
                className="input-field"
                placeholder="UTR / reference number (optional)"
                {...register("upiRef")}
              />
              {errors.upiRef ? (
                <span className="mt-2 block text-sm font-semibold text-brand-error">
                  {errors.upiRef.message}
                </span>
              ) : null}
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-brand-brown">Notes</span>
              <input
                className="input-field"
                placeholder="Any delivery note (optional)"
                {...register("notes")}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
