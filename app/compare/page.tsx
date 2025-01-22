"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PlayerSearch from "./PlayerSearch"
import { Button } from "@/components/ui/button"
import { UserButton, SignOutButton } from "@clerk/nextjs"
import { useClerk } from "@clerk/nextjs"

export default function ComparePage() {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const router = useRouter()
  const { signOut } = useClerk()

  const handlePlayerSelect = (index: number) => (playerId: string) => {
    const newSelectedPlayers = [...selectedPlayers]
    newSelectedPlayers[index] = playerId
    setSelectedPlayers(newSelectedPlayers)
  }

  const handleCompare = () => {
    if (selectedPlayers.length === 2) {
      router.push(`/compare/${selectedPlayers[0]}/${selectedPlayers[1]}`)
    }
  }

  const handleSinglePlayerView = (playerId: string) => {
    router.push(`/player/${playerId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Football Player Statistics</h1>
        <div className="flex items-center space-x-4">
          <UserButton />
          <SignOutButton signOutCallback={() => router.push("/")}>
            <Button variant="outline">Log out</Button>
          </SignOutButton>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">View Individual Player Stats</h2>
        <PlayerSearch onSelect={handleSinglePlayerView} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Compare Two Players</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <PlayerSearch onSelect={handlePlayerSelect(0)} />
          <PlayerSearch onSelect={handlePlayerSelect(1)} />
        </div>
        <Button onClick={handleCompare} disabled={selectedPlayers.length !== 2}>
          Compare Players
        </Button>
      </div>
    </div>
  )
}

