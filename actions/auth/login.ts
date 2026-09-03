"use server"

import { signIn } from "@/auth"

export const loginAction = async (data: {username: string, password: string}) => {
    try {
        await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirectTo: "/dashboard"
        })

        return {
            success: true,
            message: "Login successful"
        }
    } catch (error) {
        console.error("Login failed:", error)

        return {
            success: false,
            message: "Invalid username or password"
        }
    }
}