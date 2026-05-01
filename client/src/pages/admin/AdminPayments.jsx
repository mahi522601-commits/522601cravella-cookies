import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useRealtimeOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTimestampIST, updateOrder, deleteOrder } from "@/services/firestore";

const AdminPayments = () => {
  const { orders, loading } = useRealtimeOrders();
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, customerName }
  const [deleting, setDeleting] = useState(false);

  const paymentRows = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus = filter === "all" ? true : order.paymentStatus === filter;
        return order.paymentScreenshotUrl && matchesStatus;
      }),
    [orders, filter],
  );

  const updateStatus = async (orderId, paymentStatus) => {
    try {
      await updateOrder(orderId, { paymentStatus });
      toast.success(`Payment ${paymentStatus}`);
    } catch (error) {
      toast.error(error.message || "Unable to update payment");
    }
  };

  const bulkUpdate = async (paymentStatus) => {
    try {
      await Promise.all(selectedIds.map((id) => updateOrder(id, { paymentStatus })));
      setSelectedIds([]);
      toast.success(`Selected payments marked ${paymentStatus}`);
    } catch (error) {
      toast.error(error.message || "Bulk payment update failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      setSelectedIds((current) => current.filter((id) => id !== deleteTarget.id));
      toast.success("Order deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Payments | Cravella Cookies</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-brand-brown/10 bg-white/85 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <select
            className="input-field sm:max-w-64"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          {selectedIds.length ? (
            <div className="flex flex-wrap gap-3">
              <Button variant="success" onClick={() => bulkUpdate("verified")}>
                Bulk Verify
              </Button>
              <Button variant="danger" onClick={() => bulkUpdate("rejected")}>
                Bulk Reject
              </Button>
            </div>
          ) : null}
        </div>

        <div className="card-surface overflow-hidden">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <Spinner className="h-8 w-8 text-brand-brown" />
            </div>
          ) : paymentRows.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center text-brand-brown/50">
              No payment records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-brand-light/70 text-brand-brown/70">
                  <tr>
                    <th className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={paymentRows.length > 0 && selectedIds.length === paymentRows.length}
                        onChange={(event) =>
                          setSelectedIds(event.target.checked ? paymentRows.map((order) => order.id) : [])
                        }
                      />
                    </th>
                    <th className="px-5 py-4 font-bold">Order ID</th>
                    <th className="px-5 py-4 font-bold">Customer</th>
                    <th className="px-5 py-4 font-bold">Amount</th>
                    <th className="px-5 py-4 font-bold">Method</th>
                    <th className="px-5 py-4 font-bold">Screenshot</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold">Date</th>
                    <th className="px-5 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((order) => (
                    <tr key={order.id} className="border-t border-brand-brown/5 hover:bg-brand-light/30 transition-colors">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={(event) =>
                            setSelectedIds((current) =>
                              event.target.checked
                                ? [...current, order.id]
                                : current.filter((id) => id !== order.id),
                            )
                          }
                        />
                      </td>
                      <td className="px-5 py-4 font-bold text-brand-dark">{order.id}</td>
                      <td className="px-5 py-4 text-brand-dark">{order.customer?.fullName}</td>
                      <td className="px-5 py-4 text-brand-dark">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-5 py-4 text-brand-dark">{order.paymentMethod}</td>
                      <td className="px-5 py-4">
                        <button
                          className="h-16 w-16 overflow-hidden rounded-2xl border border-brand-brown/10 bg-brand-light hover:scale-105 transition-transform"
                          onClick={() => setPreviewUrl(order.paymentScreenshotUrl)}
                        >
                          <img
                            src={order.paymentScreenshotUrl}
                            alt="Payment screenshot"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 font-semibold text-xs ${
                            order.paymentStatus === "verified"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-brand-light text-brand-brown"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-brand-brown/70">{formatTimestampIST(order.placedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateStatus(order.id, "verified")}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateStatus(order.id, "rejected")}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPreviewUrl(order.paymentScreenshotUrl)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteTarget({
                                id: order.id,
                                customerName: order.customer?.fullName || "this order",
                              })
                            }
                            className="border border-red-200 text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      <Modal
        isOpen={Boolean(previewUrl)}
        onClose={() => setPreviewUrl("")}
        title="Payment Screenshot"
        panelClassName="sm:max-w-3xl"
      >
        <div className="p-5 sm:p-6">
          <img
            src={previewUrl}
            alt="Payment screenshot preview"
            className="w-full rounded-[1.5rem]"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete Order"
        panelClassName="sm:max-w-md"
      >
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-brand-dark">
                Delete order {deleteTarget?.id}?
              </p>
              <p className="mt-1 text-sm text-brand-brown/70">
                This will permanently delete the order for <span className="font-medium text-brand-brown">{deleteTarget?.customerName}</span>. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" /> Deleting...
                </span>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminPayments;