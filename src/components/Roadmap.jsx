import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

const VB_W = 1000;
const VB_H = 1300;

/* ascending, aspirational sweep — bottom-left up to the upper-right */
const PHASES = [
  { eyebrow: "Today's Goal", title: 'Learn Investing', pos: { x: 150, y: 1160 }, side: 'right' },
  { eyebrow: 'Tomorrow', title: 'Real Investing', pos: { x: 410, y: 850 }, side: 'left' },
  { eyebrow: 'Future', title: 'Trading', pos: { x: 650, y: 540 }, side: 'left' },
  { eyebrow: 'Future', title: 'Financial Freedom', pos: { x: 855, y: 215 }, side: 'left', destination: true },
];

function catmullRom(points, k = 1) {
  const d = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + ((p2.x - p0.x) / 6) * k;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * k;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * k;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * k;
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

function Stars() {
  const reduce = useReducedMotion();
  const stars = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        dur: Math.random() * 3 + 2,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: reduce ? 0.5 : undefined }}
          animate={reduce ? undefined : { opacity: [0.1, 0.9, 0.1] }}
          transition={reduce ? undefined : { duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function Roadmap() {
  const sectionRef = useRef(null);
  const baseRef = useRef(null);
  const [len, setLen] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [trail, setTrail] = useState([]);

  const pathD = useMemo(() => catmullRom(PHASES.map((p) => p.pos)), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 45%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });

  const thresholds = useMemo(() => {
    let cum = 0;
    const dists = [0];
    for (let i = 1; i < PHASES.length; i++) {
      const a = PHASES[i - 1].pos;
      const b = PHASES[i].pos;
      cum += Math.hypot(b.x - a.x, b.y - a.y);
      dists.push(cum);
    }
    return dists.map((d) => d / cum);
  }, []);

  useEffect(() => {
    if (baseRef.current) setLen(baseRef.current.getTotalLength());
  }, [pathD]);

  useMotionValueEvent(progress, 'change', (v) => {
    const c = Math.max(0, Math.min(1, v));
    const count = thresholds.filter((t) => c >= t - 0.04).length;
    setActiveCount((prev) => (prev === count ? prev : count));
    if (baseRef.current && len) {
      const pts = [0, 0.018, 0.038, 0.06].map((off) => {
        const p = baseRef.current.getPointAtLength(Math.max(0, (c - off) * len));
        return { x: p.x, y: p.y };
      });
      setTrail(pts);
    }
  });

  const arrived = activeCount >= PHASES.length;

  return (
    <section
      id="future"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080d18]"
      style={{ minHeight: '150vh' }}
    >
      {/* sunrise glow at the destination (upper-right) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-[10%] -top-[10%] h-[720px] w-[720px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.45), rgba(124,245,179,0.15) 45%, transparent 70%)' }}
          animate={{ opacity: arrived ? 0.95 : 0.55, scale: arrived ? 1.1 : 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="absolute bottom-[-8%] left-[-8%] h-[520px] w-[520px] rounded-full bg-emerald/20 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>
      <Stars />

      {/* intro copy */}
      <div className="relative z-20 px-6 pt-24 md:pt-32">
        <SectionHeading
          theme="dark"
          eyebrow="Where this goes"
          title={<>Every lesson today is a <span className="text-gradient">step toward freedom.</span></>}
          subtitle="You don't just learn to invest. You rise — one confident milestone at a time."
        />
      </div>

      {/* the ascending path */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-[1000px] px-6 pb-32">
        <div className="relative" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="rm-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0E9F6E" />
                <stop offset="55%" stopColor="#25D366" />
                <stop offset="100%" stopColor="#7CF5B3" />
              </linearGradient>
            </defs>

            {/* faint base track */}
            <path ref={baseRef} d={pathD} stroke="rgba(255,255,255,0.10)" strokeWidth={5} strokeLinecap="round" strokeDasharray="1 20" />
            {/* glow underlay */}
            <motion.path d={pathD} stroke="url(#rm-grad)" strokeWidth={16} strokeLinecap="round" style={{ pathLength: progress, filter: 'blur(11px)', opacity: 0.6 }} />
            {/* the luminous line */}
            <motion.path d={pathD} stroke="url(#rm-grad)" strokeWidth={5} strokeLinecap="round" style={{ pathLength: progress }} />
          </svg>

          {/* comet + tail at the drawing tip */}
          {trail.map((pt, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${(pt.x / VB_W) * 100}%`,
                top: `${(pt.y / VB_H) * 100}%`,
                width: 14 - i * 3,
                height: 14 - i * 3,
                background: i === 0 ? '#eafff3' : '#7CF5B3',
                opacity: i === 0 ? 1 : 0.5 - i * 0.12,
                boxShadow: i === 0 ? '0 0 18px 4px rgba(124,245,179,0.9)' : 'none',
                zIndex: 25,
              }}
            />
          ))}

          {/* phase nodes + labels */}
          {PHASES.map((p, i) => {
            const active = i < activeCount;
            const left = `${(p.pos.x / VB_W) * 100}%`;
            const top = `${(p.pos.y / VB_H) * 100}%`;
            return (
              <div key={p.title} className="absolute z-20" style={{ left, top }}>
                {/* node */}
                <motion.div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18 }}
                >
                  {p.destination ? (
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        className="absolute h-24 w-24 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(124,245,179,0.6), transparent 65%)' }}
                        animate={{ scale: active ? [1, 1.25, 1] : 1, opacity: active ? 1 : 0.5 }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <div className="absolute h-16 w-16 animate-spin-slow rounded-full opacity-80 blur-[2px]" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(124,245,179,0.55), transparent, rgba(37,211,102,0.55), transparent)' }} />
                      <motion.div
                        className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70"
                        style={{ background: 'radial-gradient(circle at 32% 28%, #eafff3, #7CF5B3 45%, #25D366)' }}
                        animate={{ scale: active ? 1 : 0.7, boxShadow: active ? '0 0 40px 8px rgba(124,245,179,0.7)' : '0 0 0 0 rgba(0,0,0,0)' }}
                        transition={{ duration: 0.6 }}
                      >
                        <Sparkles size={20} className="text-emerald" />
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      <motion.span
                        className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/40"
                        animate={{ scale: active ? [1, 2, 1] : 1, opacity: active ? [0.6, 0, 0.6] : 0.2 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="relative h-4 w-4 rounded-full border-2 border-white"
                        animate={{
                          backgroundColor: active ? '#7CF5B3' : 'rgba(255,255,255,0.25)',
                          boxShadow: active ? '0 0 20px 5px rgba(124,245,179,0.8)' : '0 0 0 0 rgba(0,0,0,0)',
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </>
                  )}
                </motion.div>

                {/* label */}
                <motion.div
                  className={cn(
                    'absolute top-1/2 w-[min(52vw,300px)] -translate-y-1/2',
                    p.side === 'right' ? 'left-0 ml-9 text-left' : 'right-0 mr-9 text-right'
                  )}
                  initial={{ opacity: 0, x: p.side === 'right' ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p
                    className={cn(
                      'mb-1.5 text-[12px] font-bold uppercase tracking-[0.25em]',
                      p.destination ? 'text-mint' : 'text-white/40'
                    )}
                  >
                    {p.eyebrow}
                  </p>
                  <h3
                    className={cn(
                      'font-bold tracking-tight',
                      p.destination
                        ? 'text-gradient text-3xl md:text-5xl'
                        : active
                        ? 'text-white text-2xl md:text-4xl'
                        : 'text-white/70 text-2xl md:text-4xl'
                    )}
                  >
                    {p.title}
                  </h3>
                  {p.destination && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className={cn('mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-bold text-white shadow-glow transition', p.side === 'left' && 'ml-auto')}
                    >
                      Start the climb
                      <ArrowUpRight size={16} />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* fade into next (light) section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
