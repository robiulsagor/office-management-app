import AuthWrapper from "@/components/auth-wrapper";
import SetupForm from "./setup-form";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: {
        in: ["ADMIN", "SUPER_ADMIN"],
      },
    },
  });

  if (existingAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full">
      <AuthWrapper subText="Welcome to the setup page." page="setup">
        {/* <LoginForm /> */}
        <SetupForm />
      </AuthWrapper>
    </div>
  );
};

export default RegisterPage;
