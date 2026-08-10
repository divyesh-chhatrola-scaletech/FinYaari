import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mic,
  Send,
  ShieldCheck,
  Wallet,
  LineChart,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  Nova avatar — an abstract, premium "AI presence" orb (no robot)           */
/* -------------------------------------------------------------------------- */
function NovaOrb({ speaking, size = 176 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* pulse rings */}
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" />
      <span
        className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald/30"
        style={{ animationDelay: '1.2s' }}
      />

      {/* rotating conic aura */}
      <div
        className="absolute inset-0 animate-spin-slow rounded-full opacity-80 blur-md"
        style={{
          background:
            'conic-gradient(from 0deg, #7CF5B3, #25D366, #0E9F6E, #075E54, #25D366, #7CF5B3)',
        }}
      />

      {/* liquid core */}
      <motion.div
        animate={{ scale: speaking ? [1, 1.06, 0.98, 1.04, 1] : [1, 1.03, 1] }}
        transition={{ duration: speaking ? 1.1 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-[10%] overflow-hidden rounded-full shadow-glow"
        style={{
          background: 'radial-gradient(circle at 32% 28%, #9dfbc4 0%, #25D366 42%, #0b7a53 100%)',
        }}
      >
        {/* inner moving highlights */}
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-10, 15, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/4 top-1/4 h-1/2 w-1/2 rounded-full bg-white/50 blur-2xl"
        />
        <motion.div
          animate={{ x: [15, -15, 15], y: [10, -12, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 h-1/3 w-1/3 rounded-full bg-emerald/70 blur-xl"
        />
        {/* specular */}
        <div className="absolute left-[22%] top-[16%] h-3 w-8 -rotate-45 rounded-full bg-white/70 blur-[2px]" />
        <Sparkles size={size * 0.16} className="absolute inset-0 m-auto text-white/70" />
      </motion.div>

      {/* orbiting particles */}
      <div className="absolute inset-0 animate-spin-slow">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-glow" />
      </div>
      <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '16s' }}>
        <span className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-mint shadow-glow" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Voice waveform                                                             */
/* -------------------------------------------------------------------------- */
function Waveform({ active, bars = 34, className }) {
  const baselines = useMemo(
    () => Array.from({ length: bars }, (_, i) => 5 + Math.abs(Math.sin(i * 0.5)) * 9),
    [bars]
  );
  return (
    <div className={cn('flex items-center justify-center gap-[3px]', className)}>
      {baselines.map((base, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-emerald to-mint"
          style={{ height: base }}
          animate={{
            height: active
              ? [base, base + 14 + (i % 5) * 5, base]
              : [base * 0.5, base * 0.8, base * 0.5],
          }}
          transition={{
            duration: active ? 0.55 + (i % 4) * 0.08 : 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Visual explanation card (the "explain visually" moment)                    */
/* -------------------------------------------------------------------------- */
function DecisionViz() {
  const rows = [
    { label: 'Real market prices', value: 100, color: '#25D366' },
    { label: 'Learning value', value: 92, color: '#0E9F6E' },
    { label: 'Risk to your money', value: 0, color: '#94a3b8', display: '₹0' },
  ];
  return (
    <div className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 p-3.5 backdrop-blur-md">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-dark/45">
        Why practice first?
      </p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between text-[12px] font-semibold text-dark/70">
              <span>{r.label}</span>
              <span style={{ color: r.color }}>{r.display ?? `${r.value}%`}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-dark/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: r.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(r.value, 4)}%` }}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Conversation scripts                                                       */
/* -------------------------------------------------------------------------- */
const SCRIPTS = {
  invest: [
    { from: 'user', text: 'I want to invest.' },
    { from: 'nova', text: 'Great! 🎉' },
    { from: 'nova', text: "Let's practice first." },
    {
      from: 'nova',
      kind: 'chips',
      text: 'Real market. Virtual money. Zero risk.',
      chips: [
        { icon: LineChart, label: 'Real market' },
        { icon: Wallet, label: 'Virtual money' },
        { icon: ShieldCheck, label: 'Zero risk' },
      ],
    },
    { from: 'nova', text: "And I'll explain every decision — visually 👇" },
    { from: 'nova', kind: 'viz' },
  ],
  diversify: [
    { from: 'user', text: 'How do I diversify?' },
    { from: 'nova', text: 'Spread across sectors, not just one stock 📊' },
    { from: 'nova', text: 'If one dips, the others cushion you.' },
  ],
  pe: [
    { from: 'user', text: 'Explain P/E ratio.' },
    { from: 'nova', text: "It's simply Price ÷ Earnings." },
    { from: 'nova', text: 'Lower can mean cheaper — but context is everything.' },
  ],
  nifty: [
    { from: 'user', text: 'Is Nifty a good start?' },
    { from: 'nova', text: 'For beginners? Often yes 👍' },
    { from: 'nova', text: "It bundles 50 of India's biggest companies into one." },
  ],
};

const CHIPS = [
  { key: 'invest', label: 'I want to invest' },
  { key: 'diversify', label: 'How do I diversify?' },
  { key: 'pe', label: 'Explain P/E ratio' },
  { key: 'nifty', label: 'Is Nifty a good start?' },
];

/* -------------------------------------------------------------------------- */
/*  Chat panel (auto-plays + interactive)                                      */
/* -------------------------------------------------------------------------- */
function ChatPanel({ onSpeakingChange }) {
  const [shown, setShown] = useState([]);
  const [typing, setTyping] = useState(false);
  const [activeKey, setActiveKey] = useState('invest');
  const timers = useRef([]);
  const scrollRef = useRef(null);
  const idRef = useRef(0);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = useCallback((key) => {
    clearTimers();
    setActiveKey(key);
    setShown([]);
    setTyping(false);
    const script = SCRIPTS[key];
    let t = 500;
    script.forEach((item) => {
      if (item.from === 'nova') {
        timers.current.push(setTimeout(() => setTyping(true), t));
        t += 850;
        timers.current.push(
          setTimeout(() => {
            setTyping(false);
            setShown((s) => [...s, { ...item, _id: idRef.current++ }]);
          }, t)
        );
        t += item.kind === 'viz' ? 1900 : item.kind === 'chips' ? 1500 : 1150;
      } else {
        timers.current.push(
          setTimeout(() => setShown((s) => [...s, { ...item, _id: idRef.current++ }]), t)
        );
        t += 900;
      }
    });
    // always resolve back to the featured loop
    timers.current.push(setTimeout(() => play('invest'), t + 2400));
  }, []);

  useEffect(() => {
    play('invest');
    return clearTimers;
  }, [play]);

  useEffect(() => {
    onSpeakingChange?.(typing);
  }, [typing, onSpeakingChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [shown, typing]);

  const renderMessage = (m) => {
    const isNova = m.from === 'nova';
    return (
      <motion.div
        key={m._id}
        layout
        initial={{ opacity: 0, y: 14, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className={cn('flex w-full', isNova ? 'justify-start' : 'justify-end')}
      >
        <div
          className={cn(
            'max-w-[85%] px-4 py-2.5 text-[15px] leading-snug shadow-sm',
            isNova
              ? 'rounded-2xl rounded-tl-md border border-white/60 bg-white/80 text-dark backdrop-blur-md'
              : 'rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-emerald font-medium text-white'
          )}
        >
          {m.text && <p>{m.text}</p>}

          {m.kind === 'chips' && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {m.chips.map((c, i) => (
                <motion.span
                  key={c.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12.5px] font-bold text-emerald"
                >
                  <c.icon size={13} />
                  {c.label}
                </motion.span>
              ))}
            </div>
          )}

          {m.kind === 'viz' && <DecisionViz />}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-white/60 bg-white/50 shadow-premium backdrop-blur-2xl">
      {/* gradient ring accent */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/50" />

      {/* header */}
      <div className="flex items-center gap-3 border-b border-white/50 bg-white/40 px-5 py-4">
        <div className="scale-[0.9]">
          <div className="relative h-11 w-11">
            <div
              className="absolute inset-0 animate-spin-slow rounded-full blur-[2px]"
              style={{ background: 'conic-gradient(from 0deg, #7CF5B3, #25D366, #0E9F6E, #7CF5B3)' }}
            />
            <div
              className="absolute inset-[3px] rounded-full"
              style={{ background: 'radial-gradient(circle at 32% 28%, #9dfbc4, #25D366 55%, #0b7a53)' }}
            />
          </div>
        </div>
        <div className="flex-1 leading-tight">
          <div className="flex items-center gap-2">
            <h4 className="text-[15px] font-bold text-dark">Nova</h4>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald">
              Your guide
            </span>
          </div>
          <p className="text-[12px] font-medium text-dark/45">
            {typing ? 'typing…' : 'online • replies instantly'}
          </p>
        </div>
        <Waveform active={typing} bars={14} className="h-6" />
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex h-[360px] flex-col gap-3 overflow-y-auto px-5 py-5">
        <AnimatePresence>{shown.map(renderMessage)}</AnimatePresence>

        {typing && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-emerald/60"
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* suggestion chips */}
      <div className="border-t border-white/50 px-5 pt-4">
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c.key}
              onClick={() => play(c.key)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all active:scale-95',
                activeKey === c.key
                  ? 'border-primary bg-primary text-white shadow-glow'
                  : 'border-dark/10 bg-white/70 text-dark/70 hover:border-primary/40 hover:text-emerald'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* composer */}
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-dark/10 bg-white/70 px-4 py-2.5 text-[14px] text-dark/40">
          Ask Nova anything…
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dark/60 shadow-sm transition hover:text-emerald">
          <Mic size={18} />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald text-white shadow-glow transition hover:scale-105">
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating decorative bubbles                                                */
/* -------------------------------------------------------------------------- */
function FloatingBubble({ text, className, delay = 0 }) {
  return (
    <div className={cn('pointer-events-none absolute hidden lg:block', className)}>
      <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
        <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-[13px] font-medium text-dark/70 shadow-float-card backdrop-blur-md">
          {text}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */
export default function Companion() {
  const [speaking, setSpeaking] = useState(false);
  const onSpeakingChange = useCallback((v) => setSpeaking(v), []);

  return (
    <section
      id="nova"
      className="relative overflow-hidden bg-gradient-to-b from-white via-background to-background py-28 md:py-36"
    >
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[12%] top-[10%] h-[420px] w-[420px] animate-aurora rounded-full bg-primary/15 blur-[140px]" />
        <div
          className="absolute bottom-[6%] right-[8%] h-[460px] w-[460px] animate-aurora rounded-full bg-emerald/15 blur-[150px]"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* floating example bubbles */}
      <FloatingBubble text="How much should I start with?" className="left-[4%] top-[24%]" delay={0} />
      <FloatingBubble text="Is this a good time to buy?" className="right-[5%] top-[16%]" delay={1.4} />
      <FloatingBubble text="What's my portfolio risk?" className="bottom-[16%] left-[6%]" delay={0.8} />
      <FloatingBubble text="Explain this like I'm new." className="bottom-[10%] right-[7%]" delay={2} />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <SectionHeading
          className="mb-16"
          eyebrow="Meet Nova"
          title={<>Your investing guide, <span className="text-gradient">inside WhatsApp.</span></>}
          subtitle="Nova explains investing the way a smart friend would — simple, patient, and encouraging. Never judgmental, never overwhelming."
        />

        {/* showcase */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* left: living avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <NovaOrb speaking={speaking} />
            <h3 className="mt-9 text-2xl font-bold tracking-tight text-dark">Nova</h3>
            <p className="mt-1 text-[14px] font-semibold uppercase tracking-[0.25em] text-emerald">
              Your Investing Guide
            </p>

            {/* voice waveform */}
            <div className="mt-7 flex items-center gap-3 rounded-full border border-white/60 bg-white/60 px-5 py-3 shadow-premium backdrop-blur-md">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                  speaking ? 'bg-primary text-white shadow-glow' : 'bg-primary/10 text-emerald'
                )}
              >
                <Mic size={17} />
              </span>
              <Waveform active={speaking} bars={30} className="h-10 w-40" />
            </div>
            <p className="mt-3 text-[13px] font-medium text-dark/45">
              {speaking ? 'Nova is responding…' : 'Voice & chat, right inside WhatsApp'}
            </p>

            <button className="group mt-8 flex h-13 items-center gap-2.5 rounded-full bg-dark py-3.5 pl-6 pr-5 font-bold text-white transition-all hover:-translate-y-1 hover:bg-emerald">
              <span>Start chatting with Nova</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
                <ArrowRight size={15} />
              </span>
            </button>
          </motion.div>

          {/* right: conversation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatPanel onSpeakingChange={onSpeakingChange} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
