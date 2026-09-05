import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import PufferScene from './3d/PufferScene';

const SLIDES = [
  { id: 'alpine-navy', product: 'Alpine Puffer', colorName: 'Midnight Navy', color: '#1e3a8a', price: 349, variant: 'jacket', theme: '#3b82f6' },
  { id: 'alpine-black', product: 'Alpine Puffer', colorName: 'Onyx Black', color: '#111827', price: 349, variant: 'jacket', theme: '#6b7280' },
  { id: 'alpine-olive', product: 'Alpine Puffer', colorName: 'Forest Olive', color: '#14532d', price: 349, variant: 'jacket', theme: '#4d7c0f' },
  { id: 'summit-char', product: 'Summit Vest', colorName: 'Charcoal', color: '#374151', price: 279, variant: 'vest', theme: '#9ca3af' },
  { id: 'summit-steel', product: 'Summit Vest', colorName: 'Steel Grey', color: '#4b5563', price: 279, variant: 'vest', theme: '#9ca3af' },
  { id: 'aurora-ivory', product: 'Aurora Coat', colorName: 'Winter Ivory', color: '#f5f0e6', price: 489, variant: 'coat', theme: '#d4d0c8' },
];

const CHEST_PADDING = 'recycled nylon · Primaloft® Gold insulation · water-resistant';
const ZIPS = '#b89a67';
const EASING = [0.22, 1, 0.36, 1];

const curtainVariants = {
  idle: { scaleY: 0, opacity: 0, transition: { duration: 0.01 } },
  cover: { scaleY: 1, opacity: 1, transition: { duration: 0.5, ease: EASING } },
  reveal: { scaleY: 0, opacity: 0, transition: { duration: 0.5, ease: EASING } },
};

const contentVariants = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASING, staggerChildren: 0.06, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: -14, transition: { duration: 0.3, ease: EASING } },
};

const itemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASING } },
};

export default function HeroSection3D() {
  const [index, setIndex] = useState(0);
  const [target, setTarget] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const transitioning = phase !== 'idle';

  const go = useCallback(
    (nextIndex) => {
      const i = ((nextIndex % SLIDES.length) + SLIDES.length) % SLIDES.length;
      if (i === index || transitioning) return;
      setTarget(i);
      setPhase('cover');
    },
    [index, transitioning]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const goTo = useCallback((i) => go(i), [go]);

  const onCoverEnd = useCallback(() => {
    setIndex(target);
    setTarget(null);
    setPhase('reveal');
  }, [target]);

  const onRevealEnd = useCallback(() => setPhase('idle'), []);

  useEffect(() => {
    if (paused || transitioning) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [paused, transitioning, next]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = SLIDES[index];
  const siblings = SLIDES.filter((s) => s.product === slide.product);

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden text-ivory">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0a09] via-[#161310] to-[#0b0a09]" />
      <motion.div
        className="pointer-events-none absolute -top-40 -right-32 h-[560px] w-[560px] rounded-full opacity-45 blur-[110px]"
        animate={{ backgroundColor: slide.theme }}
        transition={{ duration: 1.2, ease: EASING }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,154,103,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(184,154,103,0.08),transparent_60%)]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1300px] items-center gap-6 px-6 lg:px-8">
        {/* Product info (desktop) */}
        <div className="hidden w-[300px] flex-shrink-0 flex-col gap-8 lg:flex" aria-live="polite">
          <AnimatePresence>
            <motion.div
              key={slide.id + '-info'}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <motion.span variants={itemVariants} className="text-[10px] tracking-luxury uppercase text-gold">
                {slide.colorName}
              </motion.span>
              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl leading-[1.05] tracking-wide sm:text-5xl"
              >
                {slide.product}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-sm text-cream/70">
                {CHEST_PADDING}
              </motion.p>
              <motion.div variants={itemVariants} className="flex items-baseline gap-3">
                <span className="text-3xl font-medium text-ivory">${slide.price}.00</span>
                <span className="text-xs text-cream/50 line-through">$549.00</span>
                <span className="text-[10px] tracking-luxury uppercase text-gold">28% off</span>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                {siblings.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(SLIDES.indexOf(s))}
                    disabled={transitioning}
                    className={`relative h-9 w-9 rounded-full border-2 transition-all duration-300 disabled:opacity-60 ${
                      s.id === slide.id
                        ? 'scale-110 border-gold ring-2 ring-gold'
                        : 'scale-100 border-ivory/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: s.color }}
                    aria-label={s.colorName}
                  />
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-center gap-4 pt-1">
                <button
                  className="btn-gold w-full"
                  disabled={transitioning}
                >
                  Add to Bag →
                </button>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors duration-300 hover:bg-ivory hover:text-espresso"
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} strokeWidth={1.5} />
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D canvas + curtain */}
        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-md flex-shrink-0"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <div className="absolute inset-0 rounded-3xl bg-black/40" />
          <div className="relative h-full w-full overflow-hidden rounded-3xl">
            <PufferScene
              color={slide.color}
              zipper={ZIPS}
              variant={slide.variant}
              scale={1.1}
              hovered={hovered && !transitioning}
              transitioning={transitioning}
            />
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 origin-top"
              style={{ backgroundColor: '#0b0a09' }}
              variants={curtainVariants}
              initial="idle"
              animate={phase}
              onAnimationComplete={(latest) => {
                if (phase === 'cover' && latest.scaleY >= 0.999) onCoverEnd();
                else if (phase === 'reveal' && latest.scaleY <= 0.001) onRevealEnd();
              }}
            />
          </div>
        </div>

        {/* Desktop carousel */}
        <Carousel
          className="hidden w-[260px] flex-shrink-0 lg:flex"
          index={index}
          slide={slide}
          siblings={siblings}
          onNext={next}
          onPrev={prev}
          onGoto={goTo}
          transitioning={transitioning}
          paused={paused}
          onPause={() => setPaused(true)}
          onResume={() => setPaused(false)}
        />

        {/* Mobile content */}
        <div className="mt-8 lg:hidden" aria-live="polite">
          <AnimatePresence>
            <motion.div
              key={slide.id + '-minfo'}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center gap-5 text-center"
            >
              <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{slide.product}</h1>
              <p className="text-sm text-cream/70">{CHEST_PADDING}</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl font-medium">${slide.price}.00</span>
                <span className="text-xs text-cream/50 line-through">$549.00</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-7 lg:hidden">
          <MobileCarousel
            index={index}
            onNext={next}
            onPrev={prev}
            onGoto={goTo}
            transitioning={transitioning}
          />
        </div>
      </div>

      <NavArrows next={next} prev={prev} disabled={transitioning} />
    </section>
  );
}

function NavArrows({ next, prev, disabled }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4 lg:p-6">
      <motion.button
        onClick={prev}
        disabled={disabled}
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto relative z-20 rounded-full border border-ivory/20 p-2 text-ivory opacity-60 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-espresso hover:opacity-100 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </motion.button>
      <motion.button
        onClick={next}
        disabled={disabled}
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto relative z-20 rounded-full border border-ivory/20 p-2 text-ivory opacity-60 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-espresso hover:opacity-100 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}

function Carousel({ className, index, slide, siblings, onNext, onPrev, onGoto, transitioning, paused, onPause, onResume }) {
  return (
    <div className={className} onMouseEnter={onPause} onMouseLeave={onResume}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] tracking-luxury text-cream/50">
          {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrev}
            disabled={transitioning}
            className="rounded p-1 text-cream/60 transition-colors hover:text-ivory disabled:opacity-50"
            aria-label="Previous"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={onNext}
            disabled={transitioning}
            className="rounded p-1 text-cream/60 transition-colors hover:text-ivory disabled:opacity-50"
            aria-label="Next"
          >
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1">
        {SLIDES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => onGoto(i)}
            disabled={transitioning}
            whileHover={{ x: 3 }}
            className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-left text-xs transition-colors disabled:opacity-50 ${
              i === index
                ? 'bg-gold/15 font-medium text-ivory'
                : 'text-cream/60 hover:bg-ivory/5 hover:text-ivory'
            }`}
          >
            <span
              className={`h-8 w-8 flex-shrink-0 rounded-full ring-2 transition-all duration-300 ${
                i === index ? 'ring-gold' : 'ring-ivory/10 group-hover:ring-ivory/30'
              }`}
              style={{ backgroundColor: s.color }}
            />
            <span className="truncate uppercase tracking-luxury">{s.colorName}</span>
            {i === index && (
              <span className="absolute right-2 block h-1.5 w-1.5 rounded-full bg-gold" />
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={slide.id + '-legend'}
        className="mt-5 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: slide.color }} />
        <span className="text-[10px] tracking-luxury uppercase text-cream/50">{slide.colorName}</span>
      </motion.div>
    </div>
  );
}

function MobileCarousel({ index, onNext, onPrev, onGoto, transitioning }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={transitioning}
        className="rounded-full border border-ivory/20 p-2 text-ivory disabled:opacity-50"
        aria-label="Previous"
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>
      <div className="flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onGoto(i)}
            disabled={transitioning}
            className={`relative h-2.5 w-2.5 rounded-full transition-all disabled:opacity-50 ${
              i === index ? 'w-6 bg-gold' : 'bg-ivory/20 hover:bg-ivory/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={transitioning}
        className="rounded-full border border-ivory/20 p-2 text-ivory disabled:opacity-50"
        aria-label="Next"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
