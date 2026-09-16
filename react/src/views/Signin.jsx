import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { PORTALS, PORTAL_LABELS, homePath } from "../auth/roles.js";

const portals = [
  {
    id: PORTALS.BUYER,
    title: "Buyer",
    hint: "Browse produce and place orders",
  },
  {
    id: PORTALS.SELLER,
    title: "Seller",
    hint: "Manage farms, listings, and deliveries",
  },
  {
    id: PORTALS.ADMIN,
    title: "DA Admin",
    hint: "Users, prices, barangays, and reports",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { token, userType, portal, setUserName, setToken, setCurrentUserID, setUserType, setPortal } =
    useStateContext();
  const [selectedPortal, setSelectedPortal] = useState(PORTALS.BUYER);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null);

  if (token) {
    return <Navigate to={homePath(userType, portal)} replace />;
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    axiosClient
      .post("/login", {
        mobile_number: mobileNumber,
        password,
        portal: selectedPortal,
      })
      .then(({ data }) => {
        setToken(data.token);
        setUserType(data.userType);
        setUserName(data.userName);
        setCurrentUserID(data.encryptedCurrentUserID);
        setPortal(data.portal || selectedPortal);
        navigate(homePath(data.userType, data.portal || selectedPortal), { replace: true });
      })
      .catch((err) => {
        const response = err.response;
        if (response?.data?.message) {
          setErrors({ message: response.data.message });
        } else if (response?.data?.errors) {
          const first = Object.values(response.data.errors).flat()[0];
          setErrors({ message: first || "Please check the form and try again." });
        } else {
          setErrors({ message: "Unable to sign in. Please try again." });
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-shop-500 px-4 py-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-sm bg-white shadow-lift lg:grid-cols-2">
        <div className="relative hidden bg-gradient-to-br from-shop-700 to-emerald-400 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">LGU Lantapan</p>
            <h1 className="mt-3 text-5xl font-black italic">E-Tabo</h1>
            <p className="mt-4 max-w-sm text-white/90">
              Shop farm harvest like a mall — buyers, sellers, and DA in one place.
            </p>
          </div>
          <img src="/logo.jpg" alt="E-Tabo" className="mt-8 max-h-40 w-fit rounded-sm bg-white p-3" />
          <p className="text-xs text-white/80">Sign in only to the portal your account is allowed to use.</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-6 lg:hidden">
            <p className="text-sm font-black italic text-shop-500">E-Tabo</p>
            <h1 className="text-2xl font-bold text-stone-900">Sign in</h1>
          </div>
          <h2 className="hidden text-2xl font-bold text-stone-900 lg:block">Sign in to your portal</h2>
          <p className="mt-1 text-sm text-stone-500">
            Access is limited to the privilege of your verified user type.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {portals.map((item) => {
              const active = selectedPortal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedPortal(item.id);
                    setErrors(null);
                  }}
                  className={`rounded-sm border px-3 py-3 text-left transition ${
                    active
                      ? "border-shop-500 bg-shop-50 ring-2 ring-shop-500"
                      : "border-stone-200 hover:border-shop-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-1 text-xs text-stone-500">{item.hint}</p>
                </button>
              );
            })}
          </div>

          {errors?.message && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errors.message}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Mobile number</span>
              <input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                inputMode="numeric"
                autoComplete="tel"
                placeholder="09xxxxxxxxx"
                className="w-full rounded-sm border border-stone-300 px-4 py-3 outline-none ring-shop-500 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">Password</span>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-stone-300 px-4 py-3 pr-16 outline-none ring-shop-500 focus:ring-2"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-shop-600"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shop-btn w-full py-3 disabled:opacity-60"
            >
              {isSubmitting
                ? "Signing in…"
                : `Continue as ${PORTAL_LABELS[selectedPortal]}`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600">
            No account yet?
            <Link to="/signup" className="ml-1 font-semibold text-shop-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
