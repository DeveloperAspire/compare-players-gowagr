"use client"

import React, { useState, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { players } from "@/app/data/players"

interface Player {
  id: number
  name: string
  club: string
  nationality: string
}

interface PlayerSearchProps {
  onSelect: (playerId: string) => void
  placeholder?: string
}

export default React.memo(function PlayerSearch({ onSelect, placeholder = "Select player..." }: PlayerSearchProps) {
  const [open, setOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const nameMatch = player.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
      const clubMatch = player.club?.toLowerCase().includes(searchQuery.toLowerCase()) || false
      const nationalityMatch = player.nationality?.toLowerCase().includes(searchQuery.toLowerCase()) || false
      return nameMatch || clubMatch || nationalityMatch
    })
  }, [searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedPlayer ? selectedPlayer.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search player..." onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>No player found.</CommandEmpty>
            <CommandGroup>
              {filteredPlayers.map((player) => (
                <CommandItem
                  key={player.id}
                  onSelect={() => {
                    setSelectedPlayer(player)
                    setOpen(false)
                    onSelect(player.id.toString())
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedPlayer?.id === player.id ? "opacity-100" : "opacity-0")}
                  />
                  <div>
                    <div>{player.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {player.club} | {player.nationality}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

