"use client";

import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "./login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });
    console.log(result);

    if (result?.error) {
      setError("root", {
        type: "manual",
        message: "Invalid username or password",
      });
      console.log("Login failed:", result.error);
      return;
    }
    toast.success("Login successful!");
    router.push("/dashboard");
  };

  console.log(errors);

  return (
    <div className="px-4 md:px-10">
      <p className="text-lg text-slate-500 font-bold">
        Sign in to your account
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {/* username field */}
        <div className="mb-6">
          <Label
            htmlFor="username"
            className="block text-[14px] text-slate-400 font-medium"
          >
            Username
          </Label>
          <div className="relative">
            <Input
              type="text"
              {...register("username")}
              className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your username"
            />
            <User2 className="w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
          </div>
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* password field */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <Label
              htmlFor="password"
              className="block text-[14px] text-slate-400 font-medium"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-blue-400 md:text-xs text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type="password"
              {...register("password")}
              className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your password"
            />
            <Lock className="w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {errors.root && (
          <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>
        )}
        <Button
          type="submit"
          size={"sm"}
          className={`bg-teal-700 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
