import { useEffect, useRef } from 'react'
import { STATS } from '../data/portfolio'
import { animate } from 'animejs'
import { EASE, DUR, STAGGER } from '../motion'

/* — Anime.js Svg sparkline drawn on entry — */
function SparklineSVG({ color = '#FF3B73', pathId }) {
  const pathRef = useRef(null)

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const len = el.getTotalLength()
      el.style.strokeDasharray = len
      el.style.strokeDashoffset = len
      animate(el, {
        strokeDashoffset: [len, 0],
        duration: DUR.base,
        ease: EASE.out,
      })
      io.unobserve(el)
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <svg viewBox="0 0 100 30" className="metric-sparkline" aria-hidden="true">
      <path
        ref={pathRef}
        d="M0 25 Q15 8 30 18 T60 12 T85 10 T100 6"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M0 25 Q15 8 30 18 T60 12 T85 10 T100 6 L100 30 L0 30 Z"
        fill={color}
        opacity="0.06"
      />
    </svg>
  )
}

/* — Metric evidence module — */
function MetricModule({ stat }) {
  const numRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      // Counter (one shot)
      if (numRef.current) {
        const counter = { val: 0 }
        animate(counter, {
          val: stat.value,
          round: 1,
          duration: DUR.slow,
          ease: EASE.out,
          onUpdate: () => {
            if (numRef.current) numRef.current.textContent = Math.round(counter.val)
          },
        })
      }

      io.unobserve(el)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [stat.value])

  // Color derived by stat position
  const colors = ['var(--signal-pink)', 'var(--signal-cyan)', 'var(--signal-amber)', 'var(--signal-violet)']

  return (
    <div ref={cardRef} className="metric-module">
      <SparklineSVG color={colors[STATS.indexOf(stat)] || 'var(--signal-pink)'} />
      <div className="metric-module-val">
        <span ref={numRef} className="metric-num">0</span>
        <span className="metric-suffix">{stat.suffix}</span>
      </div>
      <div className="metric-module-label">{stat.label}</div>
      <div className="metric-module-desc">{stat.desc}</div>
      <div className="metric-module-trace">
        <span>SOURCE</span>
        <span className="trace-arrow">→</span>
        <span>TRANSFORM</span>
        <span className="trace-arrow">→</span>
        <span style={{ color: 'var(--signal-pink)' }}>OUTCOME</span>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section-container">
      <div className="section-header">
        <div className="section-kicker">01 // Signal &amp; Evidence</div>
        <h2 className="section-title">Bridging Analytics &amp; Engineering</h2>
        <p className="section-subtitle" style={{ marginTop: '14px' }}>
          From raw data to production interfaces — measured, validated, deployed.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-bio">
          <p className="about-paragraph">
            I specialize in transforming complex, unstructured datasets into intuitive dashboards, predictive Machine Learning models, and scalable full-stack web applications.
          </p>
          <p className="about-paragraph">
            Whether optimizing reporting infrastructure for executive decision-makers or architecting real-time WebGL interfaces, my work focuses on measurable performance, speed, and reliability.
          </p>
        </div>

        <div className="metrics-grid">
          {STATS.map((stat) => (
            <MetricModule key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
