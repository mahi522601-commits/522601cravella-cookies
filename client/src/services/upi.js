export const DEFAULT_UPI_ID = "8096697748-3@ybl";
export const DEFAULT_UPI_NAME = "CravellaCookies";

const sanitizeAmount = (amount) => Number(amount || 0).toFixed(2);

export const buildUpiString = (
  amount,
  {
    upiId = DEFAULT_UPI_ID,
    upiName = DEFAULT_UPI_NAME,
    note = "CravellaCookies+Order",
  } = {},
) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiName,
  )}&am=${sanitizeAmount(amount)}&cu=INR&tn=${note}`;

export const buildPaymentLinks = (
  amount,
  { upiId = DEFAULT_UPI_ID, upiName = DEFAULT_UPI_NAME } = {},
) => {
  const total = sanitizeAmount(amount);

  return {
    PhonePe: `phonepe://pay?pa=${encodeURIComponent(
      upiId,
    )}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=Order`,
    GooglePay: `tez://upi/pay?pa=${encodeURIComponent(
      upiId,
    )}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`,
    Paytm: `paytmmp://pay?pa=${encodeURIComponent(
      upiId,
    )}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR`,
  };
};

export const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
