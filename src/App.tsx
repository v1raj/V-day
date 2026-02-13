import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart as HeartIcon, Sparkles as SparklesIcon, Mail, Send, Stars, Ban } from 'lucide-react'
import confetti from 'canvas-confetti'
import { SceneContent } from './components/Scene'
import * as THREE from 'three'

function MouseTrail() {
  const [trails, setTrails] = useState<{ id: number, x: number, y: number }[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = { id: Date.now(), x: e.clientX, y: e.clientY }
      setTrails(prev => [...prev.slice(-15), newTrail])
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="mouse-trail-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {trails.map((trail, i) => (
        <motion.div
          key={trail.id}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            left: trail.x,
            top: trail.y,
            width: 10,
            height: 10,
            pointerEvents: 'none',
            color: '#D4AF37'
          }}
        >
          <HeartIcon size={12 + i} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  )
}

function App() {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [accepted, setAccepted] = useState(false)
  const [message, setMessage] = useState("Will you be my Valentine?")
  const [noBtnText, setNoBtnText] = useState("No")

  const moveNoButton = () => {
    const x = Math.random() * 400 - 200
    const y = Math.random() * 400 - 200
    setNoPosition({ x, y })

    const cheekyMessages = [
      "Wait, my heart just skipped a beat!",
      "Clicking 'No' is physically impossible...",
      "Calculated error: You meant 'Yes'",
      "Are you playing hard to get? 😉",
      "Error 404: 'No' not found",
      "Come back here! ❤️",
      "I'm gonna cry... 🥺",
      "Don't break my 3D heart!",
      "Nice try, but I'm faster!"
    ]
    setMessage(cheekyMessages[Math.floor(Math.random() * cheekyMessages.length)])

    const cheekyBtnText = [
      "No",
      "Wait!",
      "Really?",
      "Don't!",
      "Stop!",
      "Nope!",
      "Hey!",
      "Why?",
      "Uh-uh!"
    ]
    setNoBtnText(cheekyBtnText[Math.floor(Math.random() * cheekyBtnText.length)])
  }

  const handleYes = () => {
    setAccepted(true)
    const end = Date.now() + 6 * 1000
    const colors = ['#D4AF37', '#800020', '#B76E79', '#FFFFF0']

      ; (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }())
  }

  return (
    <div className="app">
      <MouseTrail />

      <div className="canvas-container">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={35} />
          <Suspense fallback={null}>
            <SceneContent accepted={accepted} />
            <EffectComposer>
              <Bloom luminanceThreshold={1} intensity={1.5} levels={9} mipmapBlur />
              <Noise opacity={0.04} />
              <Vignette eskil={false} offset={0.1} darkness={1.2} />
              <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            </EffectComposer>
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      <div className="ui-layer">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -100, scale: 1.2 }}
              className="glass p-12 text-center max-w-xl mx-4"
              style={{ padding: '4rem' }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#D4AF37]">
                <motion.div
                  animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Mail size={80} strokeWidth={1} />
                </motion.div>
              </div>

              <h1 className="text-4xl md:text-5xl mb-12 tracking-tighter text-[#FFFFF0] drop-shadow-2xl italic font-serif">
                {message}
              </h1>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#a00028' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleYes}
                  className="btn-primary min-w-[320px] px-8 py-5 rounded-full font-bold text-2xl flex justify-center items-center gap-4 uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(128,0,32,0.5)]"
                >
                  Yes <Send size={28} />
                </motion.button>

                <motion.button
                  animate={{ x: noPosition.x, y: noPosition.y }}
                  onHoverStart={moveNoButton}
                  onClick={moveNoButton}
                  className="btn-primary min-w-[320px] px-8 py-5 rounded-full font-bold text-2xl flex justify-center items-center gap-4 uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(128,0,32,0.5)]"
                >
                  {noBtnText} <Ban size={28} />
                </motion.button>
              </div>

              <div className="mt-12 flex justify-center gap-4 text-[#B76E79]/50">
                <Stars size={16} />
                <span className="text-xs uppercase tracking-[0.5em]">Press for magic</span>
                <Stars size={16} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="glass p-16 text-center max-w-3xl mx-4 relative"
              style={{ padding: '5rem' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="mb-10 text-[#D4AF37] flex justify-center"
              >
                <div className="relative">
                  <HeartIcon size={120} fill="currentColor" className="drop-shadow-[0_0_40px_rgba(212,175,55,0.8)]" />
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 text-[#D4AF37]"
                  >
                    <HeartIcon size={120} fill="currentColor" />
                  </motion.div>
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-7xl mb-8 text-[#FFFFF0] font-serif leading-tight">Forever & Always</h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-2xl text-[#B76E79] mb-12 italic leading-relaxed max-w-lg mx-auto"
              >
                “You just made the best decision of this year.”
              </motion.p>

              <motion.div
                className="grid grid-cols-3 gap-6 opacity-40 max-w-md mx-auto"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37] mt-3" />
                <SparklesIcon size={24} className="mx-auto text-[#D4AF37]" />
                <div className="h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37] mt-3" />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
