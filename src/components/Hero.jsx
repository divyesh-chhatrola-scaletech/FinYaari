import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowRight,
  MessageCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Wallet,
  Check,
  Play,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useWaitlistModal } from '../context/WaitlistModalContext';

/* -------------------------------------------------------------------------- */
/*  Animated sparkline                                                         */
/* -------------------------------------------------------------------------- */
function Sparkline({
  data = [8, 12, 9, 15, 13, 20, 18, 26, 24, 33],
  width = 120,
  height = 40,
  color = '#25D366',
  fill = true,
  strokeWidth = 2.5,
  className,
}) {
  const { line, area } = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const pts = data.map((d, i) => {
      const x = i * stepX;
      const y = height - ((d - min) / range) * (height - strokeWidth * 2) - strokeWidth;
      return [x, y];
    });
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;
    return { line, area };
  }, [data, width, height, strokeWidth]);

  const gid = useMemo(() => `spark-${Math.round(width)}-${color.replace('#', '')}`, [width, color]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} fill="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path
        d={line}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1000"
        className="animate-draw"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Glowing particle field                                                     */
/* -------------------------------------------------------------------------- */
function Particles({ count = 18 }) {
  const reduce = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 5 + 2,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 6,
        drift: Math.random() * 60 - 30,
      })),
    [count]
  );

  if (reduce) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-primary/40 blur-[1px]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 8px rgba(37,211,102,0.7)',
          }}
          animate={{
            y: [0, -140, 0],
            x: [0, p.drift, 0],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Conversation data                                                          */
/* -------------------------------------------------------------------------- */
const GOALS = [
  {
    id: 'wealth',
    label: 'Build Confidence',
    reply: 'Love it! 🌱 Let’s build it step by step — I’ll set you up with ₹10L in virtual money to practise, risk-free.',
  },
  {
    id: 'learn',
    label: 'Learn Investing',
    reply: 'Perfect! 📚 I’ll guide you through the essentials, one bite-sized lesson at a time — no jargon, promise.',
  },
];

/* -------------------------------------------------------------------------- */
/*  WhatsApp conversation mock (self-driving state machine)                    */
/* -------------------------------------------------------------------------- */
function WhatsAppMock() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [answered, setAnswered] = useState(null);

  const timersRef = useRef([]);
  const answeredRef = useRef(false);
  const scrollRef = useRef(null);

  const nid = () => Math.random().toString(36).substr(2, 9);
  const schedule = (ms, fn) => timersRef.current.push(setTimeout(fn, ms));

  const select = useCallback((goalId) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setAnswered(goalId);
    const goal = GOALS.find((g) => g.id === goalId) || GOALS[0];

    schedule(260, () =>
      setMessages((m) => [...m, { id: nid(), from: 'user', kind: 'text', text: goal.label }])
    );
    schedule(950, () => setTyping(true));
    schedule(2100, () => {
      setTyping(false);
      setMessages((m) => [...m, { id: nid(), from: 'nova', kind: 'text', text: goal.reply }]);
    });
    schedule(2850, () =>
      setMessages((m) => [...m, { id: nid(), from: 'nova', kind: 'card' }])
    );
  }, []);

  const resetConvo = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    answeredRef.current = false;
    setMessages([]);
    setTyping(false);
    setAnswered(null);

    schedule(450, () =>
      setMessages((m) => [...m, { id: nid(), from: 'nova', kind: 'text', text: 'Hi 👋' }])
    );
    schedule(1150, () =>
      setMessages((m) => [...m, { id: nid(), from: 'nova', kind: 'text', text: 'Welcome to FinYaari!' }])
    );
    schedule(1750, () => setTyping(true));
    schedule(2650, () => {
      setTyping(false);
      setMessages((m) => [...m, { id: nid(), from: 'nova', kind: 'options' }]);
    });
  }, []);

  useEffect(() => {
    resetConvo();
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [resetConvo]);

  // auto-scroll to newest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typing]);

  const bubble = (m) => {
    if (m.kind === 'text') {
      return (
        <motion.div
          key={m.id}
          layout
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className={cn(
            'max-w-[82%] px-3.5 py-2 text-[14.5px] leading-snug shadow-sm',
            m.from === 'nova'
              ? 'self-start rounded-2xl rounded-tl-md bg-white text-gray-800'
              : 'self-end rounded-2xl rounded-tr-md bg-[#DCF8C6] text-gray-800'
          )}
        >
          {m.text}
        </motion.div>
      );
    }

    if (m.kind === 'options') {
      return (
        <motion.div
          key={m.id}
          layout
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="self-start w-[90%] rounded-2xl rounded-tl-md bg-white px-3.5 py-3 shadow-sm"
        >
          <p className="mb-2.5 text-[14.5px] font-semibold text-[#075E54]">What’s your financial goal?</p>
          <div className="flex flex-col gap-2">
            {GOALS.map((g) => {
              const isChosen = answered === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => select(g.id)}
                  disabled={!!answered}
                  className={cn(
                    'group flex items-center justify-between rounded-xl px-3 py-2 text-[13.5px] font-semibold text-left transition-all',
                    isChosen
                      ? 'bg-[#25D366] text-white shadow-glow'
                      : answered
                        ? 'bg-[#eef4f1] text-[#075E54]/40'
                        : 'bg-[#E7F3EF] text-[#075E54] hover:bg-[#25D366] hover:text-white active:scale-[0.97] cursor-pointer'
                  )}
                >
                  {g.label}
                  {isChosen ? (
                    <Check size={15} className="shrink-0" />
                  ) : (
                    <ArrowRight
                      size={15}
                      className={cn(
                        'shrink-0 transition-transform',
                        !answered && 'group-hover:translate-x-0.5'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      );
    }

    // funded portfolio card
    return (
      <motion.div
        key={m.id}
        layout
        initial={{ opacity: 0, y: 14, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
        className="self-start w-[85%] overflow-hidden rounded-2xl rounded-tl-md bg-gradient-to-br from-[#0E9F6E] to-[#075E54] p-3.5 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
            Virtual Portfolio
          </span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">FUNDED</span>
        </div>
        <p className="mt-1 text-2xl font-bold tracking-tight">₹10,00,000</p>
        <div className="mt-1.5">
          <Sparkline width={210} height={34} color="#7CF5B3" strokeWidth={2} />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-mint">
          <TrendingUp size={13} /> Ready to invest — 0% risk
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#E5DDD5] font-sans relative">
      {/* Header */}
      <div className="z-10 flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-6 text-white shadow-md">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#0E9F6E]">
          <Sparkles size={18} className="text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[15px] font-semibold">Nova</h4>
          </div>
          <p className="text-[11px] text-white/75">online • your finance friend</p>
        </div>
      </div>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="relative flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 py-4"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27%3E%3Cg fill=%27%23075E54%27 fill-opacity=%270.04%27%3E%3Cpath d=%27M30 5l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z%27/%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
        <AnimatePresence>{messages.map((m) => bubble(m))}</AnimatePresence>

        {typing && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="self-start flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-3.5 py-3 shadow-sm"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gray-400"
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Composer (decorative) */}
      <div className="flex items-center gap-2 bg-[#F0F0F0] px-3 py-2.5">
        <div className="flex-1 rounded-full bg-white px-4 py-2 text-[13px] text-gray-400">
          Type a message
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow">
          <MessageCircle size={17} className="fill-white" />
        </div>
      </div>

      {/* Reset button for demo purposes */}
      {answered && !typing && messages.length > 5 && (
        <button onClick={resetConvo} className="absolute bottom-16 right-4 bg-white shadow-lg rounded-full px-4 py-1.5 text-xs font-bold text-dark hover:bg-gray-50 z-50 transition-all">
          Reset Demo
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Parallax layer helper (outer = mouse parallax, inner = idle float)         */
/* -------------------------------------------------------------------------- */
function Parallax({ sx, sy, depth = 30, className, floatClass, children }) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={cn('absolute z-30', className)}>
      <div className={floatClass}>{children}</div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */
export default function Hero() {
  const { openWaitlistModal } = useWaitlistModal();
  const containerRef = useRef(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    px.set((e.clientX - left) / width - 0.5);
    py.set((e.clientY - top) / height - 0.5);
  };
  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  // phone: gentle counter-parallax + 3D tilt
  const phoneX = useTransform(sx, (v) => v * -18);
  const phoneY = useTransform(sy, (v) => v * -18);
  const rotateY = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-4, 4]);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-background pb-12 pt-32"
    >
      {/* ---------- Background layers ---------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[10%] h-[600px] w-[600px] animate-aurora rounded-full bg-primary/15 blur-[140px]" />
        <div
          className="absolute right-[5%] top-[15%] h-[550px] w-[550px] animate-aurora rounded-full bg-emerald/15 blur-[150px]"
          style={{ animationDelay: '4s' }}
        />
      </div>
      <Particles count={15} />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6">
        <div className="grid items-center lg:grid-cols-[1fr_1fr] lg:gap-4 xl:gap-8">
          {/* ================= LEFT CONTENT ================= */}
          <div className="relative z-20 max-w-2xl pt-10 pb-16 lg:py-0">

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl font-bold leading-[1.05] tracking-tight text-dark sm:text-6xl lg:text-[5.5rem]"
            >
              Invest
              <br />
              <span className="relative inline-block">
                <span className="text-gradient">Without Fear.</span>
                <motion.svg
                  viewBox="0 0 300 12"
                  fill="none"
                  className="absolute -bottom-2 left-0 h-2.5 w-full"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 8C60 3 120 3 160 6C210 9 260 5 298 4"
                    stroke="#25D366"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.9, ease: 'easeInOut' }}
                  />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-[520px] text-[19px] leading-relaxed text-dark/65 font-medium text-balance"
            >
              Learn investing through real market practice with virtual money. FinYaari helps first-time investors build confidence—guided by Nova on WhatsApp.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={openWaitlistModal}
                className="group relative flex h-14 items-center gap-3 overflow-hidden rounded-full bg-primary pl-6 pr-5 text-white shadow-glow transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:bg-accent active:translate-y-0"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <MessageCircle size={20} className="fill-white" />
                <span className="text-[16px] font-bold">Start Learning on WhatsApp</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </button>

              <button className="group flex h-14 items-center gap-2.5 rounded-full border border-dark/10 bg-white/70 px-6 font-bold text-dark shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/30 hover:text-emerald active:translate-y-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Play size={15} className="ml-0.5 fill-current" />
                </span>
                <span className="text-[16px]">Watch Demo</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-medium text-dark/55"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" /> Zero real-money risk
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" /> Real-time market prices
              </span>
              <span className="flex items-center gap-2">
                <Wallet size={16} className="text-primary" /> No card needed
              </span>
            </motion.div>
          </div>

          {/* ================= RIGHT PHONE ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="perspective-1600 relative mx-auto flex justify-end w-full lg:-mt-10 lg:-ml-12 h-[640px]"
          >
            {/* halo behind phone */}
            <div className="pointer-events-none absolute right-[50px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />

            {/* ---- Phone ---- */}
            <motion.div
              style={{ x: phoneX, y: phoneY, rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="absolute right-0 top-0 z-20"
            >
              <div className="animate-float-lg">
                <div className="relative h-[640px] w-[310px] rounded-[56px] border-[4px] border-[#1a1f2e] bg-[#0A0F1C] p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                  {/* side buttons */}
                  <div className="absolute -left-[4px] top-[130px] h-10 w-[4px] rounded-l bg-[#2a3140]" />
                  <div className="absolute -left-[4px] top-[180px] h-16 w-[4px] rounded-l bg-[#2a3140]" />
                  <div className="absolute -right-[4px] top-[160px] h-24 w-[4px] rounded-r bg-[#2a3140]" />

                  {/* screen */}
                  <div className="relative h-full w-full overflow-hidden rounded-[46px] bg-white">
                    {/* dynamic island */}
                    <div className="absolute left-1/2 top-2.5 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
                    <WhatsAppMock />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ---- Floating Elements (Strictly 3, strictly outside phone) ---- */}

            {/* 1. Portfolio Card (Top Left) */}
            <Parallax
              sx={sx}
              sy={sy}
              depth={40}
              className="absolute right-[330px] top-[60px]"
              floatClass="animate-float"
            >
              <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-dark/45">
                    Practice
                  </p>
                  <p className="text-lg font-bold text-dark">₹10L</p>
                </div>
              </div>
            </Parallax>

            {/* 2. WhatsApp Bubble (Middle Left) */}
            <Parallax
              sx={sx}
              sy={sy}
              depth={70}
              className="absolute right-[350px] top-[280px]"
              floatClass="animate-float-slow"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] shadow-[0_10px_25px_rgba(37,211,102,0.4)]">
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#25D366]" />
                <MessageCircle size={28} className="relative fill-white text-white" />
              </div>
            </Parallax>

            {/* 3. Diversified Card (Bottom Left) */}
            <Parallax
              sx={sx}
              sy={sy}
              depth={50}
              className="absolute right-[320px] top-[460px]"
              floatClass="animate-float"
            >
              <div className="glass-card flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)]">
                <div className="relative h-9 w-9">
                  <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="#25D366"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="94.2"
                      initial={{ strokeDashoffset: 94.2 }}
                      animate={{ strokeDashoffset: 28 }}
                      transition={{ delay: 1, duration: 1.4, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-dark">
                    70%
                  </span>
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] font-bold text-dark">Diversified</p>
                  <p className="text-[10px] font-medium text-dark/45">Risk balanced</p>
                </div>
              </div>
            </Parallax>

          </motion.div>
        </div>
      </div>

    </section>
  );
}
