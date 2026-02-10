import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import './animation.css'

const Animation = () => {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Start small, expand to cover screen (finish by 40%)
  const scale = useTransform(smoothProgress, [0, 0.4], [1, 30])

  // Fade in text as circle fills screen (finish by 50%)
  const opacity = useTransform(smoothProgress, [0.4, 0.5], [0, 1])
  const y = useTransform(smoothProgress, [0.4, 0.5], [50, 0])

  return (
    <div ref={containerRef} className="animation-section">
      <div className="animation-sticky-wrapper">
        <div className="boundary">
          <motion.div
            style={{ scale }}
            className="purple-circle"
          />

          <motion.div
            style={{ opacity, y }}
            className="animation-content"
          >
            <h2>Financial Statistics</h2>
            <p>Real-time insights at your fingertips</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Animation