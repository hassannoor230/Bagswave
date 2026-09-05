import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection3D from '../components/HeroSection3D';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export default function Home() {
  const [featured, setFeatured] = useState({ bestsellers: [], newArrivals: [] });

  useEffect(() => {
    api.get('/products/featured').then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <HeroSection3D />

      {/* Featured Collection Editorial */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/5] bg-cream overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1590874103328-eac38a6749f9?w=900&q=85"
                alt="The Icon Edit"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:pl-8"
            >
              <p className="text-[11px] tracking-luxury uppercase text-gold mb-4">Featured Collection</p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-wide mb-6">The Icon Edit</h2>
              <p className="text-taupe leading-relaxed mb-8 max-w-md">
                Timeless silhouettes designed for modern luxury. Each piece is crafted to become a lasting companion — refined, confident, and unmistakably BagsWaves.
              </p>
              <Link to="/collections/the-icon-edit" className="btn-primary">Explore →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-cream/50">
        <div className="container-luxury">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[11px] tracking-luxury uppercase text-gold mb-2">Just In</p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-wide">New Arrivals</h2>
            </div>
            <Link to="/shop?isNewArrival=true" className="text-xs tracking-luxury uppercase hover:opacity-70 hidden sm:block">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {(featured.newArrivals.length ? featured.newArrivals : Array(4).fill(null)).map((p, i) =>
              p ? <ProductCard key={p._id} product={p} /> : (
                <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
              )
            )}
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=85"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center text-ivory px-6">
          <h2 className="font-serif text-4xl md:text-6xl tracking-wide leading-tight">
            THE BAG.<br />THE MOMENT.<br />THE MEMORY.
          </h2>
          <Link to="/shop" className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-black mt-10 inline-flex">
            Shop All
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[11px] tracking-luxury uppercase text-gold mb-2">Most Loved</p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-wide">Bestsellers</h2>
            </div>
            <Link to="/shop?isBestseller=true" className="text-xs tracking-luxury uppercase hover:opacity-70 hidden sm:block">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {(featured.bestsellers.length ? featured.bestsellers : Array(4).fill(null)).map((p, i) =>
              p ? <ProductCard key={p._id} product={p} /> : (
                <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
              )
            )}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding bg-espresso text-ivory">
        <div className="container-luxury max-w-3xl text-center">
          <p className="text-[11px] tracking-luxury uppercase text-gold mb-6">Our Philosophy</p>
          <h2 className="font-serif text-3xl md:text-5xl tracking-wide mb-8 leading-tight">
            Crafted for women who carry presence.
          </h2>
          <p className="text-cream/80 font-light leading-relaxed mb-10">
            BagsWaves was founded on a simple belief: a handbag should be more than an accessory. It should be a companion — refined in form, exceptional in craft, and timeless in spirit.
          </p>
          <Link to="/about" className="btn-outline border-ivory text-ivory hover:bg-ivory hover:text-espresso">
            Our Story →
          </Link>
        </div>
      </section>

      {/* Brand Story */}
    </>
  );
}
