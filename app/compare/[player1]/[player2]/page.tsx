"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { players } from "@/app/data/players"
import { motion, AnimatePresence } from "framer-motion"
import { ErrorBoundary } from "react-error-boundary"

interface PlayerStats {
  id: number
  name: string
  age: number
  club: string
  position: string
  nationality: string
  appearances: number
  goals: number
  assists: number
  wins: number
  losses: number
  playerScore: number
}

const seasons = ["2023-2024", "2022-2023", "2021-2022"]
const competitions = ["All", "Premier League", "Champions League", "Bundesliga", "LaLiga"]

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-md">
      <h2 className="text-lg font-semibold mb-2">Something went wrong:</h2>
      <pre className="text-sm">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Try again
      </button>
    </div>
  )
}

export default function ComparisonPage() {
  const { player1, player2 } = useParams()
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [selectedSeason, setSelectedSeason] = useState(seasons[0])
  const [selectedCompetition, setSelectedCompetition] = useState(competitions[0])
  const [isLoading, setIsLoading] = useState(true)

  const getPlayerStats = useMemo(
    () =>
      (playerId: string, season: string, competition: string): PlayerStats => {
        const player = players.find((p) => p.id.toString() === playerId)
        if (!player) throw new Error("Player not found")

        const seasonData = player.statsBySeason[season]
        let filteredMatches = seasonData.recentMatches
        if (competition !== "All") {
          filteredMatches = filteredMatches.filter((match) => match.competition === competition)
        }

        const wins = filteredMatches.filter((match) => match.teamGoals > match.opponentGoals).length
        const losses = filteredMatches.filter((match) => match.teamGoals < match.opponentGoals).length

        const playerScore = Math.round(seasonData.goals * 4 + seasonData.assists * 3 + seasonData.appearances / 10)

        return {
          id: player.id,
          name: player.name,
          age: player.age,
          club: player.club,
          position: player.position,
          nationality: player.nationality,
          appearances: seasonData.appearances,
          goals: seasonData.goals,
          assists: seasonData.assists,
          wins,
          losses,
          playerScore,
        }
      },
    [],
  )

  useEffect(() => {
    setIsLoading(true)
    try {
      const stats1 = getPlayerStats(player1 as string, selectedSeason, selectedCompetition)
      const stats2 = getPlayerStats(player2 as string, selectedSeason, selectedCompetition)
      setPlayerStats([stats1, stats2])
    } catch (error) {
      console.error("Error fetching player stats:", error)
    } finally {
      setIsLoading(false)
    }
  }, [player1, player2, selectedSeason, selectedCompetition, getPlayerStats])

  const getEmoji = (stat: string) => {
    switch (stat) {
      case "age":
        return "🎂"
      case "club":
        return "⚽"
      case "position":
        return "🏃‍♂️"
      case "nationality":
        return "🌍"
      case "appearances":
        return "⏱️"
      case "goals":
        return "🥅"
      case "assists":
        return "🤝"
      case "wins":
        return "🏆"
      case "losses":
        return "❌"
      case "playerScore":
        return "💯"
      default:
        return ""
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Player Comparison</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <Select onValueChange={setSelectedSeason} defaultValue={selectedSeason}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedCompetition} defaultValue={selectedCompetition}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select competition" />
            </SelectTrigger>
            <SelectContent>
              {competitions.map((competition) => (
                <SelectItem key={competition} value={competition}>
                  {competition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              Loading...
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playerStats.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{player.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(player).map(([stat, value], statIndex) =>
                        typeof value !== "number" || stat === "id" ? null : (
                          <motion.p
                            key={`${player.id}-${stat}-${value}`}
                            className="text-sm sm:text-base"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: statIndex * 0.1 }}
                          >
                            {getEmoji(stat)} {stat[0].toUpperCase() + stat.slice(1)}: {value}
                          </motion.p>
                        ),
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

