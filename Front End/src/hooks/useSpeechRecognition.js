import { useState, useCallback } from "react"

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported")
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "de-DE"

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setTranscript(transcript)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return { transcript, listening, resetTranscript, startListening }
}

