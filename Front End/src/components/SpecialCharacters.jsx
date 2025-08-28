import React from 'react'
import { Button } from "@/components/ui/button"

const specialCharacters = {
  german: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
  spanish: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
  french: ['é', 'è', 'ê', 'ë', 'à', 'â', 'ô', 'û', 'ù', 'ï', 'ç'],
  italian: ['à', 'è', 'é', 'ì', 'ò', 'ó', 'ù']
}

export function SpecialCharacters({ language, onCharacterClick }) {
  const characters = specialCharacters[language] || []

  if (characters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {characters.map((char, index) => (
        <Button
          key={index}
          variant="outline"
          className="px-2 py-1 text-sm"
          onClick={(e) => {
            e.preventDefault() // Prevent form submission
            onCharacterClick(char)
          }}
          type="button" // Explicitly set type to button
        >
          {char}
        </Button>
      ))}
    </div>
  )
}

