import React, { Suspense, useState, useEffect, useRef } from "react"
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, useGLTF, Text, useAnimations, PerspectiveCamera } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"

function InteractiveScene({ onObjectClick, cameraRef }) {
  const gltf = useLoader(GLTFLoader, "/models/office/office.gltf")
  const { scene, animations } = gltf
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })

    // Play all animations
    Object.values(actions).forEach((action) => action.play())
  }, [scene, actions])

  useFrame(({ raycaster, mouse, camera }) => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object
      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "default"
    }
  })

  const handleClick = (event) => {
    const { clientX, clientY } = event
    const { camera, raycaster } = useThree.getState()
    const mouse = new THREE.Vector2()
    mouse.x = (clientX / window.innerWidth) * 2 - 1
    mouse.y = -(clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object
      onObjectClick(clickedObject)
    }
  }

  return <primitive object={scene} onClick={handleClick} />
}

function FloatingVocabulary({ word, translation, pronunciation, position }) {
  const [hovered, setHovered] = useState(false)

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "de-DE"
    speechSynthesis.speak(utterance)
  }

  return (
    <Html position={position}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`bg-white bg-opacity-90 p-3 rounded-lg shadow-lg transition-all duration-300 ${
          hovered ? "scale-110" : "scale-100"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p className="font-bold text-blue-600 text-lg">{word}</p>
        <p className="text-sm text-gray-600">{translation}</p>
        <p className="text-xs text-gray-500 italic mb-2">{pronunciation}</p>
        <Button onClick={handleSpeak} size="sm" className="w-full">
          Speak
        </Button>
      </motion.div>
    </Html>
  )
}

function DialogueSystem({ position, onComplete, currentTask, setScore }) {
  const [dialogueState, setDialogueState] = useState("greeting")
  const [feedback, setFeedback] = useState("")
  const { transcript, listening, resetTranscript, startListening } = useSpeechRecognition()
  const [englishTranslation, setEnglishTranslation] = useState("")

  const dialogues = {
    greeting: {
      character: "Hallo! Willkommen in unserem Büro. Wie kann ich Ihnen helfen?",
      translation: "Hello! Welcome to our office. How can I help you?",
      pronunciation: "HAL-oh! VILL-kom-men in UN-zer-em BUE-roh. Vee kan ich EE-nen HEL-fen?",
      options: [
        {
          text: "Ich möchte ein Fax senden.",
          translation: "I want to send a fax.",
          pronunciation: "Ich MOCH-te ain FAKS zen-den.",
        },
        {
          text: "Können Sie mir das Büro zeigen?",
          translation: "Can you show me around the office?",
          pronunciation: "KUN-nen zee meer das BUE-roh TSAI-gen?",
        },
      ],
    },
    faxTask: {
      character: "Natürlich! Lassen Sie uns zum Faxgerät gehen. Können Sie es sehen?",
      translation: "Of course! Let's go to the fax machine. Can you see it?",
      pronunciation: "na-TUER-lich! LAS-sen zee uns tsum FAKS-ge-ret GEY-en. KUN-nen zee es ZEY-en?",
      options: [
        { text: "Ja, ich sehe es.", translation: "Yes, I see it.", pronunciation: "Ya, ich ZEY-e es." },
        { text: "Nein, wo ist es?", translation: "No, where is it?", pronunciation: "Nain, vo ist es?" },
      ],
    },
    faxInstructions: {
      character:
        "Gut! Um ein Fax zu senden, müssen Sie zuerst das Dokument einlegen, dann die Nummer wählen und auf 'Senden' drücken.",
      translation:
        "Good! To send a fax, you need to insert the document first, then dial the number, and press 'Send'.",
      pronunciation:
        "Goot! Um ain FAKS tsu ZEN-den, MUES-sen zee tsu-ERST das do-ku-MENT AIN-lay-gen, dan dee NUM-mer VEY-len und auf ZEN-den DRUE-ken.",
      task: "faxMachine",
    },
    officeTask: {
      character: "Gerne! Hier sehen Sie unseren Arbeitsbereich. Links ist der Schreibtisch, rechts der Aktenschrank.",
      translation: "Here you can see our work area. On the left is the desk, on the right is the filing cabinet.",
      pronunciation:
        "GER-ne! Hier ZEY-en zee UN-ze-ren AR-baits-be-raich. Links ist der SHRAIB-tish, rechts der AK-ten-shrank.",
      task: "exploreOffice",
    },
    completion: {
      character:
        "Ausgezeichnet! Sie haben die Aufgabe erfolgreich abgeschlossen. Möchten Sie etwas anderes im Büro erkunden?",
      translation:
        "Excellent! You have successfully completed the task. Would you like to explore something else in the office?",
      pronunciation:
        "AUS-ge-tsaich-net! Zee HA-ben dee AUF-ga-be er-FOLG-raich AB-ge-shlos-sen. MOCH-ten zee ET-vas AN-de-res im BUE-roh er-KUN-den?",
      options: [
        { text: "Ja, bitte.", translation: "Yes, please.", pronunciation: "Ya, BIT-te." },
        {
          text: "Nein, danke. Ich bin fertig.",
          translation: "No, thank you. I'm finished.",
          pronunciation: "Nain, DAN-ke. Ich bin FER-tig.",
        },
      ],
    },
  }

  useEffect(() => {
    if (transcript) {
      checkUserInput(transcript)
      translateToEnglish(transcript)
    }
  }, [transcript])

  const translateToEnglish = async (germanText) => {
    // In a real application, you would use a translation API here
    // For this example, we'll use a simple mapping
    const translations = {
      "Ich möchte ein Fax senden": "I want to send a fax",
      "Können Sie mir das Büro zeigen": "Can you show me around the office",
      "Ja, ich sehe es": "Yes, I see it",
      "Nein, wo ist es": "No, where is it",
      "Ja, bitte": "Yes, please",
      "Nein, danke. Ich bin fertig": "No, thank you. I'm finished",
    }
    setEnglishTranslation(translations[germanText] || "Translation not available")
  }

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "de-DE"
    speechSynthesis.speak(utterance)
  }

  const checkUserInput = (input) => {
    const currentDialogue = dialogues[dialogueState]
    if (currentDialogue.options) {
      const matchedOption = currentDialogue.options.find((option) =>
        input.toLowerCase().includes(option.text.toLowerCase()),
      )
      if (matchedOption) {
        setFeedback("Richtig! (Correct!)")
        setScore((prevScore) => prevScore + 10)
        setTimeout(() => {
          setFeedback("")
          advanceDialogue(matchedOption.text)
        }, 1500)
      } else {
        setFeedback("Versuchen Sie es noch einmal. (Try again.)")
      }
    } else if (currentDialogue.task === currentTask) {
      setFeedback(
        "Sehr gut! Sie haben die Aufgabe erfolgreich abgeschlossen. (Very good! You have successfully completed the task.)",
      )
      setScore((prevScore) => prevScore + 20)
      setTimeout(() => {
        setFeedback("")
        advanceDialogue()
      }, 1500)
    } else {
      setFeedback("Bitte führen Sie zuerst die aktuelle Aufgabe aus. (Please complete the current task first.)")
    }
  }

  const advanceDialogue = (userChoice) => {
    switch (dialogueState) {
      case "greeting":
        setDialogueState(userChoice === "Ich möchte ein Fax senden." ? "faxTask" : "officeTask")
        break
      case "faxTask":
        setDialogueState("faxInstructions")
        break
      case "faxInstructions":
      case "officeTask":
        setDialogueState("completion")
        break
      case "completion":
        if (userChoice === "Ja, bitte.") {
          setDialogueState("greeting")
        } else {
          onComplete()
        }
        break
    }
  }

  useEffect(() => {
    const currentDialogue = dialogues[dialogueState]
    speakText(currentDialogue.character)
  }, [dialogueState])

  return (
    <Html position={position}>
      <AnimatePresence>
        <motion.div
          key={dialogueState}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 bg-opacity-90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">German Office Adventure</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2 text-blue-600">{dialogues[dialogueState].character}</h2>
              <p className="text-sm text-gray-600 mb-2">{dialogues[dialogueState].translation}</p>
              <p className="text-xs text-gray-500 italic mb-4">{dialogues[dialogueState].pronunciation}</p>
              {dialogues[dialogueState].options && (
                <div className="mb-4">
                  {dialogues[dialogueState].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => checkUserInput(option.text)}
                      className="w-full mb-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      {option.text}
                      <span className="block text-xs">{option.translation}</span>
                      <span className="block text-xs italic">{option.pronunciation}</span>
                    </Button>
                  ))}
                </div>
              )}
              <Button
                onClick={startListening}
                disabled={listening}
                className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {listening ? "Zuhören... (Listening...)" : "Sprechen (Speak)"}
              </Button>
              {transcript && (
                <div className="mb-4">
                  <p className="font-semibold">Sie sagten (You said):</p>
                  <p className="text-green-700">{transcript}</p>
                  <p className="text-sm text-gray-600">{englishTranslation}</p>
                </div>
              )}
              <p
                className={`text-sm ${feedback.includes("Richtig") || feedback.includes("Sehr gut") ? "text-green-500" : "text-red-500"} font-bold`}
              >
                {feedback}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Html>
  )
}

function CameraControls({ cameraRef }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cameraRef.current) {
        const { clientX, clientY } = event
        const { innerWidth, innerHeight } = window
        const mouseX = (clientX / innerWidth) * 2 - 1
        const mouseY = -(clientY / innerHeight) * 2 + 1

        cameraRef.current.rotation.y = mouseX * 0.5
        cameraRef.current.rotation.x = mouseY * 0.5
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [cameraRef])

  return <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} enableZoom={false} />
}

const GermanOfficeAR = () => {
  const [dialogueComplete, setDialogueComplete] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [vocabularyItems, setVocabularyItems] = useState([])
  const [score, setScore] = useState(0)
  const cameraRef = useRef()

  const handleObjectClick = (object) => {
    if (object.name === "FaxMachine") {
      setCurrentTask("faxMachine")
      setVocabularyItems([
        { word: "Faxgerät", translation: "fax machine", pronunciation: "FAKS-ge-ret", position: [1, 2, -1] },
        { word: "senden", translation: "to send", pronunciation: "ZEN-den", position: [1, 1.5, -1] },
        { word: "Dokument", translation: "document", pronunciation: "do-ku-MENT", position: [0.5, 2, -1] },
      ])
    } else if (object.name === "Desk") {
      setCurrentTask("exploreOffice")
      setVocabularyItems([
        { word: "Schreibtisch", translation: "desk", pronunciation: "SHRAIB-tish", position: [-1, 2, -1] },
        { word: "Stuhl", translation: "chair", pronunciation: "shtool", position: [-1, 1.5, -1] },
        { word: "Computer", translation: "computer", pronunciation: "kom-PYU-ter", position: [-0.5, 2, -1] },
      ])
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.7, 5]} fov={50} ref={cameraRef} />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <InteractiveScene onObjectClick={handleObjectClick} cameraRef={cameraRef} />
          <CameraControls cameraRef={cameraRef} />
          {!dialogueComplete && (
            <DialogueSystem
              position={[0, 1.5, -1]}
              onComplete={() => setDialogueComplete(true)}
              currentTask={currentTask}
              setScore={setScore}
            />
          )}
          {vocabularyItems.map((item, index) => (
            <FloatingVocabulary
              key={index}
              word={item.word}
              translation={item.translation}
              pronunciation={item.pronunciation}
              position={item.position}
            />
          ))}
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Score: {score}</h2>
        <Progress value={score} max={100} className="w-48" />
      </div>
      {dialogueComplete && (
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
          <p className="text-lg font-bold text-green-600">Glückwunsch! (Congratulations!)</p>
          <p>Sie haben die Interaktion erfolgreich abgeschlossen. (You have successfully completed the interaction.)</p>
          <p>Erkunden Sie nun die 3D-Szene mit den Steuerungen. (Now explore the 3D scene with the controls.)</p>
          <Button onClick={() => window.location.reload()} className="mt-4 w-full">
            Neu starten (Restart)
          </Button>
        </div>
      )}
    </div>
  )
}

export default GermanOfficeAR

