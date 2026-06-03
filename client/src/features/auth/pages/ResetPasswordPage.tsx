import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/shared/utils/error";
import { resetPassword } from "../services/auth.service";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>();

  const password = watch("password");

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      toast.error("Invalid reset link");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.success) {
        toast.success(response.message);

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reset password"));
    }
  };

  if (!isValidToken) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-red-500">Invalid Link</h1>
        <p className="mb-6 text-slate-400">
          This password reset link is invalid or has expired.
        </p>
        <Link
          to="/forgot-password"
          className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Reset Password</h1>
      <p className="mb-6 text-slate-400">
        Enter your new password below. Make sure it&apos;s strong and secure.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            disabled={isSubmitting}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message:
                  "Password must contain uppercase, lowercase, number, and special character",
              },
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 disabled:opacity-50"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            disabled={isSubmitting}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 disabled:opacity-50"
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-blue-600 p-3 font-medium disabled:opacity-50"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
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
    </>
  );
};

export default ResetPasswordPage;
