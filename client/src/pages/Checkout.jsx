import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OrderSummary from "@/components/checkout/OrderSummary";
import CustomerForm from "@/components/checkout/CustomerForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/services/firestore";
import { generateOrderId } from "@/utils/generateOrderId";
import { customerSchema } from "@/utils/validators";
import { useUiStore } from "@/store/uiStore";

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const siteSettings = useUiStore((state) => state.siteSettings);
  const [paymentMethod, setPaymentMethod] = useState("PhonePe");
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
  } = useForm({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      pincode: "",
      address: "",
      upiRef: "",
      notes: "",
    },
  });

  const onInvalid = (formErrors) => {
    const firstField = Object.keys(formErrors)[0];
    if (firstField) {
      setFocus(firstField);
      formRef.current?.querySelector(`[name="${firstField}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    toast.error("Please fill in the required details.");
  };

  const onSubmit = async (values) => {
    if (!screenshot?.url) {
      toast.error("Please upload the payment screenshot before placing the order.");
      return;
    }

    setSubmitting(true);
    const orderId = generateOrderId();

    try {
      await createOrder({
        id: orderId,
        orderItems: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl || "",
          qty: item.qty,
          price: item.price,
        })),
        customer: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email || "",
          city: values.city,
          district: values.district,
          pincode: values.pincode,
          address: values.address,
        },
        totalAmount: subtotal,
        shippingCharge: 0,
        paymentMethod,
        paymentScreenshotUrl: screenshot.url,
        paymentStatus: "pending",
        orderStatus: "placed",
        upiRef: values.upiRef || "",
        notes: values.notes || "",
      });

      clearCart();
      toast.success("Order placed successfully!");
      window.open(
        `https://wa.me/${siteSettings.whatsappNumber}?text=Hi+CravellaCookies!+I+just+placed+Order+${orderId}.+Please+confirm.`,
        "_blank",
        "noopener,noreferrer",
      );
      navigate(`/order-success?id=${orderId}`);
    } catch (error) {
      toast.error(error.message || "Unable to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Cravella Cookies</title>
        <meta
          name="description"
          content="Complete your Cravella Cookies order with delivery details and UPI payment."
        />
      </Helmet>

      <section className="page-shell py-14">
        <div className="max-w-3xl">
          <p className="section-kicker">Checkout</p>
          <h1 className="mt-3 text-5xl font-semibold">Complete your order</h1>
          <p className="mt-4 text-lg text-brand-brown/75">
            One smooth flow for order summary, delivery details, and UPI payment.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit(onSubmit, onInvalid)} className="mt-10 space-y-8">
          <OrderSummary items={items} subtotal={subtotal} />
          <CustomerForm register={register} errors={errors} />
          <PaymentSection
            totalAmount={subtotal}
            siteSettings={siteSettings}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            screenshot={screenshot}
            setScreenshot={setScreenshot}
            register={register}
            errors={errors}
          />
          <div className="flex justify-end">
            <Button type="submit" size="lg" loading={submitting} disabled={!isValid || !screenshot?.url}>
              Place Order
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Checkout;
