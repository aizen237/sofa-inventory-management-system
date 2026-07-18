import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.jpg";
import {
  LayoutDashboard,
  Sofa,
  Armchair,
  Table2,
  History,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Sofas", path: "/sofas", icon: Sofa },
  { label: "Chairs", path: "/chairs", icon: Armchair },
  { label: "Tables", path: "/tables", icon: Table2 },
  { label: "Sales History", path: "/sales-history", icon: History },
];

const adminItems = [
  { label: "Branches", path: "/branches", icon: Building2 },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Audit Logs", path: "/audit-logs", icon: ShieldCheck },
];

export default function MainLayout() {
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-white/15 text-white"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  const initials =
    role === "OWNER"
      ? "OW"
      : "EM";

  return (
    <div className="min-h-screen flex bg-offwhite">
      {/* Sidebar */}
      <aside className="w-64 bg-brand flex flex-col">
        <div className="px-6 py-6 flex items-center gap-2.5">
          <img
            src={logo}
            alt="Lehulu"
            className="w-9 h-9 object-contain rounded-lg bg-white/90 p-1"
          />
          <div>
            <p className="font-display font-semibold text-white leading-tight">
              Lehulu
            </p>
            <p className="text-[11px] text-white/60 leading-tight">
              General Trading
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2">
          <p className="px-4 text-[11px] font-semibold text-white/50 uppercase tracking-wide mt-2 mb-1">
            Management
          </p>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              <item.icon size={17} className="mr-2.5 shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {role === "OWNER" && (
            <>
              <p className="px-4 text-[11px] font-semibold text-white/50 uppercase tracking-wide mt-4 mb-1">
                Administration
              </p>
              {adminItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={linkClass}>
                  <item.icon size={17} className="mr-2.5 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <NavLink to="/settings" className={linkClass}>
            <Settings size={17} className="mr-2.5 shrink-0" />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={17} className="mr-2.5 shrink-0" />
            Logout
          </button>

          <div className="pt-3 mt-2 border-t border-white/15 flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {role === "OWNER" ? "Owner" : "Employee"}
              </p>
              <p className="text-[11px] text-white/60 truncate">
                {role === "OWNER" ? "Owner" : "Staff"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-6">
          <input
            type="text"
            placeholder="Search inventory, sales..."
            className="w-80 text-sm border border-black/10 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <div className="text-sm font-medium text-charcoal">
            {role === "OWNER" ? "Owner" : "Employee"}
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}