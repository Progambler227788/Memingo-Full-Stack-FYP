import  { useEffect, useRef, useState } from 'react'
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Brain, Globe2, Trophy, Users2, Cpu, Glasses } from "lucide-react"
import { Link } from 'react-router-dom'
import { LogIn } from "lucide-react";
import LanguagesGrid from "@/components/LanguageGrid";

const bannerImages = [
  "/src/assets/banners/banner1.jpg",
  "/src/assets/banners/banner2.jpg",
  "/src/assets/banners/banner3.jpg",
]

export default function LandingPage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el)
    })

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length)
    }, 5000)

    return () => {
      observerRef.current?.disconnect()
      clearInterval(bannerInterval)
    }
  }, [])

  

  return (
    <div className="flex min-h-screen flex-col bg-sky-50" >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-in {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-rotate {
            animation: rotate 3s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-float, .animate-in, .animate-rotate {
              animation: none;
            }
          }
            /* New styles for width adjustment */
        .container {
          width: 100%;
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        body {
          width: 100%;
          overflow-x: hidden;
        }

        #root {
          width: 100%;
        }
        `}
      </style>
      <header className="sticky top-0 z-50 w-full border-b bg-sky-50/95 backdrop-blur supports-[backdrop-filter]:bg-sky-50/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img className="h-8 w-15 text-blue-600 animate-float ml-3" src="/src/assets/logo.png" alt="MEMINGO" />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#languages" className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
              Languages
            </a>
            <a href="#community" className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
              Community
            </a>
            <a href="#get-started" className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
              Get Started
            </a>
          </nav>
          <div className="flex items-center gap-4">

            <Link to="/LoginPage">
            <a
              href="#"
              className="text-sm font-medium text-blue-800 hover:text-blue-600 hidden md:inline-block transition-colors"
            >
              Login
            </a>
            </Link>
            
            <Link to="/SignupPage">
            
            <Button className="bg-[#26647e] text-white mr-3 hover:bg-[#1e4f62] transition-colors">Get Started</Button>
            </Link>
            
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section id="hero" className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            {bannerImages.map((img, index) => (
              <img
                key={img}
                src={img}
                alt={`Banner ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none mb-6">
                The fun way to master any language
              </h1>
              <p className="max-w-[600px] text-xl text-sky-100 mb-8">
                Learn with MEMINGO using science-based memory techniques. Join millions of learners worldwide.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/onboarding">
                <Button size="lg" className="bg-[#26647e] text-white hover:bg-[#1e4f62] transition-colors">
                  Start Learning Now
                </Button>
                </Link>
                
                <Link to="/LoginPage">
                <Button size="lg" variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-[#26647e] transition-all duration-300 ease-in-out flex items-center gap-2">
                  <LogIn size={18} />
                  Already have an account?
                </Button>
                </Link>
                
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="bg-white py-16 md:py-24 lg:py-32">
          <div className="container px-4">
            <h2 className="text-center text-3xl font-bold tracking-tighter text-blue-900 sm:text-4xl md:text-5xl mb-12 animate-on-scroll">
              Why choose MEMINGO?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6 border-yellow-400 shadow-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-on-scroll">
                <Brain className="h-12 w-12 text-[#26647e] mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Memory Science</h3>
                <p className="text-blue-700">
                  Learn faster with scientifically proven memory techniques and spaced repetition.
                </p>
              </Card>
              <Card className="p-6 border-yellow-400 shadow-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-on-scroll">
                <Trophy className="h-12 w-12 text-[#26647e] mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Gamified Learning</h3>
                <p className="text-blue-700">
                  Stay motivated with points, achievements, and friendly competitions.
                </p>
              </Card>
              <Card className="p-6 border-yellow-400 shadow-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-on-scroll">
                <Cpu className="h-12 w-12 text-[#26647e] mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">AI-Powered Lessons</h3>
                <p className="text-blue-700">
                  Personalized learning experience tailored to your progress and learning style.
                </p>
              </Card>
              <Card className="p-6 border-yellow-400 shadow-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-on-scroll">
                <Glasses className="h-12 w-12 text-[#26647e] mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">AR Integration</h3>
                <p className="text-blue-700">
                  Immersive learning experiences with Augmented Reality technology.
                </p>
              </Card>
              <Card className="p-6 border-yellow-400 shadow-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-on-scroll">
                <Globe2 className="h-12 w-12 text-[#26647e] mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">30+ Languages</h3>
                <p className="text-blue-700">
                  Choose from over 30 languages and start your learning journey today.
                </p>
              </Card>
              <Card className="p-6 border-yellow-400 shadow-yellow-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-on-scroll">
                <Users2 className="h-12 w-12 text-[#26647e] mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Community Learning</h3>
                <p className="text-blue-700">
                  Connect with fellow learners, practice together, and share your progress.
                </p>
              </Card>
            </div>
          </div>
        </section>

        
        <LanguagesGrid />
        <section id="community" className="bg-white py-16 md:py-24 lg:py-32">
          <div className="container px-4">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4 animate-on-scroll">
                <div className="inline-block rounded-lg bg-yellow-200 px-3 py-1 text-sm text-[#26647e]">
                  Learning Stats
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-blue-900 sm:text-4xl md:text-5xl">
                  Join our global community
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-[#26647e]">50M+</div>
                    <div className="text-blue-700">Active Learners</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-[#26647e]">30+</div>
                    <div className="text-blue-700">Languages</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-[#26647e]">1B+</div>
                    <div className="text-blue-700">Exercises Completed</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-[#26647e]">95%</div>
                    <div className="text-blue-700">Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center animate-on-scroll">
                <img
                  alt="Community illustration"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center animate-float"
                  height="300"
                  src="/src/assets/random/communityillustration.jpg"
                  width="600"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="get-started" className="bg-[#26647e] text-white">
          <div className="container flex flex-col items-center justify-center gap-4 py-16 text-center md:py-24 lg:py-32">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-on-scroll">
              Start your language journey today
            </h2>
            <p className="max-w-[600px] text-sky-100 md:text-xl animate-on-scroll">
              Join millions of learners worldwide and discover the joy of learning a new language.
            </p>
            <Link to="/onboarding">
                <Button
                    size="lg"
                    variant="secondary"
                    className="mt-4 bg-white text-[#26647e] hover:bg-sky-100 transition-colors animate-on-scroll"
                >
                Get Started for Free
                </Button>
    </Link>
          </div>
        </section>
      </main>
      <footer className="border-t bg-sky-50">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-8">
          <div className="flex items-center gap-2">
          <img className="h-8 w-15 text-blue-600 animate-float ml-3" src="/src/assets/logo.png" alt="MEMINGO" />
            
          </div>
          <nav className="flex gap-4 md:gap-6">
            <a href="#" className="text-sm text-blue-700 hover:text-[#26647e] hover:underline underline-offset-4 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-blue-700 hover:text-[#26647e] hover:underline underline-offset-4 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-blue-700 mr-3 hover:text-[#26647e] hover:underline underline-offset-4 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}