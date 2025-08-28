import React, { Suspense, useState, useEffect, useRef } from "react"
import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, useGLTF, Text, PerspectiveCamera } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"
import { useNavigate } from 'react-router-dom'

const objectVocabulary = {
  Material2249: { name: "Shower", german: "die Dusche", pronunciation: "dee DOO-she" },
  Material2240: { name: "Muslim Shower", german: "die Handbrause", pronunciation: "dee HAND-brow-ze" },
  Material2502: { name: "Towel", german: "das Handtuch", pronunciation: "das HAND-tookh" },
  Material2572: { name: "WC Seat", german: "der Toilettensitz", pronunciation: "der toy-LET-ten-zits" },
  Material2535: {
    name: "Tissue Roll",
    german: "die Toilettenpapierrolle",
    pronunciation: "dee toy-LET-ten-pa-PEER-rol-le",
  },
  Material21806: {
    name: "Toilet Cleaner",
    german: "der Toilettenreiniger",
    pronunciation: "der toy-LET-ten-ry-ni-ger",
  },
}

function BathroomScene({ onObjectClick }) {
  const gltf = useLoader(GLTFLoader, "/models/bath/bath.gltf")
  const { scene } = gltf
  
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true
        object.receiveShadow = true
        object.userData.clickable = true
        console.log("Mesh name:", object.name) // Debug log
      }
    })

    const exteriorWalls = scene.getObjectByName("ExteriorWalls")
    if (exteriorWalls) exteriorWalls.visible = false

    console.log("Scene loaded:", scene)
  }, [scene])

  const handleClick = (event) => {
    event.stopPropagation()
    let clickedObject = event.object
    console.log("Clicked object:", clickedObject)

    while (clickedObject && !clickedObject.userData.clickable) {
      clickedObject = clickedObject.parent
    }

    if (clickedObject && clickedObject.name) {
      console.log("Clicked object name:", clickedObject.name)
      onObjectClick(clickedObject.name)
    } else {
      console.log("No clickable object found")
    }
  }

  return <primitive object={scene} onClick={handleClick} />
}

function FloatingVocabulary({ word, translation, pronunciation, onClose }) {
  const [hovered, setHovered] = useState(false)

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "de-DE"
    speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
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
      <Button onClick={handleSpeak} size="sm" className="w-full mb-2">
        Speak
      </Button>
      <Button onClick={onClose} size="sm" className="w-full">
        Close
      </Button>
    </motion.div>
  )
}

function LearningPanel({ foundObjects, totalObjects }) {
  return (
    <Card className="w-[300px] bg-opacity-90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">Find the Objects</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Found: {foundObjects.length} / {totalObjects}
        </p>
        <Progress value={(foundObjects.length / totalObjects) * 100} max={100} className="w-full mt-2" />
        <div className="mt-4">
          {foundObjects.map((obj, index) => (
            <p key={index} className="text-sm">
              {obj.name}: {obj.german}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Quiz({ foundObjects, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  

  const questions = foundObjects.map((obj) => ({
    question: `What is "${obj.name}" in German?`,
    options: [
      obj.german,
      ...Object.values(objectVocabulary)
        .filter((item) => item.german !== obj.german)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((item) => item.german),
    ].sort(() => 0.5 - Math.random()),
    correct: obj.german,
  }))

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete(score, questions.length)
    }
  }

  return (
    <Card className="w-[400px] bg-opacity-90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-600">German Vocabulary Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
        {questions[currentQuestion].options.map((option, index) => (
          <Button key={index} onClick={() => handleAnswer(option)} className="w-full mb-2">
            {option}
          </Button>
        ))}
        <p className="mt-4">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </CardContent>
    </Card>
  )
}

function CameraControls() {
  const { camera } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    camera.position.set(3.98464798770712338, 1.56730258183619577, -3.784176763224426)
    camera.rotation.set(-2.9681660364670193, 0.7652884510228092, 3.0208236639175254)
    camera.updateProjectionMatrix()

    if (controlsRef.current) {
      controlsRef.current.target.set(
        camera.position.x + Math.sin(camera.rotation.y) * Math.cos(camera.rotation.x),
        camera.position.y + Math.sin(camera.rotation.x),
        camera.position.z + Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x),
      )
    }
  }, [camera])

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={0}
      maxAzimuthAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI / 2}
    />
  )
}

const GermanBathroomAR = ({ courseId, onClose }) => {
  const [foundObjects, setFoundObjects] = useState([])
  const [currentObject, setCurrentObject] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(null)
  const navigate = useNavigate()

  const handleObjectClick = (objectName) => {
    console.log("handleObjectClick called with objectName:", objectName)
    if (objectVocabulary[objectName]) {
      console.log("Object found in vocabulary:", objectVocabulary[objectName])
      if (!foundObjects.some((obj) => obj.id === objectName)) {
        const newObject = { ...objectVocabulary[objectName], id: objectName }
        console.log("Adding new object:", newObject)
        setCurrentObject(newObject)
        setFoundObjects((prevFoundObjects) => [...prevFoundObjects, newObject])
      } else {
        console.log("Object already found")
      }
    } else {
      console.log("Object not in vocabulary")
    }
  }

  const handleCloseVocabCard = () => {
    setCurrentObject(null)
    if (foundObjects.length === Object.keys(objectVocabulary).length) {
      setShowQuiz(true)
    }
  }

  const handleQuizComplete = (score, totalQuestions) => {
    setQuizCompleted(true)
    setQuizScore({ score, totalQuestions })
  }

  useEffect(() => {
    console.log("Current object:", currentObject)
    console.log("Found objects:", foundObjects)
  }, [currentObject, foundObjects])

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas shadows raycaster={{ params: { Points: { threshold: 0.1 } } }}>
        <PerspectiveCamera
          makeDefault
          fov={75}
          position={[3.98464798770712338, 1.56730258183619577, -3.784176763224426]}
          rotation={[-2.9681660364670193, 0.7652884510228092, 3.0208236639175254]}
          near={0.1}
          far={1000}
        />

        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          position={[2, 4, 2]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <BathroomScene onObjectClick={handleObjectClick} />
          <CameraControls />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4">
        <LearningPanel foundObjects={foundObjects} totalObjects={Object.keys(objectVocabulary).length} />
      </div>
      <AnimatePresence>
        {currentObject && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FloatingVocabulary
              word={currentObject.german}
              translation={currentObject.name}
              pronunciation={currentObject.pronunciation}
              onClose={handleCloseVocabCard}
            />
          </div>
        )}
      </AnimatePresence>
      {showQuiz && !quizCompleted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Quiz foundObjects={foundObjects} onComplete={handleQuizComplete} />
        </div>
      )}
      {quizCompleted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Level Completed!</h2>
          <p className="text-lg mb-4">
            Your score: {quizScore.score} / {quizScore.totalQuestions}
          </p>
          <Button onClick={() => navigate(`/dashboard/${courseId}`)} className="w-full">
            Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}

export default GermanBathroomAR

