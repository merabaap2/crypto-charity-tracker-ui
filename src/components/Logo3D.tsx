// ---------- /components/Logo3D.tsx ----------
'use client'

import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { Heart as HeartIcon } from 'lucide-react'
import * as THREE from 'three'

function Heart3D() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { viewport } = useThree()

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Auto-rotate when not hovered
      if (!hovered) {
        meshRef.current.rotation.y += delta * 0.5
      }
      
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const handleHover = () => {
    setHovered(true)
    if (meshRef.current) {
      // Rotate 360 degrees on hover
      meshRef.current.rotation.y += Math.PI * 2
    }
    setTimeout(() => setHovered(false), 800)
  }

  return (
    <mesh 
      ref={meshRef}
      onPointerEnter={handleHover}
      scale={viewport.width > 2 ? 0.8 : 0.6}
    >
      <sphereGeometry args={[0.6, 16, 16]} />
      <meshStandardMaterial 
        color="#059669" 
        emissive="#059669"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

function Logo3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Heart3D />
      </Suspense>
    </Canvas>
  )
}

// Fallback component for when WebGL is not supported
function FallbackHeart() {
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1] 
      }}
      transition={{ 
        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <HeartIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
    </motion.div>
  )
}

export default function Logo3D() {
  const [webGLSupported, setWebGLSupported] = useState(true)

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebGLSupported(false)
      }
    } catch (e) {
      setWebGLSupported(false)
    }
  }, [])

  // Use media query to disable on mobile if user prefers reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  if (!webGLSupported || prefersReducedMotion) {
    return <FallbackHeart />
  }

  return (
    <div className="w-full h-full" role="img" aria-hidden="true">
      <Logo3DScene />
    </div>
  )
}