import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiChevronDown, FiPrinter, FiTrash2 } from "react-icons/fi";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useRealtimeOrders } from "@/hooks/useOrders";
import { deleteOrder, formatTimestampIST, updateOrder } from "@/services/firestore";
import { formatCurrency } from "@/utils/formatCurrency";

const orderStatuses = ["all", "placed", "confirmed", "packed", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["all", "pending", "verified", "rejected"];

const AdminOrders = () => {
  const { orders, loading } = useRealtimeOrders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedId, setExpandedId] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const previousCountRef = useRef(0);

  useEffect(() => {
    if (!orders.length) return;
    if (previousCountRef.current && orders.length > previousCountRef.current) {
      toast.success("New Order! A fresh order just arrived.");
    }
    previousCountRef.current = orders.length;
  }, [orders]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const filteredOrders = useMemo(() => {
    const search = (searchParams.get("search") || "").toLowerCase();
    const orderStatus = searchParams.get("orderStatus") || "all";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const sort = searchParams.get("sort") || "newest";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let next = orders.filter((order) => {
      const orderDate = order.placedAt?.toDate?.();
      const matchesSearch = search
        ? `${order.id} ${order.customer?.fullName || ""} ${order.customer?.phone || ""}`
            .toLowerCase()
            .includes(search)
        : true;
      const matchesOrderStatus = orderStatus === "all" ? true : order.orderStatus === orderStatus;
      const matchesPaymentStatus =
        paymentStatus === "all" ? true : order.paymentStatus === paymentStatus;
      const matchesFrom = from && orderDate ? orderDate >= new Date(from) : true;
      const matchesTo = to && orderDate ? orderDate <= new Date(`${to}T23:59:59`) : true;

      return matchesSearch && matchesOrderStatus && matchesPaymentStatus && matchesFrom && matchesTo;
    });

    next = next.sort((left, right) => {
      if (sort === "oldest") {
        return (left.placedAt?.seconds || 0) - (right.placedAt?.seconds || 0);
      }
      if (sort === "amount-high-low") {
        return Number(right.totalAmount || 0) - Number(left.totalAmount || 0);
      }
      return (right.placedAt?.seconds || 0) - (left.placedAt?.seconds || 0);
    });

    return next;
  }, [orders, searchParams]);

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      await updateOrder(orderId, { [field]: value });
      toast.success("Order updated");
    } catch (error) {
      toast.error(error.message || "Unable to update order");
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order ${order.id}?`)) return;
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted");
    } catch (error) {
      toast.error(error.message || "Unable to delete order");
    }
  };

  const printOrder = (order) => {
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #3B1F14; }
            h1, h2 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .muted { color: #6B3A2A; opacity: 0.8; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>Cravella Cookies Receipt</h1>
          <p class="muted">${order.id}</p>
          <h2>Customer</h2>
          <p>${order.customer?.fullName}</p>
          <p>${order.customer?.phone}</p>
          <p>${order.customer?.address}, ${order.customer?.city}, ${order.customer?.district}, ${order.customer?.pincode}</p>
          <h2>Items</h2>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              ${order.orderItems
                ?.map(
                  (item) =>
                    `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.price}</td></tr>`,
                )
                .join("")}
            </tbody>
          </table>
          <h2>Total: ${order.totalAmount}</h2>
          <p>Payment Method: ${order.paymentMethod}</p>
          <p>Payment Status: ${order.paymentStatus}</p>
          <script>window.print()</script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <>
      <Helmet>
        <title>Admin Orders | Cravella Cookies</title>
      </Helmet>

      <div className="space-y-6">
        <div className="grid gap-4 rounded-[2rem] border border-brand-brown/10 bg-white/85 p-5 shadow-soft xl:grid-cols-5">
          <input
            className="input-field xl:col-span-2"
            placeholder="Search by Order ID, customer, or phone"
            value={searchParams.get("search") || ""}
            onChange={(event) => setFilter("search", event.target.value)}
          />
          <select className="input-field" value={searchParams.get("orderStatus") || "all"} onChange={(event) => setFilter("orderStatus", event.target.value)}>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Order Statuses" : status}
              </option>
            ))}
          </select>
          <select className="input-field" value={searchParams.get("paymentStatus") || "all"} onChange={(event) => setFilter("paymentStatus", event.target.value)}>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Payment Statuses" : status}
              </option>
            ))}
          </select>
          <select className="input-field" value={searchParams.get("sort") || "newest"} onChange={(event) => setFilter("sort", event.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high-low">Amount High-Low</option>
          </select>
          <input type="date" className="input-field" value={searchParams.get("from") || ""} onChange={(event) => setFilter("from", event.target.value)} />
          <input type="date" className="input-field" value={searchParams.get("to") || ""} onChange={(event) => setFilter("to", event.target.value)} />
        </div>

        <div className="card-surface overflow-hidden">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <Spinner className="h-8 w-8 text-brand-brown" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-brand-light/70 text-brand-brown/70">
                  <tr>
                    <th className="px-5 py-4 font-bold">Order ID</th>
                    <th className="px-5 py-4 font-bold">Customer</th>
                    <th className="px-5 py-4 font-bold">Phone</th>
                    <th className="px-5 py-4 font-bold">Total</th>
                    <th className="px-5 py-4 font-bold">Items</th>
                    <th className="px-5 py-4 font-bold">Payment</th>
                    <th className="px-5 py-4 font-bold">Payment Status</th>
                    <th className="px-5 py-4 font-bold">Order Status</th>
                    <th className="px-5 py-4 font-bold">Placed At</th>
                    <th className="px-5 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <Fragment key={order.id}>
                      <tr key={order.id} className="border-t border-brand-brown/5 align-top">
                        <td className="px-5 py-4 font-bold text-brand-dark">{order.id}</td>
                        <td className="px-5 py-4 text-brand-dark">{order.customer?.fullName}</td>
                        <td className="px-5 py-4 text-brand-dark">{order.customer?.phone}</td>
                        <td className="px-5 py-4 text-brand-dark">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-5 py-4 text-brand-dark">{order.orderItems?.length || 0}</td>
                        <td className="px-5 py-4 text-brand-dark">{order.paymentMethod}</td>
                        <td className="px-5 py-4">
                          <select
                            className="rounded-full border border-brand-brown/15 bg-brand-light px-3 py-2"
                            value={order.paymentStatus}
                            onChange={(event) => handleStatusUpdate(order.id, "paymentStatus", event.target.value)}
                          >
                            {paymentStatuses.filter((status) => status !== "all").map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            className="rounded-full border border-brand-brown/15 bg-brand-light px-3 py-2"
                            value={order.orderStatus}
                            onChange={(event) => handleStatusUpdate(order.id, "orderStatus", event.target.value)}
                          >
                            {orderStatuses.filter((status) => status !== "all").map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-brand-brown/70">{formatTimestampIST(order.placedAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<FiChevronDown className={`transition ${expandedId === order.id ? "rotate-180" : ""}`} />}
                              onClick={() => setExpandedId((value) => (value === order.id ? "" : order.id))}
                            >
                              Details
                            </Button>
                            <Button variant="ghost" size="sm" icon={<FiPrinter />} onClick={() => printOrder(order)}>
                              Print
                            </Button>
                            <a
                              href={`https://wa.me/${order.customer?.phone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-full border border-brand-brown/10 px-4 py-2 font-bold text-brand-brown"
                            >
                              WhatsApp
                            </a>
                            <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => handleDelete(order)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === order.id ? (
                        <tr className="border-t border-brand-brown/5 bg-brand-light/30">
                          <td className="px-5 py-5" colSpan={10}>
                            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                              <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Customer Details</h3>
                                <p>{order.customer?.fullName}</p>
                                <p>{order.customer?.phone}</p>
                                <p>{order.customer?.email || "No email provided"}</p>
                                <p>
                                  {order.customer?.address}, {order.customer?.city}, {order.customer?.district},{" "}
                                  {order.customer?.pincode}
                                </p>
                                {order.paymentScreenshotUrl ? (
                                  <button className="mt-3 h-28 w-28 overflow-hidden rounded-2xl border border-brand-brown/10 bg-white" onClick={() => setPreviewUrl(order.paymentScreenshotUrl)}>
                                    <img src={order.paymentScreenshotUrl} alt="Payment screenshot" className="h-full w-full object-cover" />
                                  </button>
                                ) : null}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">Order Items</h3>
                                <div className="mt-4 space-y-3">
                                  {order.orderItems?.map((item) => (
                                    <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-white px-4 py-4">
                                      <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-brand-light">
                                          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" /> : null}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-brand-dark">{item.name}</p>
                                          <p className="text-sm text-brand-brown/70">Qty {item.qty}</p>
                                        </div>
                                      </div>
                                      <p className="font-bold text-brand-brown">{formatCurrency(item.price * item.qty)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={Boolean(previewUrl)} onClose={() => setPreviewUrl("")} title="Payment Screenshot" panelClassName="sm:max-w-3xl">
        <div className="p-5 sm:p-6">
          <img src={previewUrl} alt="Payment screenshot preview" className="w-full rounded-[1.5rem]" />
        </div>
      </Modal>
    </>
  );
};

export default AdminOrders;
