// components/ui/click-spark.tsx
'use client'

import React, { useRef, useEffect, useCallback } from 'react'

interface ClickSparkProps {
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  extraScale?: number
  children?: React.ReactNode
}

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
  color: string
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#a855f7',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const animationIdRef = useRef<number | null>(null)
  const isAnimatingRef = useRef<boolean>(false)
  const drawLoopRef = useRef<((timestamp: number) => void) | null>(null)

  // Resize canvas to match parent dimensions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    let resizeTimeout: ReturnType<typeof setTimeout>

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(parent)

    resizeCanvas()

    return () => {
      ro.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [])

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing],
  )

  // Keep draw logic updated with latest props without re-triggering unnecessary renders
  useEffect(() => {
    drawLoopRef.current = (timestamp: number) => {
      const canvas = canvasRef.current
      if (!canvas) {
        isAnimatingRef.current = false
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        isAnimatingRef.current = false
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) {
          return false
        }

        const progress = elapsed / duration
        const eased = easeFunc(progress)

        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)

        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        ctx.strokeStyle = spark.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      // If sparks remain, schedule next frame; otherwise, stop the loop and sleep
      if (sparksRef.current.length > 0 && drawLoopRef.current) {
        animationIdRef.current = requestAnimationFrame(drawLoopRef.current)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        isAnimatingRef.current = false
        animationIdRef.current = null
      }
    }
  }, [duration, easeFunc, extraScale, sparkRadius, sparkSize])

  const startAnimation = useCallback(() => {
    if (!isAnimatingRef.current && drawLoopRef.current) {
      isAnimatingRef.current = true
      animationIdRef.current = requestAnimationFrame(drawLoopRef.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  const addSparksAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    const now = performance.now()

    // Resolve dynamic theme colors
    let resolvedColor = sparkColor
    if (sparkColor.startsWith('var(')) {
      const varName = sparkColor.match(/var\(([^)]+)\)/)?.[1]
      if (varName) {
        resolvedColor = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim()
      }
    } else if (
      [
        'primary',
        'secondary',
        'accent',
        'muted',
        'destructive',
        'success',
        'card',
        'popover',
        'background',
        'foreground',
      ].includes(sparkColor)
    ) {
      resolvedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${sparkColor}`)
        .trim()
    }

    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
      color: resolvedColor,
    }))

    sparksRef.current.push(...newSparks)
    startAnimation()
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    addSparksAt(e.clientX, e.clientY)
  }

  return (
    <div className="relative h-full w-full" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[9999]"
      />
      {children}
    </div>
  )
}

export default ClickSpark
