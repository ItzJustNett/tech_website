// Text-to-speech utility
export const textToSpeech = (text: string, onEnd?: () => void) => {
  if (!("speechSynthesis" in window)) {
    console.warn("Text-to-speech not supported in this browser")
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  // Get available voices
  let voices = window.speechSynthesis.getVoices()

  // If voices array is empty, wait for voices to load
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices()
      setUkrainianVoice()
    }
  } else {
    setUkrainianVoice()
  }

  function setUkrainianVoice() {
    // Find Ukrainian voice
    const ukrainianVoice = voices.find(
      (voice) =>
        voice.lang.includes("uk") || voice.lang.includes("uk-UA") || voice.name.toLowerCase().includes("ukrainian"),
    )

    // Find Russian voice as fallback (closer to Ukrainian than English)
    const russianVoice = voices.find(
      (voice) =>
        voice.lang.includes("ru") || voice.lang.includes("ru-RU") || voice.name.toLowerCase().includes("russian"),
    )

    // Find English voice as last resort
    const englishVoice = voices.find(
      (voice) => voice.lang.includes("en") || voice.name.toLowerCase().includes("english"),
    )

    // Set Ukrainian voice by default
    if (ukrainianVoice) {
      utterance.voice = ukrainianVoice
      utterance.lang = ukrainianVoice.lang
    } else if (russianVoice) {
      utterance.voice = russianVoice
      utterance.lang = russianVoice.lang
    } else if (englishVoice) {
      utterance.voice = englishVoice
      utterance.lang = englishVoice.lang
    }

    // Set speech rate slightly slower for better comprehension
    utterance.rate = 0.9

    if (onEnd) {
      utterance.onend = onEnd
    }

    // Log which voice is being used
    console.log(`Using voice: ${utterance.voice?.name || "Default"} (${utterance.lang})`)

    window.speechSynthesis.speak(utterance)
  }
}

// Stop text-to-speech
export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

// Highlight text being read (for visual tracking)
export const highlightTextBeingRead = (element: HTMLElement, text: string) => {
  // This is a simplified implementation
  // In a real app, you would need to track the current word being spoken
  // and highlight it as the speech progresses
  element.innerHTML = text
    .split(" ")
    .map((word) => `<span class="read-aloud-highlight">${word}</span>`)
    .join(" ")
}

// Voice recognition utility (simplified)
export const startVoiceRecognition = (onResult: (text: string) => void, onEnd?: () => void) => {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    console.warn("Speech recognition not supported in this browser")
    return null
  }

  // Use the appropriate speech recognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  // Configure recognition
  recognition.continuous = false
  recognition.interimResults = true

  // Set language to Ukrainian by default
  recognition.lang = "uk-UA" // Ukrainian

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("")

    onResult(transcript)
  }

  if (onEnd) {
    recognition.onend = onEnd
  }

  recognition.start()
  return recognition
}

// Stop voice recognition
export const stopVoiceRecognition = (recognition: any) => {
  if (recognition) {
    recognition.stop()
  }
}

