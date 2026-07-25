import { useEffect, useRef, useState } from 'react'
import { METHODOLOGY } from '../data/portfolio'
import { animate, stagger } from 'animejs'
import { EASE, DUR } from '../motion'

export default function WorkflowPipeline() {
  const [activeStep, setActiveStep] = useState(0)
  const containerRef = useRef(null)
  const lineRef = useRef(null)
  const dataPacketRef = useRef(null)
  const packetsSent = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let lineAnim, cardsAnim, packetAnim;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        // Draw pipeline connector line
        const line = lineRef.current
        if (line) {
          const len = line.getTotalLength()
          line.style.strokeDasharray = len
          line.style.strokeDashoffset = len
          lineAnim = animate(line, {
            strokeDashoffset: [len, 0],
            duration: 1200,
            ease: EASE.out,
          })
        }

        // Sequential step activation
        cardsAnim = animate('.pipeline-card', {
          opacity: [0.3, 1],
          translateY: [16, 0],
          duration: DUR.base,
          delay: stagger(180),
          ease: EASE.out,
        })

        // Data packets travelling along the connector line
        if (!packetsSent.current && dataPacketRef.current) {
          packetsSent.current = true
          packetAnim = animate('.pipeline-data-packet', {
            left: ['0%', '100%'],
            opacity: [0, 1, 1, 0],
            duration: 3000,
            delay: stagger(700),
            loop: true,
            ease: EASE.inOut,
          })
        }

        io.unobserve(el)
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    
    return () => {
      io.disconnect()
      if (lineAnim && lineAnim.revert) lineAnim.revert()
      if (cardsAnim && cardsAnim.revert) cardsAnim.revert()
      if (packetAnim && packetAnim.revert) packetAnim.revert()
    }
  }, [])

  return (
    <section id="workflow" ref={containerRef} className="section-container">
      <div className="section-header">
        <div className="section-kicker">02 // Pipeline Architecture</div>
        <h2 className="section-title">How Projects Come To Life</h2>
        <p className="section-subtitle" style={{ marginTop: '14px' }}>
          From raw data exploration to production ML pipelines and reactive full-stack applications.
        </p>
      </div>

      <div className="pipeline-connector" aria-hidden="true">
        <svg viewBox="0 0 300 8" className="pipeline-svg-line">
          <line
            ref={lineRef}
            x1="0" y1="4" x2="300" y2="4"
            stroke="var(--smoke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div className="pipeline-data-packets" ref={dataPacketRef}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="pipeline-data-packet" style={{ backgroundColor: 'var(--signal-pink)' }} />
          ))}
        </div>
      </div>

      <div className="pipeline-grid">
        {METHODOLOGY.map((item, idx) => {
          const isActive = activeStep === idx
          return (
            <div
              key={item.step}
              className={`pipeline-card ${isActive ? 'active-pipeline' : ''}`}
              onMouseEnter={() => setActiveStep(idx)}
            >
              <div className="pipeline-step-row">
                <span className="pipeline-step-num">{item.step}</span>
                <span className="pipeline-icon">{item.icon}</span>
              </div>
              <div className="pipeline-phase">{item.phase}</div>
              <h3 className="pipeline-title">{item.title}</h3>
              <p className="pipeline-desc">{item.desc}</p>

              <div className="pipeline-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="pipeline-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
