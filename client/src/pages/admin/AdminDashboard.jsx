import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiBox, FiClock, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { fetchDashboardOverview, formatTimestampIST, listenToOrders } from "@/services/firestore";
import { formatCurrency } from "@/utils/formatCurrency";

const statMeta = [
  { key: "totalOrders", label: "Total Orders", icon: FiShoppingBag },
  { key: "totalRevenue", label: "Total Revenue", icon: FiDollarSign, currency: true },
  { key: "pendingOrders", label: "Pending Orders", icon: FiClock },
  { key: "totalProducts", label: "Total Products", icon: FiBox },
];

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const response = await fetchDashboardOverview();
      setOverview(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    const unsubscribe = listenToOrders(() => {
      loadOverview();
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Cravella Cookies</title>
      </Helmet>

      {loading && !overview ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner className="h-8 w-8 text-brand-brown" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statMeta.map(({ key, label, icon: Icon, currency }) => (
              <div key={key} className="card-surface p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-brown/65">
                      {label}
                    </p>
                    <p className="mt-4 text-3xl font-black text-brand-dark">
                      {currency ? formatCurrency(overview?.[key]) : overview?.[key] || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-brand-light p-3 text-brand-brown">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="card-surface p-6">
              <h2 className="text-2xl font-semibold">Orders Per Day</h2>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview?.charts || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#edd9b0" />
                    <XAxis dataKey="name" stroke="#6B3A2A" />
                    <YAxis stroke="#6B3A2A" allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#6B3A2A" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="text-2xl font-semibold">Revenue Per Week</h2>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview?.charts || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#edd9b0" />
                    <XAxis dataKey="name" stroke="#6B3A2A" />
                    <YAxis stroke="#6B3A2A" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#C9882A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Recent Orders</h2>
              <Button variant="secondary" onClick={loadOverview}>
                Refresh
              </Button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-brown/10 text-brand-brown/70">
                    <th className="pb-3 font-bold">Order ID</th>
                    <th className="pb-3 font-bold">Customer</th>
                    <th className="pb-3 font-bold">Amount</th>
                    <th className="pb-3 font-bold">Payment</th>
                    <th className="pb-3 font-bold">Placed At</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.recentOrders || []).map((order) => (
                    <tr key={order.id} className="border-b border-brand-brown/5">
                      <td className="py-4 font-bold text-brand-dark">{order.id}</td>
                      <td className="py-4 text-brand-dark">{order.customer?.fullName}</td>
                      <td className="py-4 text-brand-dark">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-brand-light px-3 py-1 font-semibold text-brand-brown">
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 text-brand-brown/70">{formatTimestampIST(order.placedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
