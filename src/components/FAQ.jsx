import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  Answering the real fears beginners carry                                    */
/* -------------------------------------------------------------------------- */
const FAQS = [
  {
    q: 'Can I lose money?',
    a: 'No. On FinYaari you practise with ₹10L in virtual money — not a single rupee of your own is ever at risk. It’s a safe place to make mistakes and learn from them.',
  },
  {
    q: 'Is this real investing?',
    a: 'You learn on real NSE market prices, so everything you practise reflects how the market actually moves. The money is virtual, but the learning is completely real.',
  },
  {
    q: 'Do I need a Demat account?',
    a: 'Not at all. There’s nothing to open, download, or sign up for. You start right inside WhatsApp — no Demat account, no paperwork, no card.',
  },
  {
    q: 'Does Nova give stock tips?',
    a: 'Never. Nova is a guide, not an advisor. It explains how investing works and helps you understand your own decisions — it won’t tell you what to buy or promise returns.',
  },
  {
    q: 'Who is FinYaari for?',
    a: 'Anyone who wants to start investing but doesn’t know where to begin. If you’ve never bought a stock and fear losing money, FinYaari was built for exactly you.',
  },
];

function Item({ faq, open, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={cn(
        'overflow-hidden rounded-3xl border bg-white/70 backdrop-blur-md transition-colors',
        open ? 'border-primary/30 shadow-premium' : 'border-dark/5 shadow-sm hover:border-primary/20'
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[16px] font-bold text-dark md:text-[17px]">{faq.q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0, backgroundColor: open ? '#25D366' : 'rgba(10,15,28,0.05)' }}
          transition={{ duration: 0.25 }}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            open ? 'text-white' : 'text-dark/50'
          )}
        >
          <Plus size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[15px] font-medium leading-relaxed text-dark/60">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[10%] h-[380px] w-[420px] -translate-x-1/2 animate-aurora rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[780px] px-6">
        <SectionHeading
          className="mb-14"
          eyebrow="Good questions"
          title="You're not the only one asking."
          subtitle="The honest answers to what most first-time investors worry about."
        />

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <Item
              key={faq.q}
              faq={faq}
              index={i}
              open={openIdx === i}
              onToggle={() => setOpenIdx((c) => (c === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
