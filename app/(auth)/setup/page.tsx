import AuthWrapper from "@/components/auth-wrapper"
import SetupForm from "./setup-form"

const RegisterPage = () => {
  return (
    <div className="w-full">
    <AuthWrapper subText="Welcome to the setup page." page="setup">
      {/* <LoginForm /> */}
      <SetupForm />
    </AuthWrapper>
   </div>
  )
}

export default RegisterPage