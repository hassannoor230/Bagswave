import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductScene from './3d/ProductScene';

const SLIDES = [
  { id: 'apex-black', product: 'Apex Top Handle', colorName: 'Onyx Black', color: '#111827', price: 420, original: 529, variant: 'tophandle', theme: '#6b7280' },
  { id: 'apex-cognac', product: 'Apex Top Handle', colorName: 'Cognac', color: '#78350f', price: 420, original: 529, variant: 'tophandle', theme: '#ea580c' },
  { id: 'apex-navy', product: 'Apex Top Handle', colorName: 'Midnight Navy', color: '#1e3a8a', price: 420, original: 529, variant: 'tophandle', theme: '#2563eb' },
  { id: 'luna-black', product: 'Luna Crossbody', colorName: 'Onyx Black', color: '#111827', price: 385, original: 489, variant: 'crossbody', theme: '#6b7280' },
  { id: 'luna-burgundy', product: 'Luna Crossbody', colorName: 'Burgundy', color: '#7c2d12', price: 385, original: 489, variant: 'crossbody', theme: '#b91c1c' },
  { id: 'luna-stone', product: 'Luna Crossbody', colorName: 'Stone', color: '#d4cfc3', price: 385, original: 489, variant: 'crossbody', theme: '#d4d0c8' },
];

const LINE = 'hand-selected vegetable-tanned leather · solid brass hardware · handcrafted in Tuscany';
const HARDWARE = '#b89a67';
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
  const slide = SLIDES[index];
  const siblings = SLIDES.filter((s) => s.product === slide.product);
  const discount = slide.original ? Math.round((1 - slide.price / slide.original) * 100) : 0;

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

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#11100e] text-ivory lg:min-h-[790px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(184,154,103,0.17),transparent_26%),linear-gradient(116deg,#0b0a09_0%,#171511_48%,#0d0d0c_100%)]" />
      <motion.div
        className="pointer-events-none absolute -right-40 top-0 h-[620px] w-[620px] rounded-full opacity-30 blur-[120px]"
        animate={{ backgroundColor: slide.theme }}
        transition={{ duration: 1.2, ease: EASING }}
      />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(247,243,237,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(247,243,237,0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-5 pb-8 pt-28 sm:px-8 lg:min-h-[790px] lg:px-12 lg:pb-12 lg:pt-28">
        <div className="mb-7 flex items-center justify-between border-b border-ivory/15 pb-4 text-[10px] uppercase tracking-luxury text-cream/60 lg:mb-0 lg:absolute lg:left-12 lg:right-12 lg:top-28">
          <span>Objects of desire / 01</span>
          <span className="hidden sm:block">BagsWaves atelier / 2024</span>
          <span className="text-gold">Scroll to discover</span>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.75fr_1.5fr_0.7fr] lg:gap-4">
        {/* Product info (desktop) */}
        <div className="order-2 hidden flex-col gap-8 lg:order-1 lg:flex" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-info'}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex max-w-[285px] flex-col gap-6"
            >
              <motion.span variants={itemVariants} className="flex items-center gap-3 text-[10px] uppercase tracking-luxury text-gold">
                <span className="h-px w-8 bg-gold" /> New season / {slide.colorName}
              </motion.span>
              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl leading-[1.05] tracking-wide sm:text-5xl"
              >
                {slide.product}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-sm text-cream/70">
                {LINE}
              </motion.p>
              <motion.div variants={itemVariants} className="flex items-baseline gap-3">
                <span className="text-3xl font-medium text-ivory">${slide.price}.00</span>
                <span className="text-xs text-cream/50 line-through">${slide.original}.00</span>
                <span className="text-[10px] tracking-luxury uppercase text-gold">{discount}% off</span>
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
                <Link to="/shop" className="btn-gold w-full gap-2" aria-label={`Shop ${slide.product}`}>
                  Shop piece <ArrowUpRight size={15} strokeWidth={1.5} />
                </Link>
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
          className="order-1 relative mx-auto aspect-square w-full max-w-[680px] lg:order-2"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <div className="absolute inset-[7%] border border-gold/20 bg-black/20 shadow-[0_30px_90px_rgba(0,0,0,0.35)]" />
          <div className="absolute left-[12%] top-[12%] text-[9px] uppercase tracking-luxury text-cream/40">B/W — signature form</div>
          <div className="absolute bottom-[12%] right-[12%] text-[9px] uppercase tracking-luxury text-cream/40">01 — crafted in Tuscany</div>
          <div className="relative h-full w-full overflow-hidden">
            <ProductScene
              color={slide.color}
              zipper={HARDWARE}
              variant={slide.variant}
              scale={1.35}
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
          className="order-3 hidden lg:flex"
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
        <div className="order-2 mt-2 lg:hidden" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-minfo'}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center gap-4 text-center"
            >
              <span className="text-[10px] uppercase tracking-luxury text-gold">New season / {slide.colorName}</span>
              <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{slide.product}</h1>
              <p className="text-sm text-cream/70">{LINE}</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl font-medium">${slide.price}.00</span>
                <span className="text-xs text-cream/50 line-through">${slide.original}.00</span>
              </div>
              <Link to="/shop" className="btn-gold mt-1 gap-2">Shop piece <ArrowUpRight size={15} strokeWidth={1.5} /></Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="order-3 mt-7 lg:hidden">
          <MobileCarousel
            index={index}
            onNext={next}
            onPrev={prev}
            onGoto={goTo}
            transitioning={transitioning}
          />
        </div>
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
            }}`}
          >
            <span
              className={`h-8 w-8 flex-shrink-0 rounded-full ring-2 transition-all duration-300 ${
                i === index ? 'ring-gold' : 'ring-ivory/10 group-hover:ring-ivory/30'
              }`}
              style={{ backgroundColor: s.color }}
            />
            <span className="truncate uppercase tracking-luxury">{s.colorName}</span>
            {i === index && <span className="absolute right-2 block h-1.5 w-1.5 rounded-full bg-gold" />}
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
