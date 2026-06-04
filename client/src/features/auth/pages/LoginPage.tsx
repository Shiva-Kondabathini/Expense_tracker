import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../authSlice";

import { useAppDispatch } from "@/store/hooks";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/shared/utils/error";
import { loginUser } from "../services/auth.service";

import { saveToken } from "@/shared/utils/authStore";
interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);

      saveToken(response.token);

      dispatch(login(response.user));

      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div> */}

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 p-3 font-medium"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">
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

export default LoginPage;
