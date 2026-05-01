export const buildUpiString = ({ upiId, upiName, amount, note = "CravellaCookies Order" }) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiName,
  )}&am=${Number(amount || 0).toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
