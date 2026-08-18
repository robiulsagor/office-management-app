import Navbar from "@/components/layout/Navbar"
import Sidebar from "@/components/layout/Sidebar"
import React from "react"

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <Sidebar/>
      <div>
        <Navbar/>
        {children}
      </div>
    </>
  )
}

export default DashboardLayout
