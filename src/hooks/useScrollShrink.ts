// ---------- /hooks/useScrollShrink.ts ----------
'use client'

import { useState, useEffect } from 'react'
import { useScroll, useMotionValue } from 'framer-motion'

export function useScrollShrink(threshold: number = 80) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const scrollYValue = useMotionValue(0)

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      scrollYValue.set(latest)
      setIsScrolled(latest > threshold)
    })

    return unsubscribe
  }, [scrollY, scrollYValue, threshold])

  return {
    isScrolled,
    scrollY: scrollYValue,
  }
}