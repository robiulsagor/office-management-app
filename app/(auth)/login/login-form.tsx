"use client";

import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "./login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form submitted:", data);
  }
console.log(errors)
  return (
    <div>
      <form onSubmit={ handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-[14px] text-[#16232B] font-medium mb-2"
          >
            Username
          </label>
          <div className="relative">
            <Input
              type="text"
              {...register("username")}
              className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            <User2 className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
          </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-[14px] text-[#16232B] font-medium mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Input
              type="password"
              {...register("password")}
              className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
          </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
