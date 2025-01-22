"use client"

import { useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const { isSignedIn } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const publicRoutes = ["/", "/login", "/signup"]
      if (publicRoutes.includes(pathname)) {
        router.push("/compare")
      }
    }
  }, [isLoaded, isSignedIn, router, pathname])

  return <>{children}</>
}

