import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/shared/utils/error";
import { forgotPassword } from "../services/auth.service";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data);

      if (response.success) {
        toast.success(response.message);

        if (response.emailPreviewUrl) {
          toast.success("Email preview available", {
            duration: 5000,
            icon: "📧",
          });
          // You could optionally open the preview URL
        }

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send reset link"));
    }
  };

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Forgot Password</h1>
      <p className="mb-6 text-slate-400">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            disabled={isSubmitting}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 disabled:opacity-50"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-blue-600 p-3 font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
