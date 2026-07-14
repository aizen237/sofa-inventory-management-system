import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/logo.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data.token, data.role, data.branchId);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal flex-col items-center justify-center px-12">
        <img src={logo} alt="Lehulu General Trading" className="w-56 mb-8" />
        <p className="text-offwhite/70 text-center font-sans text-sm max-w-xs">
          Manage inventory across Addis Ababa and Hawassa, all in one place.
        </p>
      </div>

      {/* Right: login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-semibold text-2xl text-charcoal mb-1">
            Welcome back
          </h1>
          <p className="text-graytext text-sm mb-8">
            Sign in to your Lehulu account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-graytext mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                placeholder="you@sofacompany.local"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-graytext mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg py-2.5 transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}