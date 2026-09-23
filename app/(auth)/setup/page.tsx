import AuthWrapper from "@/components/auth-wrapper";
import SetupForm from "./setup-form";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const existingUser = await prisma.user.findFirst();

  if (existingUser) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <AuthWrapper subText="Welcome to the setup page." page="setup">
        <SetupForm />
      </AuthWrapper>
    </div>
  );
};

export default RegisterPage;