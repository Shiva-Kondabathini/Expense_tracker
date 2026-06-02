import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/shared/utils/error";
import { registerUser } from "../services/auth.service";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();

  // no dispatch needed; registration requires email verification

  const { register, handleSubmit } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(data);

      toast.success(response.message || "Registration successful");
      if (response.emailPreviewUrl) {
        toast.success(`Preview email: ${response.emailPreviewUrl}`);
      }

      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed"));
    }
  };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
        />

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
        />

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
        />

        <button className="w-full rounded-xl bg-blue-600 p-3">Register</button>
      </form>
    </>
  );
};

export default RegisterPage;
