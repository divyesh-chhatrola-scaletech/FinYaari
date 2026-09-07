import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { useWaitlistModal } from '../context/WaitlistModalContext';

/* -------------------------------------------------------------------------- */
/*  A single fear — fades in, holds, then drifts away + blurs out             */
/* -------------------------------------------------------------------------- */
function Fear({ progress, text, center }) {
  const w = 0.1; // half-window
  const opacity = useTransform(
    progress,
    [center - w, center - w * 0.45, center + w * 0.45, center + w],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [center - w, center, center + w], [70, 0, -70]);
  const blur = useTransform(
    progress,
    [center - w, center - w * 0.45, center + w * 0.45, center + w],
    [12, 0, 0, 12]
  );
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.p
      style={{ opacity, y, filter }}
      className="absolute px-6 text-center text-3xl font-semibold leading-tight tracking-tight text-white/90 sm:text-5xl md:text-6xl"
    >
      <span className="text-white/30">“</span>
      {text}
      <span className="text-white/30">”</span>
    </motion.p>
  );
}

const FEARS = [
  { text: "I'm afraid I'll lose money.", center: 0.19 },
  { text: "I don't know where to start.", center: 0.35 },
  { text: 'There are too many apps.', center: 0.51 },
  { text: "I don't understand stocks.", center: 0.67 },
];

export default function Story() {
  const { openWaitlistModal } = useWaitlistModal();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  // grey → green cinematic backdrop
  const bg = useTransform(
    progress,
    [0, 0.35, 0.72, 1],
    ['#14151a', '#141f1b', '#0b3a2c', '#064e42']
  );

  // green glow that swells as Nova arrives
  const glowOpacity = useTransform(progress, [0.4, 0.8, 1], [0, 0.5, 0.95]);
  const glowScale = useTransform(progress, [0.4, 1], [0.5, 1.25]);

  // headline recedes when Nova takes over
  const headlineOpacity = useTransform(progress, [0, 0.06, 0.78, 0.9], [0.35, 1, 1, 0.25]);
  const headlineBlur = useTransform(progress, [0.78, 0.9], [0, 6]);
  const headlineFilter = useTransform(headlineBlur, (b) => `blur(${b}px)`);

  // Nova reveal
  const novaOpacity = useTransform(progress, [0.78, 0.9], [0, 1]);
  const novaScale = useTransform(progress, [0.78, 0.96], [0.72, 1]);
  const novaY = useTransform(progress, [0.78, 0.96], [50, 0]);

  return (
    <section id="why" ref={ref} className="relative h-[540vh]">
      <motion.div
        style={{ backgroundColor: bg }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        {/* --- swelling green glow --- */}
        <motion.div
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-[160px]"
        />

        {/* --- drifting texture blobs --- */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
          <div className="absolute left-[8%] top-[18%] h-72 w-72 animate-aurora rounded-full bg-emerald/20 blur-[120px]" />
          <div
            className="absolute bottom-[12%] right-[10%] h-80 w-80 animate-aurora rounded-full bg-mint/10 blur-[130px]"
            style={{ animationDelay: '6s' }}
          />
        </div>

        {/* --- faint dot grid --- */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />

        {/* --- headline --- */}
        <motion.h2
          style={{ opacity: headlineOpacity, filter: headlineFilter }}
          className="absolute left-1/2 top-[14%] w-full max-w-4xl -translate-x-1/2 px-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Why do millions never start investing?
        </motion.h2>

        {/* --- the fears --- */}
        <div className="relative flex h-full w-full items-center justify-center">
          {FEARS.map((f) => (
            <Fear key={f.text} progress={progress} {...f} />
          ))}
        </div>

        {/* --- Nova arrives --- */}
        <motion.div
          style={{ opacity: novaOpacity, scale: novaScale, y: novaY }}
          className="absolute flex flex-col items-center px-6 text-center"
        >
          <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-mint via-primary to-emerald shadow-glow">
            <span className="absolute inset-0 animate-pulse-ring rounded-3xl bg-primary" />
            <Sparkles size={38} className="relative text-white" />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-mint">Nova</p>
          <h3 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            Let’s learn together.
          </h3>
          <p className="mt-6 max-w-md text-lg font-medium text-white/60">
            No fear. No jargon. Just you and Nova, your finance friend — one message at a time.
          </p>

          <button
            type="button"
            onClick={openWaitlistModal}
            className="group mt-10 flex h-14 items-center gap-3 rounded-full bg-white pl-6 pr-5 font-bold text-dark shadow-glow transition-all hover:-translate-y-1"
          >
            <MessageCircle size={20} className="fill-primary text-primary" />
            <span className="text-[16px]">Start Learning on WhatsApp</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
              <ArrowRight size={16} />
            </span>
          </button>
        </motion.div>

        {/* --- cinematic vignette --- */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 220px 60px rgba(0,0,0,0.55)' }}
        />

        {/* --- scroll progress rail --- */}
        <div className="absolute right-6 top-1/2 hidden h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10 md:block">
          <motion.div
            className="w-full origin-top rounded-full bg-primary"
            style={{ height: '100%', scaleY: progress }}
          />
        </div>

        {/* --- scroll hint (fades after start) --- */}
        <motion.div
          style={{ opacity: useTransform(progress, [0, 0.06], [1, 0]) }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-[2px] rounded-full bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
