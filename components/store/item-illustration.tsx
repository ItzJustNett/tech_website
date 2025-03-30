interface ItemIllustrationProps {
  type: string
  name: string
}

export function ItemIllustration({ type, name }: ItemIllustrationProps) {
  // Get base emoji for the type
  const getBaseEmoji = (itemType: string): string => {
    switch (itemType.toLowerCase()) {
      case "hat":
        return "🎩"
      case "glasses":
        return "👓"
      case "collar":
        return "🎀"
      case "background":
        return "🌄"
      default:
        return "🎁"
    }
  }

  // Get specific emoji based on item name and type
  const getSpecificEmoji = (itemName: string, itemType: string): string => {
    const nameLower = itemName.toLowerCase()

    // Hats
    if (itemType === "hat") {
      if (nameLower.includes("wizard")) return "🧙‍♂️"
      if (nameLower.includes("crown")) return "👑"
      if (nameLower.includes("pirate")) return "🏴‍☠️"
      if (nameLower.includes("party")) return "🥳"
      if (nameLower.includes("santa")) return "🎅"
    }

    // Glasses
    if (itemType === "glasses") {
      if (nameLower.includes("sun")) return "😎"
      if (nameLower.includes("monocle")) return "🧐"
      if (nameLower.includes("reading")) return "📚"
      if (nameLower.includes("3d")) return "🥽"
    }

    // Collars
    if (itemType === "collar") {
      if (nameLower.includes("bow")) return "🎀"
      if (nameLower.includes("bell")) return "🔔"
      if (nameLower.includes("spike")) return "⚔️"
      if (nameLower.includes("flower")) return "🌸"
    }

    // Backgrounds
    if (itemType === "background") {
      if (nameLower.includes("space")) return "🌌"
      if (nameLower.includes("beach")) return "🏖️"
      if (nameLower.includes("forest")) return "🌲"
      if (nameLower.includes("city")) return "🏙️"
      if (nameLower.includes("mountain")) return "⛰️"
    }

    // Default to base emoji if no specific match
    return getBaseEmoji(itemType)
  }

  const emoji = getSpecificEmoji(name, type)

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <div className="text-7xl p-4">{emoji}</div>
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="text-9xl">{getBaseEmoji(type)}</div>
      </div>
    </div>
  )
}

