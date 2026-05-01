import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiImage, FiLogOut, FiMenu, FiPackage, FiSettings, FiShield } from "react-icons/fi";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { MdOutlinePayments } from "react-icons/md";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/orders", label: "Orders", icon: HiOutlineReceiptTax },
  { to: "/admin/payments", label: "Payments", icon: MdOutlinePayments },
  { to: "/admin/hero", label: "Hero Images", icon: FiImage },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();

  const activeTitle =
    links.find((item) => (item.exact ? item.to === location.pathname : location.pathname.startsWith(item.to)))
      ?.label || "Admin";

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-brand-light/60">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform bg-brand-brown text-brand-cream shadow-soft transition duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="section-kicker text-brand-beige/70">Cravella</p>
            <h1 className="mt-2 text-2xl font-semibold text-brand-white">Admin Studio</h1>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {links.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition",
                    isActive
                      ? "bg-white/14 text-white shadow-soft"
                      : "text-brand-cream/80 hover:bg-white/8 hover:text-white",
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/10 px-5 py-5">
            <Button
              variant="secondary"
              className="w-full justify-center border-white/20 bg-white/10 text-brand-cream hover:bg-white/15"
              icon={<FiLogOut />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-brand-brown/10 bg-brand-white/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-full border border-brand-brown/15 p-2 text-brand-brown lg:hidden"
                onClick={() => setSidebarOpen((value) => !value)}
                aria-label="Toggle admin menu"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <div>
                <p className="section-kicker">Control room</p>
                <h2 className="text-2xl font-semibold text-brand-dark">{activeTitle}</h2>
              </div>
            </div>
            <div className="hidden items-center gap-3 rounded-full border border-brand-brown/10 bg-brand-light px-4 py-2 text-sm font-semibold text-brand-brown sm:flex">
              <FiShield className="h-4 w-4" />
              {adminUser?.email || "Admin"}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
