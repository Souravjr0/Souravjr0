import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { animate } from 'animejs'
import { HERO_BADGES } from '../data/portfolio'
import { useMagneticEffect } from '../hooks/useMagneticEffect'
import { useIsTouchDevice } from '../hooks/useAnimev4'
import { EASE, DUR } from '../motion'

// Three.js is ~690KB — load it after first paint so the hero copy is readable immediately.
const HeroScene = lazy(() => import('./three/HeroScene'))

function MagneticLink({ href, children, className = '' }) {
  const ref = useMagneticEffect()
  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  )
}

function MagneticStatCard({ badge }) {
  const cardRef = useRef(null)
  const isTouch = useIsTouchDevice()

  const handleMouseMove = (e) => {
    if (isTouch || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotateX = (-y / rect.height) * 10
    const rotateY = (x / rect.width) * 10
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`
  }

  return (
    <div
      ref={cardRef}
      className="hero-badge-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.25s var(--ease-out)' }}
    >
      <div className="hero-badge-icon">{badge.icon}</div>
      <div>
        <div className="hero-badge-label">{badge.label}</div>
        <div className="hero-badge-sub">{badge.sub}</div>
      </div>
    </div>
  )
}

export default function Hero({ introActive = false }) {
  const [fpsText, setFpsText] = useState('SIGNAL: STABLE // 60 FPS')
  const heroRef = useRef(null)
  const entrancePlayed = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < 100) setFpsText('SIGNAL: STABLE // 60 FPS')
      else if (scrollY < 600) setFpsText('SIGNAL: PROCESSING // 60 FPS')
      else setFpsText('SIGNAL: DEEP INGEST // 60 FPS')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Choreographed entrance sequence — waits for the intro curtain to lift
  useEffect(() => {
    if (introActive || entrancePlayed.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    entrancePlayed.current = true

    // Step 1: eyebrow (availability badge)
    animate('.hero-eyebrow', {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: DUR.base,
      ease: EASE.out,
    })

    // Step 2: title resolves with stagger
    animate('.hero-title-wrapper', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: DUR.base,
      delay: 120,
      ease: EASE.out,
    })

    // Step 3: description
    animate('.hero-desc', {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: DUR.base,
      delay: 260,
      ease: EASE.out,
    })

    // Step 4: CTA buttons
    animate('.hero-actions', {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: DUR.base,
      delay: 400,
      ease: EASE.out,
    })

    // Step 5: credential cards with spring physics
    animate('.hero-badges-grid', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: 550,
      ease: EASE.out,
    })
  }, [introActive])

  return (
    <section id="hero" className="hero-section" ref={heroRef}>
      <div className="hero-canvas-container">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="status-dot" />
          <span>Available for projects — Pune, India</span>
          <span style={{ marginLeft: '10px', color: 'var(--signal-pink)', fontFamily: 'var(--mono)', fontSize: '0.7rem', opacity: 0.7 }}>
            [{fpsText}]
          </span>
        </div>

        <div className="hero-title-wrapper">
          <h1 className="hero-title-kinetic">
            <span className="hero-name-first">Sourav</span>
            <span className="hero-name-last">Biswas</span>
            <span className="hero-name-period">.</span>
          </h1>
        </div>

        <p className="hero-desc">
          Business &amp; Data Analyst / AI &amp; Full-Stack Developer turning raw data streams into high-impact predictive decisions and 60fps web applications.
        </p>

        <div className="hero-actions">
          <MagneticLink href="#projects" className="btn btn-primary">
            Explore Selected Work <span style={{ display: 'inline-block', transition: 'transform 0.3s' }}>→</span>
          </MagneticLink>
          <MagneticLink href="#lab" className="btn btn-outline">
            Interactive Lab <span style={{ fontSize: '0.85rem' }}>⚡</span>
          </MagneticLink>
        </div>

        <div className="hero-badges-grid">
          {HERO_BADGES.map((b) => (
            <MagneticStatCard key={b.label} badge={b} />
          ))}
        </div>
      </div>

      {/* HUD status label */}
      <div className="hero-hud-label">
        <span className="status-dot" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
        SYSTEM STATUS: SIGNAL STABLE — 3+ YEARS OPERATIONAL
      </div>
    </section>
  )
}
