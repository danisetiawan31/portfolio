'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Thumbnail */}
      <div
        className={cn(
          'group relative cursor-pointer overflow-hidden',
          className,
        )}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />

        {/* Optional overlay hint for clickability */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-black/20" />
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:top-8 sm:right-8"
              aria-label="Close fullscreen image"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Full Image Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="relative h-full w-full max-w-7xl cursor-default"
              onClick={(e) => e.stopPropagation()} // Click on image doesn't close it, only background does
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
