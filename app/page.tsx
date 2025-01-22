import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Football Player Comparison</h1>
      <SignedIn>
        <div className="flex items-center space-x-4">
          <Button asChild>
            <Link href="/compare">Start Comparing</Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </SignedOut>
    </div>
  )
}

