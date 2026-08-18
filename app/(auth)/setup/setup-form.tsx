"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, User2 } from "lucide-react";

import { SetupFormValues, setupSchema } from "./setup-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SetupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
  });

  const onSubmit = (data: SetupFormValues) => {
    console.log("Setup submitted:", data);
  };

  return (
    <div className="px-4 md:px-5 w-full max-w-md">
      <p className="text-lg text-slate-500 font-bold">
        Create administrator account
      </p>

      <p className="text-sm text-slate-400 mt-1">
        Set up the main administrator for your office.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="md:flex gap-2 space-y-4">
          <div className="flex-1">
            <Label
              htmlFor="fullName"
              className="block text-[14px] text-slate-400 font-medium mb-1"
            >
              Full Name
            </Label>

            <div className="relative">
              <Input
                id="fullName"
                type="text"
                {...register("fullName")}
                className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                placeholder="Enter your full name"
              />

              <User className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="flex-1">
            <Label
              htmlFor="username"
              className="block text-[14px] text-slate-400 font-medium mb-1"
            >
              Username
            </Label>

            <div className="relative">
              <Input
                id="username"
                type="text"
                {...register("username")}
                className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Choose a username"
              />

              <User2 className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
        </div>
        {/* Full Name */}

        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="block text-[14px] text-slate-400 font-medium mb-1"
          >
            Email
          </Label>

          <div className="relative">
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your email"
            />

            <Mail className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="md:flex gap-2 space-y-4">
          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="block text-[14px] text-slate-400 font-medium mb-1"
            >
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Create a password"
              />

              <Lock className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-[14px] text-slate-400 font-medium mb-1"
            >
              Confirm Password
            </Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="border border-[#D7E0DF] rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Confirm password"
              />

              <Lock className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-teal-700 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Administrator"}
        </Button>
      </form>
    </div>
  );
};

export default SetupForm;
