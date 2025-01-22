import { Mulish } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import RootLayout from "./root-layout"

const mulish = Mulish({ subsets: ["latin"] })

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={mulish.className}>
          <RootLayout>{children}</RootLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}

