import { QRCodeCanvas } from "qrcode.react";
import { buildUpiString } from "@/services/upi";
import { formatCurrency } from "@/utils/formatCurrency";

const UpiQRCode = ({ totalAmount, upiId, upiName }) => (
  <div className="rounded-[1.75rem] bg-brand-light/70 p-5 text-center">
    <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-brown/65">
      Amount to Pay
    </p>
    <p className="mt-2 text-3xl font-black text-brand-brown">{formatCurrency(totalAmount)}</p>
    <div className="mt-5 inline-flex rounded-[1.75rem] bg-brand-white p-4 shadow-soft">
      <QRCodeCanvas
        value={buildUpiString(totalAmount, { upiId, upiName })}
        size={220}
        bgColor="#FFF8EE"
        fgColor="#6B3A2A"
        level="H"
        includeMargin
      />
    </div>
    <p className="mt-4 text-sm text-brand-brown/70">
      Scan with any UPI app • Amount pre-filled
    </p>
  </div>
);

export default UpiQRCode;
