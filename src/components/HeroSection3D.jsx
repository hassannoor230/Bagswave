import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCT_IMAGES } from '../data/productImages';

const PRODUCTS = [
  {
    id: 'bow-tote',
    label: 'BOW TOTE',
    eyebrow: 'NEW COLLECTION — 2026',
    title: ['THE ART', 'OF CARRYING'],
    description: 'Timeless silhouettes crafted for modern women who appreciate understated luxury.',
    image: PRODUCT_IMAGES[0],
    tone: '#b99570',
  },
  {
    id: 'signature-bag',
    label: 'SIGNATURE BAG',
    eyebrow: 'THE ICON EDIT — 2026',
    title: ['FORM', 'WITH FEELING'],
    description: 'A considered shape, finished by hand and designed to stay with you.',
    image: PRODUCT_IMAGES[1],
    tone: '#9b826e',
  },
  {
    id: 'mini-shoulder',
    label: 'MINI SHOULDER',
    eyebrow: 'THE EVENING EDIT — 2026',
    title: ['A SMALL', 'MASTERPIECE'],
    description: 'The essential evening silhouette, made quietly unforgettable.',
    image: PRODUCT_IMAGES[2],
    tone: '#b6a18b',
  },
  {
    id: 'classic-tote',
    label: 'CLASSIC TOTE',
    eyebrow: 'THE NEW CLASSICS — 2026',
    title: ['CARRY', 'YOUR STORY'],
    description: 'Room for the rituals of every day, shaped with a lighter touch.',
    image: PRODUCT_IMAGES[3],
    tone: '#b99570',
  },
  {
    id: 'atelier-piece',
    label: 'ATELIER PIECE',
    eyebrow: 'BAGSWAVES ATELIER — 2026',
    title: ['MADE TO', 'BE REMEMBERED'],
    description: 'A signature piece with presence, proportion, and a point of view.',
    image: PRODUCT_IMAGES[4],
    tone: '#8b6a50',
  },
];

const EASING = [0.22, 1, 0.36, 1];
const reveal = { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASING } } };

export default function HeroSection3D() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const slide = PRODUCTS[index];
  const { scrollYProgress } = useScroll();
  const productY = useTransform(scrollYProgress, [0, 0.2], [0, -70]);
  const productScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.88]);
  const backgroundY = useTransform(scrollYProgress, [0, 0.2], [0, 40]);

  const go = useCallback(
    (nextIndex) => {
      const i = ((nextIndex % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length;
      if (i === index) return;
      setIndex(i);
    },
    [index]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const goTo = useCallback((i) => go(i), [go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 2, y: ((event.clientY - rect.top) / rect.height - 0.5) * 2 });
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#e9e0d4] text-espresso lg:min-h-[820px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setPointer({ x: 0, y: 0 }); }}
      onMouseMove={handlePointerMove}
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(226,207,188,0.72),transparent_26%),linear-gradient(120deg,#cdb39a_0%,#e3d1bd_46%,#b59679_100%)]" />
      <motion.div
        className="pointer-events-none absolute -right-40 top-0 h-[620px] w-[620px] rounded-full opacity-40 blur-[120px]"
        animate={{ backgroundColor: slide.tone }}
        transition={{ duration: 1.2, ease: EASING }}
      />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[440px] w-[780px] -translate-x-1/2 rounded-[50%] border border-white/50 bg-[#c4ad95]/30 blur-[1px]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(71,48,35,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,48,35,0.08)_1px,transparent_1px)] [background-size:84px_84px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col justify-center px-5 pb-10 pt-28 sm:px-8 lg:min-h-[820px] lg:px-16 lg:pb-14 lg:pt-32">
        <div className="absolute left-5 right-5 top-24 flex items-center justify-between border-b border-espresso/20 pb-4 text-[10px] uppercase tracking-luxury text-espresso/60 sm:left-8 sm:right-8 lg:left-16 lg:right-16 lg:top-32">
          <span>Objects of desire / {String(index + 1).padStart(2, '0')}</span>
          <span className="hidden sm:block">BagsWaves atelier / 2026</span>
          <span className="text-espresso">Scroll to discover ↓</span>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.75fr_1.5fr_0.7fr] lg:gap-0">
        <motion.div className="order-2 z-20 lg:order-1" style={{ x: pointer.x * 4, y: pointer.y * 3 }} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              variants={reveal}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex max-w-[335px] flex-col gap-5"
            >
              <span className="text-[10px] uppercase tracking-luxury text-gold">{slide.eyebrow}</span>
              <h1 className="font-serif text-6xl leading-[0.88] tracking-wide text-espresso sm:text-7xl">{slide.title.map((line) => <span key={line} className="block">{line}</span>)}</h1>
              <p className="max-w-xs text-sm leading-relaxed text-espresso/65">{slide.description}</p>
              <div className="flex flex-wrap gap-3 pt-3">
                <Link to="/collections/the-icon-edit" className="btn-primary gap-2">Explore collection <ArrowUpRight size={15} strokeWidth={1.5} /></Link>
                <Link to="/shop" className="btn-outline border-espresso gap-2">Shop now <ArrowUpRight size={15} strokeWidth={1.5} /></Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div className="relative order-1 mx-auto h-[54vh] min-h-[390px] w-full max-w-[700px] lg:order-2 lg:h-[650px]" style={{ y: productY, scale: productScale }}>
          <DepthProduct product={PRODUCTS[(index + 2) % PRODUCTS.length]} className="left-[2%] top-[15%] w-[26%] -rotate-12 opacity-25 blur-[2px]" style={{ x: pointer.x * -10, y: pointer.y * -6 }} />
          <DepthProduct product={PRODUCTS[(index + 3) % PRODUCTS.length]} className="right-[1%] top-[24%] w-[24%] rotate-12 opacity-20 blur-[2px]" style={{ x: pointer.x * -14, y: pointer.y * -8 }} />
          <motion.div className="absolute inset-0 z-10 flex items-center justify-center" style={{ x: pointer.x * -12, y: pointer.y * -8 }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.id}
                src={slide.image}
                alt={slide.label}
                className="h-[92%] w-[78%] object-contain mix-blend-multiply drop-shadow-[0_38px_28px_rgba(72,44,26,0.3)]"
                initial={{ opacity: 0, scale: 0.82, y: 42, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: pointer.x * 2.5, transition: { duration: 1, ease: EASING } }}
                exit={{ opacity: 0, scale: 0.92, y: -30, rotate: 5, transition: { duration: 0.65, ease: EASING } }}
              />
            </AnimatePresence>
          </motion.div>
          <div className="absolute bottom-[5%] left-1/2 z-0 h-10 w-[54%] -translate-x-1/2 rounded-[50%] bg-[#684b38]/25 blur-2xl" />
          <div className="absolute left-[10%] top-[10%] text-[9px] uppercase tracking-luxury text-espresso/45">B/W — signature form</div>
          <div className="absolute bottom-[12%] right-[8%] text-[9px] uppercase tracking-luxury text-espresso/45">01 — atelier object</div>
        </motion.div>

        <Carousel
          className="order-3 hidden lg:flex"
          index={index}
          slide={slide}
          onNext={next}
          onPrev={prev}
          onGoto={goTo}
          paused={paused}
          onPause={() => setPaused(true)}
          onResume={() => setPaused(false)}
        />

        {/* Mobile content */}
        <div className="order-3 mt-7 lg:hidden">
          <MobileCarousel
            index={index}
            onNext={next}
            onPrev={prev}
            onGoto={goTo}
          />
        </div>
        </div>
      </div>

      <NavArrows next={next} prev={prev} />
    </section>
  );
}

function DepthProduct({ product, className, style }) {
  return <motion.img src={product.image} alt="" aria-hidden="true" className={`pointer-events-none absolute z-0 object-contain mix-blend-multiply ${className}`} style={style} />;
}

function NavArrows({ next, prev }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4 lg:p-6">
      <motion.button
        onClick={prev}
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto relative z-20 rounded-full border border-ivory/20 p-2 text-ivory opacity-60 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-espresso hover:opacity-100 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </motion.button>
      <motion.button
        onClick={next}
        whileHover={{ scale: 1.1 }}
        className="pointer-events-auto relative z-20 rounded-full border border-ivory/20 p-2 text-ivory opacity-60 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-espresso hover:opacity-100 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}

function Carousel({ className, index, slide, onNext, onPrev, onGoto, paused, onPause, onResume }) {
  return (
    <div className={className} onMouseEnter={onPause} onMouseLeave={onResume}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] tracking-luxury text-cream/50">
          {String(index + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrev}
            className="rounded p-1 text-cream/60 transition-colors hover:text-ivory disabled:opacity-50"
            aria-label="Previous"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={onNext}
            className="rounded p-1 text-cream/60 transition-colors hover:text-ivory disabled:opacity-50"
            aria-label="Next"
          >
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1">
        {PRODUCTS.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => onGoto(i)}
            whileHover={{ x: 3 }}
            className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-left text-xs transition-colors ${
              i === index
                ? 'bg-gold/25 font-medium text-espresso'
                : 'text-espresso/60 hover:bg-espresso/5 hover:text-espresso'
            }}`}
          >
            <span
              className={`h-8 w-8 flex-shrink-0 rounded-full ring-2 transition-all duration-300 ${
                i === index ? 'ring-gold' : 'ring-ivory/10 group-hover:ring-ivory/30'
              }`}
              style={{ backgroundColor: s.tone }}
            />
            <span className="truncate uppercase tracking-luxury">{s.label}</span>
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
        <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: slide.tone }} />
        <span className="text-[10px] tracking-luxury uppercase text-espresso/50">{slide.label}</span>
      </motion.div>
    </div>
  );
}

function MobileCarousel({ index, onNext, onPrev, onGoto }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        className="rounded-full border border-ivory/20 p-2 text-ivory disabled:opacity-50"
        aria-label="Previous"
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>
      <div className="flex items-center gap-1.5">
        {PRODUCTS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onGoto(i)}
            className={`relative h-2.5 w-2.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-gold' : 'bg-espresso/20 hover:bg-espresso/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        className="rounded-full border border-ivory/20 p-2 text-ivory disabled:opacity-50"
        aria-label="Next"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
