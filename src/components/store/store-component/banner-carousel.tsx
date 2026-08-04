'use client'

import * as React from 'react'

import { motion } from 'motion/react'

import { Carousel, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'


const Images = [
  {
    image: 'https://i.pinimg.com/1200x/c0/f8/ba/c0f8ba42bf6326a396e2142e4c07c06f.jpg',
    title: 'Mountain Sunrise',
    category: 'Nature'
  },
  {
    image: 'https://i.pinimg.com/1200x/47/8a/89/478a89478549995ede493208120f391a.jpg',
    title: 'Ocean Waves',
    category: 'Seascape'
  },
  {
    image: 'https://i.pinimg.com/1200x/d8/c1/d4/d8c1d4cb5a8c9a61d52455f5ecebe932.jpg',
    title: 'Forest Path',
    category: 'Woodland'
  }
]

const THETA = 10 // rotateY per step (deg) – flat "peeking" look, not a tight cylinder
const AUTO_PLAY_MS = 2000 // how long each slide stays active before advancing
const SIDE_HEIGHT_BOOST_RATIO = 0.14 // scales with card height instead of a fixed 60px

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26, mass: 0.85 }

// Responsive dimension hook — desktop values are IDENTICAL to your original
// module constants (800 / 442 / 300 / 32), so desktop shape is unchanged.
// Only phone/tablet get their own sizes so the card actually fits those screens.
function useResponsiveDims() {
  const [dims, setDims] = React.useState({
    CARD_WIDTH: 800,
    CARD_HEIGHT: 442,
    X_STEP: 300,
    RADIUS: 32
  })

  React.useEffect(() => {
    const compute = () => {
      const w = window.innerWidth

      if (w < 640) {
        // phone
        const cardW = Math.min(w * 0.78, 320)

        setDims({
          CARD_WIDTH: cardW,
          CARD_HEIGHT: Math.round(cardW * 0.55), // same ~1.8:1 ratio as desktop (800/442)
          X_STEP: cardW * 0.42,
          RADIUS: 20
        })
      } else if (w < 1024) {
        // tablet
        setDims({
          CARD_WIDTH: 520,
          CARD_HEIGHT: 287, // same ~1.8:1 ratio as desktop
          X_STEP: 220,
          RADIUS: 26
        })
      } else {
        // desktop — untouched, matches your original constants exactly
        setDims({
          CARD_WIDTH: 800,
          CARD_HEIGHT: 442,
          X_STEP: 300,
          RADIUS: 32
        })
      }
    }

    compute()
    window.addEventListener('resize', compute)

    return () => window.removeEventListener('resize', compute)
  }, [])

  return dims
}

const BannerCarousel = () => {
  const total = Images.length
  const [active, setActive] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const { CARD_WIDTH, CARD_HEIGHT, X_STEP, RADIUS } = useResponsiveDims()

  const go = React.useCallback((dir: 1 | -1) => setActive(i => (i + dir + total) % total), [total])

  // Keyboard navigation — unchanged
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [go])

  // Auto-play — unchanged
  React.useEffect(() => {
    if (isPaused) return

    const id = setInterval(() => go(1), AUTO_PLAY_MS)

    return () => clearInterval(id)
  }, [go, isPaused])

  // Same formulas as your original arcStyle/cardHeight, closures over responsive dims
  const arcStyle = (offset: number) => {
    const abs = Math.abs(offset)

    return {
      x: offset * X_STEP,
      rotateY: -offset * THETA,
      scale: abs === 0 ? 1 : abs === 1 ? 0.94 : 0.85,
      opacity: abs <= 1 ? 1 : 0,
      zIndex: 10 - abs
    }
  }

  const cardHeight = (offset: number) => {
    const abs = Math.abs(offset)

    if (abs === 0) return CARD_HEIGHT

    return Math.round(CARD_HEIGHT * 0.72) + CARD_HEIGHT * SIDE_HEIGHT_BOOST_RATIO
  }

  return (
    <Carousel
      className='flex w-full flex-col items-center gap-4  select-none sm:gap-6 sm:py-6 lg:gap-8 lg:py-8'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className='relative w-screen overflow-hidden sm:mx-auto sm:max-w-[760px] lg:max-w-[1450px]'
        style={{ height: CARD_HEIGHT + 24 }} // derived from CARD_HEIGHT — no more mismatched empty space
      >
        {Images.map((slide, i) => {
          const raw = (i - active + total) % total
          const offset = raw > total / 2 ? raw - total : raw
          const { x, rotateY, scale, opacity, zIndex } = arcStyle(offset)

          return (
            <motion.div
              key={i}
              className='absolute top-0 left-1/2 flex cursor-pointer items-center justify-center'
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginLeft: -CARD_WIDTH / 2, zIndex }}
              animate={{ x, rotateY, scale, opacity }}
              transition={SPRING}
              onClick={() => setActive(i)}
              aria-label={`View ${slide.title}`}
            >
              <motion.div
                className='relative w-full overflow-hidden bg-neutral-200'
                style={{ borderRadius: RADIUS }}
                animate={{ height: cardHeight(offset) }}
                transition={SPRING}
              >
                {/* Banner — back to plain object-cover, same as your original */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className='absolute inset-0 size-full object-cover object-center'
                  draggable={false}
                  loading='lazy'
                />

                <div className='absolute inset-0 to-transparent' />

                <motion.div
                  className='absolute inset-x-0 bottom-0 px-3 pb-4 sm:px-4 sm:pb-5'
                  animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : 12 }}
                  transition={{ duration: 0.28 }}
                >
                  <span className='text-[9px] font-medium tracking-[0.18em] text-white uppercase sm:text-[10px]'>
                    {slide.category}
                  </span>
                  <p className='mt-0.5 text-xs leading-snug font-semibold text-white sm:text-sm'>{slide.title}</p>
                </motion.div>

                <motion.div
                  className='pointer-events-none absolute inset-0 ring-2 ring-white/70 ring-inset'
                  style={{ borderRadius: RADIUS }}
                  animate={{ opacity: offset === 0 ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <div className='flex items-center gap-2 sm:gap-3'>
        <CarouselPrevious className='static top-auto left-auto translate-y-0' onClick={() => go(-1)} disabled={false} />

        <div className='flex items-center gap-1.5 sm:gap-2'>
          {Images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className='h-2.5 rounded-full transition-all duration-300 sm:h-3'
              style={{
                width: active === i ? 10 : 10,
                backgroundColor: active === i ? 'var(--primary)' : 'var(--muted-foreground)',
                opacity: active === i ? 1 : 0.35
              }}
            />
          ))}
        </div>

        <CarouselNext className='static top-auto right-auto translate-y-0' onClick={() => go(1)} disabled={false} />
      </div>
    </Carousel>
  )
}

export default BannerCarousel