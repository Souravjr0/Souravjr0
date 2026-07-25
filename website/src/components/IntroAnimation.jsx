import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { usePrefersReducedMotion } from '../hooks/useAnimev4'
import { EASE, DUR } from '../motion'

export default function IntroAnimation({ onComplete }) {
  const reducedMotion = usePrefersReducedMotion()
  const svgRef = useRef(null)
  const percentRef = useRef(null)
  const subtitleRef = useRef(null)
  const fillRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (reducedMotion) {
      if (onCompleteRef.current) onCompleteRef.current()
      return
    }

    const animations = []

    const statusLogs = [
      'INITIALIZING NEURAL FIELD',
      'LOADING EXPERIENCE MODULES',
      'CALIBRATING SIGNAL PATHS',
      'VERIFYING TELEMETRY',
      'SIGNAL ACQUIRED',
    ]

    const counter = { val: 0 }
    const counterAnim = animate(counter, {
      val: 100,
      round: 1,
      duration: 1800,
      ease: EASE.inOut,
      onUpdate: () => {
        const val = Math.round(counter.val)
        if (percentRef.current) percentRef.current.textContent = val + '%'
        if (fillRef.current) fillRef.current.style.width = val + '%'
        
        const idx = Math.min(Math.floor((val / 100) * statusLogs.length), statusLogs.length - 1)
        if (subtitleRef.current) subtitleRef.current.textContent = statusLogs[idx]
      },
    })
    animations.push(counterAnim)

    const paths = svgRef.current?.querySelectorAll('path')
    if (paths && paths.length > 0) {
      paths.forEach((path) => {
        const len = path.getTotalLength()
        path.style.strokeDasharray = len
        path.style.strokeDashoffset = len
      })

      paths.forEach((path, i) => {
        const len = path.getTotalLength()
        const pathAnim = animate(path, {
          strokeDashoffset: [len, 0],
          duration: DUR.slow,
          ease: EASE.inOut,
          delay: i * 180,
        })
        animations.push(pathAnim)
      })
    }

    const charAnim = animate('.intro-char', {
      translateY: [40, 0],
      opacity: [0, 1],
      filter: ['blur(6px)', 'blur(0px)'],
      duration: DUR.base,
      delay: stagger(40, { start: 150 }),
      ease: EASE.out,
    })
    animations.push(charAnim)

    const timer = setTimeout(() => {
      const curtainAnim = animate('.intro-curtain', {
        translateY: ['0%', '-100%'],
        duration: DUR.base,
        delay: stagger(70),
        ease: EASE.inOut,
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current()
        },
      })
      animations.push(curtainAnim)
    }, 2200)

    return () => {
      clearTimeout(timer)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  const titleText = 'SOURAV BISWAS'

  return (
    <div className="intro-overlay">
      <div className="intro-curtain-container">
        <div className="intro-curtain" />
        <div className="intro-curtain" />
        <div className="intro-curtain" />
      </div>

      <div className="intro-content">
        <svg ref={svgRef} width="110" height="110" viewBox="0 0 100 100" className="intro-svg">
          <path d="M 50,10 L 90,30 L 90,70 L 50,90 L 10,70 L 10,30 Z" fill="none" stroke="#E8637A" strokeWidth="3" />
          <path d="M 50,25 L 75,38 L 75,62 L 50,75 L 25,62 L 25,38 Z" fill="none" stroke="#67D4D4" strokeWidth="2" />
          <path d="M 50,40 L 60,46 L 60,54 L 50,60 L 40,54 L 40,46 Z" fill="none" stroke="#F0C75E" strokeWidth="2" />
        </svg>

        <div className="intro-title">
          {titleText.split('').map((char, index) => (
            <span key={index} className="intro-char">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        <div ref={subtitleRef} className="intro-subtitle">INITIALIZING NEURAL FIELD</div>

        <div className="intro-progress-bar">
          <div ref={fillRef} className="intro-progress-fill" style={{ width: '0%' }} />
        </div>

        <div ref={percentRef} className="intro-percent">0%</div>
      </div>
    </div>
  )
}
