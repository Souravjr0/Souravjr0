import { useEffect, useRef } from 'react'
import { useIsTouchDevice } from '../hooks/useAnimev4'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isTouch = useIsTouchDevice()

  useEffect(() => {
    if (isTouch) return

    let animationId
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let lastMoveTime = performance.now()
    let lastHoverCheck = 0
    let isAnimating = false

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      lastMoveTime = performance.now()

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }

      const now = performance.now()
      if (now - lastHoverCheck > 100) {
        lastHoverCheck = now
        const target = e.target
        const isInteractive = target.closest('a, button, input, textarea, .terminal-chip, .metric-card, .project-card, .pipeline-card')
        if (ringRef.current) {
          ringRef.current.classList.toggle('hovered', !!isInteractive)
        }
      }

      if (!isAnimating) {
        isAnimating = true
        animationId = requestAnimationFrame(animateRing)
      }
    }

    const animateRing = (time) => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      if (time - lastMoveTime > 500 && Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1) {
        isAnimating = false
        return
      }

      animationId = requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    
    // Initial start
    isAnimating = true
    animationId = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
