import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    collection: 'THE ICON EDIT',
    headline: ['TIMELESS.', 'ICONIC.', 'YOURS.'],
    sub: 'Timeless silhouettes designed for modern luxury.',
    cta: 'Shop Collection',
    link: '/collections/the-icon-edit',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=90',
    bg: '#0B0A09'
  },
  {
    id: 2,
    collection: 'THE NEW CLASSICS',
    headline: ['MADE TO', 'BE REMEMBERED.'],
    sub: 'Pieces that become part of your story.',
    cta: 'Explore Bags',
    link: '/collections/the-new-classics',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a6749f9?w=1200&q=90',
    bg: '#1a1614'
  },
  {
    id: 3,
    collection: 'EVENING EDIT',
    headline: ['ELEGANCE', 'AFTER DARK.'],
    sub: 'Sophistication for nights that matter.',
    cta: 'Discover Edit',
    link: '/collections/evening-edit',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=90',
    bg: '#12100e'
  },
  {
    id: 4,
    collection: 'SIGNATURE COLLECTION',
    headline: ['CARRY', 'YOUR STORY.'],
    sub: 'The defining pieces of the house.',
    cta: 'Shop Signature',
    link: '/collections/signature-collection',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=90',
    bg: '#0B0A09'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 6000);
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

  const slide = slides[current];
  const nextSlide = slides[(current + 1) % slides.length];

  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden bg-black text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          style={{ backgroundColor: slide.bg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      <div className="relative h-full container-luxury flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full pt-20 pb-16">
          <div className="relative z-10 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-text'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[11px] tracking-wider uppercase text-gold mb-6">{slide.collection}</p>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-wide mb-6">
                  {slide.headline.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                <p className="text-sm md:text-base text-cream/80 max-w-md mb-10 font-light leading-relaxed">
                  {slide.sub}
                </p>
                <Link to={slide.link} className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-black">
                  {slide.cta} →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative order-1 lg:order-2 h-[50vh] lg:h-[70vh] flex items-center justify-center">
            <motion.div
              className="absolute w-[70%] max-w-md aspect-[3/4] pointer-events-none"
              style={{ filter: 'blur(2px)' }}
              animate={{ opacity: 0.35, scale: 0.88, x: 40, y: 10 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={nextSlide.image} alt="" className="w-full h-full object-cover object-center" />
            </motion.div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id + '-img'}
                className="relative w-[75%] max-w-lg aspect-[3/4] z-10 shadow-2xl"
                custom={direction}
                initial={{ opacity: 0, scale: 0.92, x: direction * 60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: direction * -40 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={slide.image} alt={slide.collection} className="w-full h-full object-cover object-center" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 container-luxury flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xs tracking-luxury tabular-nums">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <div className="hidden sm:flex gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-px transition-all duration-500 ${i === current ? 'w-8 bg-gold' : 'w-4 bg-ivory/40'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={prev} className="p-2 hover:text-gold transition" aria-label="Previous">
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button onClick={next} className="p-2 hover:text-gold transition flex items-center gap-1 text-xs tracking-luxury uppercase" aria-label="Next">
              Next <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
