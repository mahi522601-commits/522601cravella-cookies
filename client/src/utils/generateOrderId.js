const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateOrderId = () => {
  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  })
    .format(new Date())
    .replaceAll("-", "");

  const suffix = Array.from({ length: 4 }, () => {
    const index = Math.floor(Math.random() * randomChars.length);
    return randomChars[index];
  }).join("");

  return `CRV-${formattedDate}-${suffix}`;
};
