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
  },

]

const CARD_WIDTH = 800
const CARD_HEIGHT = 442
const RADIUS = 32 // one value, used on the frame AND every card so corners always line up

const X_STEP = 300 // horizontal distance between neighbouring cards (px) – smaller = shorter peek
const THETA = 10 // rotateY per step (deg) – flat "peeking" look, not a tight cylinder
const AUTO_PLAY_MS = 2000 // how long each slide stays active before advancing


const SIDE_HEIGHT_BOOST = 60

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26, mass: 0.85 }

function arcStyle(offset: number) {
  const abs = Math.abs(offset)

  return {
    x: offset * X_STEP,
    rotateY: -offset * THETA,
    scale: abs === 0 ? 1 : abs === 1 ? 0.94 : 0.85,
    opacity: abs <= 1 ? 1 : 0,
    zIndex: 10 - abs
  }
}

function cardHeight(offset: number) {
  const abs = Math.abs(offset)

  if (abs === 0) return CARD_HEIGHT

  return Math.round(CARD_HEIGHT * 0.72) + SIDE_HEIGHT_BOOST
}

const BannerCarousel = () => {
  const total = Images.length
  const [active, setActive] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  const go = React.useCallback((dir: 1 | -1) => setActive(i => (i + dir + total) % total), [total])

  // Keyboard navigation
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }

    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [go])

  // Auto-play: advance one slide every AUTO_PLAY_MS, pauses on hover
  React.useEffect(() => {
    if (isPaused) return

    const id = setInterval(() => go(1), AUTO_PLAY_MS)

    return () => clearInterval(id)
  }, [go, isPaused])

  return (
    <Carousel
      className='flex w-full flex-col items-center gap-8 py-8 select-none'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* frame is wide enough (see RADIUS/X_STEP note above) that it never slices through a card */}
      <div
        className='relative mx-auto w-full max-w-[1450px] overflow-hidden'
        style={{ height: CARD_HEIGHT, borderRadius: RADIUS }}
      >
        {Images.map((slide, i) => {
          // Shortest signed offset around the loop
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
                className='relative w-full overflow-hidden bg-neutral-200 '
                style={{ borderRadius: RADIUS }}
                animate={{ height: cardHeight(offset) }}
                transition={SPRING}
              >
               {/* Banner */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className='absolute inset-0 size-full object-cover object-center'
                  draggable={false}
                  loading='lazy'
                />

           
                <div className='absolute inset-0  to-transparent' />
                
                <motion.div
                  className='absolute inset-x-0 bottom-0 px-4 pb-5'
                  animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : 12 }}
                  transition={{ duration: 0.28 }}
                >
                  <span className='text-[10px] font-medium tracking-[0.18em] text-white uppercase'>
                    {slide.category}
                  </span>
                  <p className='mt-0.5 text-sm leading-snug font-semibold text-white'>{slide.title}</p>
                </motion.div>

                {/* Active ring */}
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

      <div className='flex items-center gap-3'>
        <CarouselPrevious className='static top-auto left-auto translate-y-0' onClick={() => go(-1)} disabled={false} />

        <div className='flex items-center gap-2'>
          {Images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className='h-3 rounded-full transition-all duration-300'
              style={{
                width: active === i ? 12 : 12,
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