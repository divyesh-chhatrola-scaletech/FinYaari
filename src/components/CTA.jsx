import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MessageCircle, Play, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import Button from './ui/Button';

/* magnetic wrapper — the child drifts toward the cursor, then springs back */
function Magnetic({ children, strength = 0.4 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15 });
  const sy = useSpring(y, { stiffness: 250, damping: 15 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      {children}
    </motion.div>
  );
}

/* floating glass chip with parallax depth */
function FloatChip({ mx, my, depth, className, children, delay = 0 }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div
      style={{ x, y }}
      className={`pointer-events-none absolute hidden lg:block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function CTA() {
  const panelRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  const onMove = (e) => {
    if (!panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          ref={panelRef}
          onMouseMove={onMove}
          onMouseLeave={reset}
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[40px] px-8 py-20 text-center md:rounded-[56px] md:px-24 md:py-28"
          style={{ background: 'linear-gradient(150deg, #0E9F6E 0%, #128a41 45%, #075E54 100%)' }}
        >
          {/* mesh glows + noise */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-mint/30 blur-[120px]" />
            <div className="absolute bottom-[-30%] right-[-5%] h-[460px] w-[460px] rounded-full bg-primary/40 blur-[130px]" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '38px 38px' }}
            />
          </div>

          {/* floating message bubbles */}
          <FloatChip mx={smx} my={smy} depth={44} delay={0.1} className="left-[6%] top-[16%]">
            <div className="glass-card flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-float-card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-emerald">
                <TrendingUp size={16} />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold text-dark/45">Today</p>
                <p className="text-[13px] font-bold text-dark">+8.42% ▲</p>
              </div>
            </div>
          </FloatChip>

          <FloatChip mx={smx} my={smy} depth={62} delay={0.25} className="right-[5%] top-[22%]">
            <div className="rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-left shadow-float-card">
              <p className="text-[13px] font-medium text-gray-800">₹10,000 credited 🎉</p>
            </div>
          </FloatChip>

          <FloatChip mx={smx} my={smy} depth={54} delay={0.4} className="bottom-[16%] left-[9%]">
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 shadow-float-card backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white">
                <MessageCircle size={13} className="fill-white" />
              </span>
              <span className="text-[12.5px] font-bold text-dark">Nova is online</span>
            </div>
          </FloatChip>

          {/* content */}
          <div className="relative z-10 mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-2 pr-4 backdrop-blur-md"
            >
              <span className="flex -space-x-1.5">
                {['#fca5a5', '#fcd34d', '#86efac', '#93c5fd'].map((c) => (
                  <span key={c} className="h-5 w-5 rounded-full border-2 border-[#0E9F6E]" style={{ background: c }} />
                ))}
              </span>
              <span className="flex items-center gap-1 text-[13px] font-semibold text-white">
                <Star size={13} className="fill-amber-300 text-amber-300" /> Loved by 10,000+ learners
              </span>
            </motion.div>

            <h2 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-[4.5rem]">
              Your first investment
              <br />
              starts with <span className="italic">hello.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/70">
              Message Nova on WhatsApp and get a virtual portfolio in seconds. No apps, no forms, no risk — just your first confident step.
            </p>

            {/* typing cue */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-mint"
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
              <span className="text-[13px] font-medium text-white/80">Nova is typing…</span>
            </div>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic>
                <Button as="a" href="#" variant="white" size="md" icon={MessageCircle} trailing className="text-[16px]">
                  Start on WhatsApp
                </Button>
              </Magnetic>
              <Button
                as="a"
                href="#"
                variant="ghost"
                size="md"
                icon={Play}
                className="border border-white/25 bg-white/5 text-white hover:bg-white/15"
              >
                Watch Demo
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] font-medium text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-mint" /> Zero real-money risk
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle size={16} className="text-mint" /> No app to install
              </span>
              <span className="flex items-center gap-2">
                <Star size={16} className="text-mint" /> Free to start
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
