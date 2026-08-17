import AuthWrapper from "@/components/auth-wrapper"
import LoginForm from "./login-form"

const LoginPage = () => {
  return (
   <div className="w-full">
    <AuthWrapper subText="Log in.">
      <LoginForm />
    </AuthWrapper>
   </div>
  )
}

export default LoginPage
