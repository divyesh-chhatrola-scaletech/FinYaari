import { useState, useRef, useEffect, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import {
  LineChart,
  Wallet,
  Sparkles,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
  Flame,
  Check,
} from 'lucide-react';
import { cn } from '../lib/utils';
import useCountUp from '../hooks/useCountUp';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  helpers                                                                    */
/* -------------------------------------------------------------------------- */
function MiniSpark({ data, color = '#25D366', w = 120, h = 34 }) {
  if (data.length < 2) return <svg width={w} height={h} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const r = max - min || 1;
  const step = w / (data.length - 1);
  const d = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - ((v - min) / r) * (h - 6) - 3).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Micro-interaction demos (mounted only while an island is active)          */
/* -------------------------------------------------------------------------- */
function PriceDemo({ active }) {
  const [price, setPrice] = useState(2945.6);
  const [dir, setDir] = useState(1);
  const [hist, setHist] = useState([2932, 2938.4, 2941, 2945.6]);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setPrice((prev) => {
        const delta = (Math.random() - 0.45) * 6;
        const np = Math.max(2850, prev + delta);
        setDir(delta >= 0 ? 1 : -1);
        setHist((h) => [...h.slice(-16), np]);
        return +np.toFixed(2);
      });
    }, 550);
    return () => clearInterval(id);
  }, [active]);
  const up = dir >= 0;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-dark">RELIANCE</p>
          <p className="text-[11px] text-dark/40">NSE • Reliance Industries</p>
        </div>
        <div className="text-right">
          <motion.p key={price} initial={{ y: up ? 6 : -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className={cn('text-[15px] font-bold', up ? 'text-primary' : 'text-red-500')}>
            ₹{price.toFixed(2)}
          </motion.p>
          <p className={cn('text-[11px] font-bold', up ? 'text-primary' : 'text-red-500')}>
            {up ? '▲' : '▼'} live
          </p>
        </div>
      </div>
      <div className="mt-2">
        <MiniSpark data={hist} color={up ? '#25D366' : '#ef4444'} w={210} />
      </div>
    </div>
  );
}

function PortfolioDemo({ active }) {
  const val = useCountUp(1000000, active);
  const alloc = [
    { c: '#25D366', w: 55 },
    { c: '#3B82F6', w: 30 },
    { c: '#F59E0B', w: 15 },
  ];
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-dark/40">Practice value</p>
          <p className="text-[22px] font-bold tracking-tight text-dark">₹{val.toLocaleString('en-IN')}</p>
        </div>
        <span className="rounded-full bg-primary/15 px-2 py-1 text-[12px] font-bold text-emerald">Virtual</span>
      </div>
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-dark/5">
        {alloc.map((a, i) => (
          <motion.span
            key={i}
            className="h-full"
            style={{ background: a.c }}
            initial={{ width: 0 }}
            animate={{ width: `${a.w}%` }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    </div>
  );
}

function AIDemo({ active }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    let timers = [];
    const run = () => {
      setStep(0);
      timers.push(setTimeout(() => setStep(1), 650));
      timers.push(setTimeout(() => setStep(2), 1900));
      timers.push(setTimeout(run, 4400));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [active]);
  return (
    <div className="space-y-2">
      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-white">
        Should I buy TCS? 🤔
      </div>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="typing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-md bg-white px-3 py-2.5 shadow-sm">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald/60" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="msg" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-fit max-w-[90%] rounded-2xl rounded-tl-md bg-white px-3 py-1.5 text-[12.5px] text-gray-800 shadow-sm">
            No tips from me 😊 — but let’s learn to read it together 👀
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LearningDemo({ active }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= 5) clearInterval(id);
    }, 220);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.span
            key={i}
            className={cn('h-6 flex-1 rounded-md', i < n ? 'bg-amber-400' : 'bg-dark/8')}
            animate={{ scale: i < n ? [1, 1.18, 1] : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-[13px] font-bold text-dark">
        <Flame size={16} className="text-amber-500" />
        {n}-day streak
        <span className="ml-auto text-[12px] font-semibold text-dark/45">Today: 2 min lesson</span>
      </div>
    </div>
  );
}

function RiskDemo({ active }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
          <circle cx="22" cy="22" r="19" fill="none" stroke="#e2e8f0" strokeWidth="4" />
          <motion.circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="119.4"
            initial={{ strokeDashoffset: 119.4 }}
            animate={{ strokeDashoffset: active ? 0 : 119.4 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <ShieldCheck size={20} className="absolute text-emerald" />
      </div>
      <div>
        <p className="text-[20px] font-bold tracking-tight text-dark">₹0 <span className="text-[13px] font-semibold text-dark/50">at risk</span></p>
        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-emerald">
          <Check size={12} strokeWidth={3} /> Practice mode ON
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature data                                                               */
/* -------------------------------------------------------------------------- */
const FEATURES = [
  {
    id: 'rmp',
    title: 'Real NSE Prices',
    teaser: 'Live NSE data',
    desc: 'Learn on real NSE stocks and indices moving in real time — the exact prices the market runs on.',
    icon: LineChart,
    accent: '#25D366',
    pos: { x: 17, y: 6 },
    depth: 42,
    delay: '0s',
    Demo: PriceDemo,
  },
  {
    id: 'vp',
    title: 'Virtual Money',
    teaser: '₹10L to practise',
    desc: 'A practice portfolio funded with ₹10L in virtual cash. Build positions and learn how it all works.',
    icon: Wallet,
    accent: '#14B8A6',
    pos: { x: 65, y: 4 },
    depth: 58,
    delay: '1.2s',
    Demo: PortfolioDemo,
  },
  {
    id: 'nova',
    title: 'Guided by Nova',
    teaser: 'Your finance friend',
    desc: 'Nova explains every move in plain language and answers anything — a patient guide, never a tip machine.',
    icon: Sparkles,
    accent: '#0E9F6E',
    pos: { x: 42, y: 40 },
    depth: 28,
    delay: '0.6s',
    Demo: AIDemo,
    hub: true,
  },
  {
    id: 'dl',
    title: 'WhatsApp Learning',
    teaser: 'Right in your chat',
    desc: 'Bite-sized 2-minute lessons, right where you already are. Keep your streak alive without the overwhelm.',
    icon: BookOpen,
    accent: '#F59E0B',
    pos: { x: 13, y: 66 },
    depth: 66,
    delay: '1.8s',
    Demo: LearningDemo,
  },
  {
    id: 'rfp',
    title: 'Risk-Free Practice',
    teaser: '₹0 real money',
    desc: 'Everything is practice with virtual money. Make mistakes, learn fast, and risk absolutely nothing.',
    icon: ShieldCheck,
    accent: '#10B981',
    pos: { x: 71, y: 60 },
    depth: 50,
    delay: '0.9s',
    Demo: RiskDemo,
  },
];

/* -------------------------------------------------------------------------- */
/*  Island                                                                     */
/* -------------------------------------------------------------------------- */
function Island({ f, active, isMobile, onEnter, onLeave, onToggle, sx, sy }) {
  const Icon = f.icon;
  const Demo = f.Demo;
  const x = useTransform(sx, (v) => v * f.depth);
  const y = useTransform(sy, (v) => v * f.depth);

  const card = (
    <motion.div
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={`${f.title} — ${f.teaser}. Activate to learn more.`}
      onMouseEnter={isMobile ? undefined : onEnter}
      onMouseLeave={isMobile ? undefined : onLeave}
      onFocus={isMobile ? undefined : onEnter}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      animate={{
        y: active ? -6 : 0,
        scale: active ? 1.02 : 1,
        boxShadow: active
          ? `0 26px 60px -18px ${f.accent}66, 0 0 0 1px ${f.accent}55 inset`
          : '0 16px 40px -20px rgba(10,15,28,0.3), 0 0 0 1px rgba(255,255,255,0.6) inset',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="glass-card w-full cursor-pointer select-none rounded-[26px] p-4 md:w-[252px]"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${f.accent}, #0E9F6E)` }}
        >
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold leading-tight text-dark">{f.title}</h3>
          <p className="text-[12.5px] font-medium text-dark/45">{f.teaser}</p>
        </div>
        <motion.span animate={{ rotate: active ? 45 : 0 }} className="text-dark/25">
          <ArrowUpRight size={18} />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-[13px] font-medium leading-snug text-dark/60">{f.desc}</p>
            <div className="mt-3 rounded-2xl border border-dark/5 bg-white/70 p-3">
              <Demo active={active} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (isMobile) return card;

  return (
    <motion.div
      className="absolute w-[252px] -translate-x-1/2"
      style={{ left: `${f.pos.x}%`, top: `${f.pos.y}%`, x, y, zIndex: active ? 50 : 20 }}
    >
      <div
        className="animate-float"
        style={{ animationDelay: f.delay, animationPlayState: active ? 'paused' : 'running' }}
      >
        {card}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */
export default function FeatureIslands() {
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const u = () => setIsMobile(mq.matches);
    u();
    mq.addEventListener('change', u);
    return () => mq.removeEventListener('change', u);
  }, []);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  const onMove = (e) => {
    if (!containerRef.current || isMobile) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    px.set((e.clientX - left) / width - 0.5);
    py.set((e.clientY - top) / height - 0.5);
  };

  const hub = FEATURES.find((f) => f.hub);
  const connectors = useMemo(() => FEATURES.filter((f) => !f.hub).map((f) => ({ id: f.id, from: hub.pos, to: f.pos })), [hub]);

  return (
    <section id="trust" className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* floating background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-[14%] h-[380px] w-[380px] animate-aurora rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-[4%] top-[30%] h-[420px] w-[420px] animate-aurora rounded-full bg-emerald/15 blur-[150px]" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-[6%] left-[40%] h-[360px] w-[360px] animate-aurora rounded-full bg-mint/20 blur-[150px]" style={{ animationDelay: '9s' }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <SectionHeading
          className="mb-14 md:mb-20"
          eyebrow="Why people trust FinYaari"
          title={<>Five reasons beginners <br className="hidden md:block" /><span className="text-gradient">feel safe here.</span></>}
          subtitle={isMobile ? 'Tap an island to see it in action.' : 'Hover an island to see it come alive.'}
        />

        {/* islands */}
        {isMobile ? (
          <div className="mx-auto flex max-w-md flex-col gap-4">
            {FEATURES.map((f) => (
              <Island
                key={f.id}
                f={f}
                isMobile
                active={activeId === f.id}
                onToggle={() => setActiveId((c) => (c === f.id ? null : f.id))}
                sx={sx}
                sy={sy}
              />
            ))}
          </div>
        ) : (
          <div ref={containerRef} onMouseMove={onMove} className="relative mx-auto h-[720px] w-full max-w-[960px]">
            {/* constellation connectors */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {connectors.map((c) => (
                <line
                  key={c.id}
                  x1={c.from.x}
                  y1={c.from.y + 2}
                  x2={c.to.x}
                  y2={c.to.y + 2}
                  stroke="#25D366"
                  strokeWidth="0.15"
                  strokeDasharray="0.6 1"
                  className={cn('transition-opacity duration-500', activeId ? 'opacity-20' : 'opacity-40')}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {FEATURES.map((f) => (
              <Island
                key={f.id}
                f={f}
                active={activeId === f.id}
                onEnter={() => setActiveId(f.id)}
                onLeave={() => setActiveId(null)}
                onToggle={() => setActiveId((c) => (c === f.id ? null : f.id))}
                sx={sx}
                sy={sy}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
