import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.jpg";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Sofas", path: "/sofas" },
  { label: "Chairs", path: "/chairs" },
  { label: "Tables", path: "/tables" },
  { label: "Sales History", path: "/sales-history" },
];

const adminItems = [
  { label: "Employees", path: "/employees" },
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
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand text-white"
        : "text-charcoal/70 hover:bg-black/5"
    }`;

  return (
    <div className="min-h-screen flex bg-offwhite">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/10 flex flex-col">
        <div className="px-6 py-6 flex items-center gap-2">
          <img src={logo} alt="Lehulu" className="w-9 h-9 object-contain" />
          <span className="font-display font-semibold text-charcoal">
            Lehulu
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <p className="px-4 text-xs font-semibold text-graytext uppercase tracking-wide mt-2 mb-1">
            Management
          </p>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}

          {role === "OWNER" && (
            <>
              <p className="px-4 text-xs font-semibold text-graytext uppercase tracking-wide mt-4 mb-1">
                Administration
              </p>
              {adminItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
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