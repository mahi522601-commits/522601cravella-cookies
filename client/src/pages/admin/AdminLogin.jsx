import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { adminLoginSchema } from "@/utils/validators";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Welcome back to Cravella Admin");
      navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Invalid admin credentials");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Cravella Cookies</title>
      </Helmet>

      <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,136,42,0.25),_transparent_28%),linear-gradient(180deg,_rgba(250,243,232,1),_rgba(245,236,215,1))] px-4 py-12">
        <div className="glass-panel w-full max-w-md p-8 sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-brown text-brand-cream">
              <FiLock className="h-7 w-7" />
            </div>
            <p className="section-kicker mt-6">Admin Portal</p>
            <h1 className="mt-3 text-4xl font-semibold">Cravella Cookies</h1>
            <p className="mt-3 text-brand-brown/70">
              Sign in with your Firebase admin credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-brand-brown">Email</span>
              <input className="input-field" placeholder="admin@cravella.com" {...register("email")} />
              {errors.email ? (
                <span className="mt-2 block text-sm font-semibold text-brand-error">
                  {errors.email.message}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-brand-brown">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pr-12"
                  placeholder="Enter password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-brown/65"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password ? (
                <span className="mt-2 block text-sm font-semibold text-brand-error">
                  {errors.password.message}
                </span>
              ) : null}
            </label>

            <Button type="submit" fullWidth loading={isSubmitting}>
              Login
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
