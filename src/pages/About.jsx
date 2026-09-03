export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl">
        <p className="text-[11px] tracking-luxury uppercase text-gold mb-4 text-center">Our Story</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-center mb-12">BagsWaves</h1>
        <div className="space-y-8 text-taupe leading-relaxed font-light">
          <p>
            BagsWaves was born from a desire to create handbags that feel as considered as the women who carry them. We believe luxury is not loud — it is quiet confidence, refined proportion, and materials chosen with care.
          </p>
          <p>
            Every piece begins with Italian and European leathers, selected for their character and longevity. Our ateliers work with traditional techniques refined for modern life: structured forms that hold their shape, soft constructions that move with you, and hardware finished to a muted gold that ages with grace.
          </p>
          <p>
            We design for the woman who appreciates the art of carrying — who understands that a bag is both practical companion and personal statement. Timeless. Iconic. Yours.
          </p>
        </div>
        <div className="mt-16 aspect-[16/9] bg-cream overflow-hidden">
          <img src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=85" alt="Craftsmanship" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
