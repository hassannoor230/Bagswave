import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const handle = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-xl">
        <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-4">Contact</h1>
        <p className="text-center text-taupe mb-12">We would love to hear from you.</p>
        {sent ? (
          <p className="text-center text-gold">Thank you. We will respond shortly.</p>
        ) : (
          <form onSubmit={handle} className="space-y-4">
            <input required placeholder="Name" className="w-full border border-cream px-4 py-3 bg-transparent" />
            <input required type="email" placeholder="Email" className="w-full border border-cream px-4 py-3 bg-transparent" />
            <input placeholder="Subject" className="w-full border border-cream px-4 py-3 bg-transparent" />
            <textarea required rows={5} placeholder="Message" className="w-full border border-cream px-4 py-3 bg-transparent resize-none" />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
