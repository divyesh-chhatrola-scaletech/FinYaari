import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import {
  BookOpen,
  Dumbbell,
  TrendingUp,
  Rocket,
  CandlestickChart,
  Check,
  Lock,
  Sparkles,
} from 'lucide-react';
import { cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  Milestones                                                                 */
/* -------------------------------------------------------------------------- */
const MILESTONES = [
  {
    id: 'learn',
    title: 'Learn',
    desc: 'Master the basics with bite-sized lessons from Nova — no jargon, ever.',
    icon: BookOpen,
  },
  {
    id: 'practice',
    title: 'Practice',
    desc: 'Trade real markets with ₹10,000 in virtual money. Zero risk, real prices.',
    icon: Dumbbell,
  },
  {
    id: 'confidence',
    title: 'Build Confidence',
    desc: 'Track your growth and understand the “why” behind every move you make.',
    icon: TrendingUp,
  },
  {
    id: 'invest',
    title: 'Invest',
    desc: 'Put real money to work — guided by Nova, one confident step at a time.',
    icon: Rocket,
  },
  {
    id: 'trade',
    title: 'Trade',
    desc: 'Advanced trading tools and live strategies. Arriving soon.',
    icon: CandlestickChart,
    comingSoon: true,
  },
];

const VB_W = 1000;
const NODE_Y = [150, 510, 870, 1230, 1590];
const VB_H = 1740;

function buildPath(pts) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const my = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${my}, ${p1.x} ${my}, ${p1.x} ${p1.y}`;
  }
  return d;
}

/* -------------------------------------------------------------------------- */
/*  A single milestone node + label                                            */
/* -------------------------------------------------------------------------- */
function Node({ m, x, y, side, index, active }) {
  const Icon = m.icon;
  const isSoon = m.comingSoon;
  const lit = active && !isSoon;

  const left = `${(x / VB_W) * 100}%`;
  const top = `${(y / VB_H) * 100}%`;

  return (
    <motion.div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
      initial={{ opacity: 0, scale: 0.4, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      {/* halo */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/40 blur-xl"
        animate={{ opacity: lit ? 1 : 0, scale: lit ? 1.3 : 0.6 }}
        transition={{ duration: 0.5 }}
      />

      {/* the round button */}
      <motion.div
        className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full md:h-[88px] md:w-[88px]"
        animate={{
          backgroundColor: lit ? '#25D366' : isSoon ? '#e9edf2' : '#e2e8f0',
          boxShadow: lit
            ? '0 10px 0 0 #128a41, 0 18px 30px -6px rgba(37,211,102,0.5)'
            : '0 8px 0 0 #c3ccd6, 0 10px 18px -8px rgba(10,15,28,0.25)',
          scale: lit ? 1 : 0.94,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ color: lit ? '#ffffff' : isSoon ? '#94a3b8' : '#94a3b8' }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={34} strokeWidth={2.2} />
        </motion.div>

        {/* completed check */}
        <motion.div
          className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald text-white shadow"
          initial={false}
          animate={{ scale: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        >
          <Check size={15} strokeWidth={3} />
        </motion.div>

        {/* coming-soon lock */}
        {isSoon && (
          <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-white shadow">
            <Lock size={13} strokeWidth={3} />
          </div>
        )}
      </motion.div>

      {/* label */}
      <div
        className={cn(
          'absolute top-1/2 w-[min(46vw,260px)] -translate-y-1/2',
          side === 'left' && 'right-full mr-5 text-right',
          side === 'right' && 'left-full ml-5 text-left',
          side === 'bottom' && 'left-1/2 top-full mt-5 w-[min(80vw,300px)] -translate-x-1/2 -translate-y-0 text-center'
        )}
      >
        <div className="mb-1 flex items-center gap-2" style={{ justifyContent: side === 'left' ? 'flex-end' : side === 'bottom' ? 'center' : 'flex-start' }}>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              isSoon
                ? 'bg-amber-100 text-amber-600'
                : lit
                ? 'bg-primary/15 text-emerald'
                : 'bg-dark/5 text-dark/40'
            )}
          >
            {isSoon ? 'Coming Soon' : lit ? 'Unlocked' : `Step ${index + 1}`}
          </span>
        </div>
        <h3
          className={cn(
            'text-xl font-bold tracking-tight transition-colors md:text-2xl',
            lit ? 'text-dark' : 'text-dark/60'
          )}
        >
          {m.title}
        </h3>
        <p className="mt-1.5 text-[14px] font-medium leading-snug text-dark/50">{m.desc}</p>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Journey section                                                            */
/* -------------------------------------------------------------------------- */
export default function Journey() {
  const sectionRef = useRef(null);
  const pathWrapRef = useRef(null);
  const basePathRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pathLen, setPathLen] = useState(0);
  const [activeCount, setActiveCount] = useState(1);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // node coordinates depend on layout
  const nodes = useMemo(() => {
    return MILESTONES.map((m, i) => {
      if (isMobile) {
        return { m, x: 150, y: NODE_Y[i], side: 'right', index: i };
      }
      const isEven = i % 2 === 0;
      const isLast = i === MILESTONES.length - 1;
      const x = isLast ? 500 : isEven ? 320 : 680;
      const side = isLast ? 'bottom' : isEven ? 'left' : 'right';
      return { m, x, y: NODE_Y[i], side, index: i };
    });
  }, [isMobile]);

  const pathD = useMemo(() => buildPath(nodes.map((n) => ({ x: n.x, y: n.y }))), [nodes]);

  // thresholds (equal vertical spacing → even split)
  const thresholds = useMemo(
    () => NODE_Y.map((y) => (y - NODE_Y[0]) / (NODE_Y[NODE_Y.length - 1] - NODE_Y[0])),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.4 });

  // measure path length once it renders / layout changes
  useEffect(() => {
    if (basePathRef.current) {
      const len = basePathRef.current.getTotalLength();
      setPathLen(len);
      const p = basePathRef.current.getPointAtLength(0);
      setMarker({ x: p.x, y: p.y });
    }
  }, [pathD]);

  // drive activeCount + traveling marker from scroll progress
  useMotionValueEvent(progress, 'change', (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    const count = thresholds.filter((t) => clamped >= t - 0.02).length;
    setActiveCount((prev) => (prev === count ? prev : count));
    if (basePathRef.current && pathLen) {
      const pt = basePathRef.current.getPointAtLength(clamped * pathLen);
      setMarker({ x: pt.x, y: pt.y });
    }
  });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[12%] h-[420px] w-[420px] -translate-x-1/2 animate-aurora rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[980px] px-6">
        <SectionHeading
          className="mb-16 md:mb-24"
          eyebrow="Your journey"
          title={<>From first lesson to <span className="text-gradient">first investment.</span></>}
          subtitle="No overwhelm. Just one clear path — unlock each milestone as you grow."
        />

        {/* the path */}
        <div ref={pathWrapRef} className="relative mx-auto" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 h-full w-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* base (locked) track */}
            <path
              ref={basePathRef}
              d={pathD}
              stroke="#dfe5ec"
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray="2 34"
            />
            {/* glow underlay */}
            <motion.path
              d={pathD}
              stroke="#25D366"
              strokeWidth={22}
              strokeLinecap="round"
              style={{ pathLength: progress, filter: 'blur(9px)', opacity: 0.5 }}
            />
            {/* filled progress */}
            <motion.path
              d={pathD}
              stroke="#25D366"
              strokeWidth={16}
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>

          {/* traveling Nova marker at the fill tip */}
          {marker && (
            <div
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(marker.x / VB_W) * 100}%`, top: `${(marker.y / VB_H) * 100}%` }}
            >
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary" />
              <div
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white shadow-glow"
                style={{ background: 'radial-gradient(circle at 32% 28%, #9dfbc4, #25D366 60%, #0b7a53)' }}
              >
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
          )}

          {/* milestone nodes */}
          {nodes.map((n) => (
            <Node key={n.m.id} {...n} active={n.index < activeCount} />
          ))}
        </div>
      </div>
    </section>
  );
}
