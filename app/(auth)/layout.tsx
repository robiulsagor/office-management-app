import React from 'react'

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-2">
      {children}
    </div>
  )
}

export default AuthLayout
