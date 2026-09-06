import { auth } from "@/auth"

const Dashboard = async () => {
const session = await auth()

console.log(session)
  return (
    <div>
      Hi, this is dashboard page. You can add your dashboard components here.
    </div>
  )
}

export default Dashboard
