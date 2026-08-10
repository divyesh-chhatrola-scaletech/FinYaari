import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, PieChart, TrendingUp, Mic, Send, Wallet, Shield, MessageCircle, Brain, BookOpen, Target, Flame, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

const BLOCKERS = [
  {
    id: 'start',
    emoji: '😟',
    label: "I don't know where to start.",
  },
  {
    id: 'lose',
    emoji: '😰',
    label: "I'm afraid of losing money.",
  },
  {
    id: 'complex',
    emoji: '🤔',
    label: 'Investing feels too complicated.',
  },
];

const PLACEHOLDERS = [
  "Ask Nova anything...",
  "What is SIP?",
  "How do IPOs work?",
  "Should I start with ETFs?",
  "What is diversification?"
];

function useAnimatedPlaceholder() {
  const [text, setText] = useState("");
  
  useEffect(() => {
    let timer;
    let i = 0;
    let isDeleting = false;
    let charIndex = 0;

    const tick = () => {
      const currentWord = PLACEHOLDERS[i % PLACEHOLDERS.length];
      
      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setText(currentWord.substring(0, charIndex));
        timer = setTimeout(tick, 50);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setText(currentWord.substring(0, charIndex));
        timer = setTimeout(tick, 30);
      } else if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        timer = setTimeout(tick, 2500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        i++;
        timer = setTimeout(tick, 500);
      }
    };
    
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return text;
}

/* -------------------------------------------------------------------------- */
/*  Rich in-chat cards (Expanded for Workspace)                               */
/* -------------------------------------------------------------------------- */
function PortfolioBubble() {
  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0E9F6E] to-[#075E54] p-6 text-white shadow-xl shadow-emerald-900/10 border border-emerald-400/20">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
          Practice Portfolio
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-wide backdrop-blur-md">VIRTUAL</span>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-3 text-[40px] font-extrabold tracking-tight"
      >
        ₹10,00,000
      </motion.p>
      <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-white/15">
        {[
          { c: '#7CF5B3', w: 55 },
          { c: '#bbf7d0', w: 30 },
          { c: '#ffffff', w: 15 },
        ].map((a, i) => (
          <motion.span
            key={i}
            className="h-full"
            style={{ background: a.c, opacity: 0.9 }}
            initial={{ width: 0 }}
            animate={{ width: `${a.w}%` }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 text-[13px] font-medium text-emerald-100">
        <ShieldCheck size={16} /> Funded &amp; ready — 0% risk
      </div>
    </div>
  );
}

function MarketMovementBubble() {
  return (
    <div className="w-full max-w-[420px] rounded-[24px] bg-white border border-dark/10 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-[16px] font-bold text-dark">Reliance Ind.</p>
          <p className="text-[14px] font-semibold text-emerald-600">+2.1% Today</p>
        </div>
      </div>
    </div>
  );
}

function LessonBubble() {
  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-[24px] bg-indigo-50/50 border border-indigo-100/60 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <PieChart size={24} />
        </div>
        <div>
          <p className="text-[16px] font-bold text-indigo-950 mb-1">What is a Stock?</p>
          <p className="text-[14px] font-medium text-indigo-800/80 leading-relaxed">
            A stock is simply a tiny piece of ownership in a real company.
          </p>
        </div>
      </div>
    </div>
  );
}

function CelebrateBubble({ animate }) {
  const dots = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    angle: (i / 12) * Math.PI * 2,
    color: ['#25D366', '#7CF5B3', '#0E9F6E', '#FFD166'][i % 4],
    dist: 55 + (i % 3) * 12,
  }));
  return (
    <div className="relative flex w-full justify-start py-2">
      {animate &&
        dots.map((d) => (
          <motion.span
            key={d.id}
            className="absolute left-[120px] top-1/2 h-2 w-2 rounded-full"
            style={{ background: d.color }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos(d.angle) * d.dist,
              y: Math.sin(d.angle) * d.dist,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.4],
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        ))}
      <div className="relative flex items-center gap-3 rounded-[20px] border border-amber-200/60 bg-amber-50/90 backdrop-blur-md px-5 py-3 text-center shadow-sm">
        <span className="text-[20px]">✨</span>
        <span className="text-[14px] font-bold leading-snug text-amber-900">
          First investing milestone
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  One chat message                                                           */
/* -------------------------------------------------------------------------- */
function Message({ m }) {
  const isNova = m.from === 'nova';

  if (m.kind === 'celebrate') {
    return (
      <motion.div layout initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }} className="my-2 w-full flex pl-12">
        <CelebrateBubble animate={m.animate} />
      </motion.div>
    );
  }

  const inner =
    m.kind === 'portfolio' ? (
      <PortfolioBubble />
    ) : m.kind === 'market' ? (
      <MarketMovementBubble />
    ) : m.kind === 'lesson' ? (
      <LessonBubble />
    ) : m.kind === 'cta' ? (
      <a
        href="#"
        className="group flex w-fit items-center gap-2.5 rounded-full bg-dark px-6 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-dark/10 transition-transform hover:scale-[1.02]"
      >
        <Sparkles size={18} className="text-emerald-400" />
        Start Learning
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </a>
    ) : (
      <div
        className={cn(
          'max-w-[85%] px-5 py-3.5 text-[15px] sm:text-[16px] leading-relaxed shadow-sm',
          isNova
            ? 'rounded-[24px] rounded-tl-sm bg-white border border-dark/5 text-gray-800'
            : 'rounded-[24px] rounded-tr-sm bg-dark/5 text-dark font-medium'
        )}
      >
        {m.text}
      </div>
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn('flex w-full mb-4 items-end gap-3', isNova ? 'justify-start' : 'justify-end')}
    >
      {isNova && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#0E9F6E] shadow-sm mb-1">
          <Sparkles size={14} className="text-white" />
        </div>
      )}
      {inner}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Nova's Orbit (Floating Constellation Orbs)                                */
/* -------------------------------------------------------------------------- */
const ORBIT_DATA = {
  trending: { id: 'trending', icon: TrendingUp, label: "Real Market Prices", pos: "top-12 -left-12 lg:-left-20", color: "text-emerald-500", glowColor: "bg-emerald-500" },
  wallet: { id: 'wallet', icon: Wallet, label: "₹10L Practice Portfolio", pos: "top-48 -left-6 lg:-left-12", color: "text-amber-500", glowColor: "bg-amber-500" },
  shield: { id: 'shield', icon: Shield, label: "Zero Financial Risk", pos: "top-24 -right-12 lg:-right-24", color: "text-blue-500", glowColor: "bg-blue-500" },
  chat: { id: 'chat', icon: MessageCircle, label: "Simple Conversations", pos: "top-[280px] -left-16 lg:-left-28", color: "text-indigo-500", glowColor: "bg-indigo-500" },
  brain: { id: 'brain', icon: Brain, label: "Learn by Doing", pos: "top-64 -right-8 lg:-right-20", color: "text-purple-500", glowColor: "bg-purple-500" },
  book: { id: 'book', icon: BookOpen, label: "Investment Learning", pos: "bottom-48 -left-12 lg:-left-24", color: "text-rose-500", glowColor: "bg-rose-500" },
  target: { id: 'target', icon: Target, label: "Build Confidence", pos: "bottom-24 -right-12 lg:-right-20", color: "text-orange-500", glowColor: "bg-orange-500" },
  sparkles: { id: 'sparkles', icon: Sparkles, label: "Learning Milestones", pos: "top-[400px] -right-16 lg:-right-28", color: "text-yellow-500", glowColor: "bg-yellow-500" },
  flame: { id: 'flame', icon: Flame, label: "Learning Streak", pos: "bottom-32 -left-4 lg:-left-12", color: "text-red-500", glowColor: "bg-red-500" },
  leaf: { id: 'leaf', icon: Leaf, label: "Financial Growth", pos: "-top-6 right-24", color: "text-green-500", glowColor: "bg-green-500" },
};

function FloatingOrb({ data, delay, isGlowing }) {
  const Icon = data.icon;
  // Position tooltip on left if orb is on right side, else on right
  const isRightSide = data.pos.includes('right');
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
      className={cn("absolute z-20 group", data.pos)}
    >
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 3, -2, 0]
        }}
        transition={{ duration: 4 + (delay % 2), repeat: Infinity, ease: "easeInOut", delay }}
        className={cn(
          "relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all hover:scale-110",
          isGlowing && "shadow-[0_0_40px_rgba(16,185,129,0.3)] border-white"
        )}
      >
        <Icon size={22} strokeWidth={2.5} className={cn("transition-colors", isGlowing ? data.color : "text-dark/40 group-hover:text-dark/80")} />
        
        {/* Glow effect */}
        <AnimatePresence>
          {isGlowing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn("absolute inset-0 rounded-full blur-xl -z-10 opacity-40", data.glowColor)}
            />
          )}
        </AnimatePresence>

        {/* Minimal Tooltip */}
        <div className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          isRightSide ? "right-full mr-4" : "left-full ml-4"
        )}>
          <div className="whitespace-nowrap rounded-[16px] border border-white/80 bg-white/90 px-4 py-2.5 text-[14px] font-bold text-dark shadow-xl backdrop-blur-xl">
            {data.label}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Section                                                               */
/* -------------------------------------------------------------------------- */
export default function LivingConversation() {
  const scrollRef = useRef(null);
  
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const placeholderText = useAnimatedPlaceholder();

  // Orbit State
  const [activeOrbs, setActiveOrbs] = useState(['leaf', 'chat', 'brain']);
  const [glowingOrbs, setGlowingOrbs] = useState([]);

  const timers = useRef([]);
  const uid = useRef(0);
  const sequenceId = useRef(0);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const delayTime = (ms, seq) =>
    new Promise((res, rej) => {
      const id = setTimeout(() => {
        if (seq === sequenceId.current) res();
        else rej(new Error('Sequence cancelled'));
      }, ms);
      timers.current.push(id);
    });

  const push = (item) => setMessages((m) => [...m, { id: uid.current++, ...item }]);

  const say = useCallback(async (content, ms = 900, seq) => {
    try {
      setTyping(true);
      await delayTime(ms, seq);
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: uid.current++, from: 'nova', ...(typeof content === 'string' ? { text: content } : content) },
      ]);
      await delayTime(300, seq);
    } catch (e) {
      // Swallowed on purpose when cancelled
    }
  }, []);

  const revealOrb = (id) => setActiveOrbs(prev => prev.includes(id) ? prev : [...prev, id]);
  
  const glowOrb = useCallback((id, ms = 2500) => {
    setGlowingOrbs(prev => [...prev, id]);
    setTimeout(() => {
      setGlowingOrbs(prev => prev.filter(x => x !== id));
    }, ms);
  }, []);

  // When default state
  useEffect(() => {
    if (selectedId) return;
    setMessages([
      { id: uid.current++, from: 'nova', text: "👋 Hi! I'm Nova." },
      { id: uid.current++, from: 'nova', text: "Choose what feels most like you on the left." }
    ]);
    setActiveOrbs(['leaf', 'chat', 'brain']);
  }, [selectedId]);

  const handleBlockerSelect = (b) => {
    if (selectedId === b.id) return;
    
    setSelectedId(b.id);
    clearTimers();
    setMessages([]);
    setTyping(false);
    
    sequenceId.current++;
    const seq = sequenceId.current;
    
    const runSequence = async () => {
      try {
        push({ from: 'user', text: b.label });
        await delayTime(600, seq);

        if (b.id === 'start') {
          revealOrb('target');
          glowOrb('target');
          await say("That's completely okay.", 1000, seq);
          await say("Everyone starts somewhere.", 1000, seq);
          await delayTime(400, seq);
          
          revealOrb('wallet');
          glowOrb('wallet');
          await say({ kind: 'portfolio' }, 400, seq);
          await delayTime(800, seq);
          
          revealOrb('trending');
          glowOrb('trending');
          await say("Here is your first lesson on how markets move.", 1200, seq);
          
          revealOrb('sparkles');
          glowOrb('sparkles');
          await say({ kind: 'celebrate', animate: true }, 500, seq);
          await delayTime(600, seq);
          await say("Let's take the first step together.", 1200, seq);
        } 
        else if (b.id === 'lose') {
          revealOrb('shield');
          glowOrb('shield');
          await say("That's why you practice first.", 1000, seq);
          await say("No real money.", 800, seq);
          await delayTime(400, seq);
          
          revealOrb('wallet');
          glowOrb('wallet');
          await say({ kind: 'portfolio' }, 400, seq);
          await delayTime(800, seq);
          
          revealOrb('trending');
          glowOrb('trending');
          await say({ kind: 'market' }, 500, seq);
          await delayTime(800, seq);
          
          await say("Prices change when people buy or sell.", 1200, seq);
          
          revealOrb('shield');
          glowOrb('shield');
          await say("That's why we'll practice before you invest.", 1200, seq);
        }
        else if (b.id === 'complex') {
          revealOrb('brain');
          glowOrb('brain');
          await say("Let's simplify it.", 1000, seq);
          await delayTime(400, seq);
          
          revealOrb('book');
          glowOrb('book');
          await say({ kind: 'lesson' }, 500, seq);
          await delayTime(1200, seq);
          
          revealOrb('chat');
          glowOrb('chat');
          await say("I'll explain everything in simple language.", 1200, seq);
        }

        await say({ kind: 'cta' }, 500, seq);

      } catch (e) {
        // Cancelled
      }
    };

    runSequence();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, typing]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <section id="living-conversation" className="relative w-full min-h-screen bg-[#F8F9FA] py-24 flex items-center overflow-hidden">
      
      {/* Background aesthetics - Constellation Mode */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[5%] h-[800px] w-[800px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] h-[900px] w-[900px] rounded-full bg-blue-500/5 blur-[140px]" />
        
        {/* Subtle Constellation Stars */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-dark/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center max-w-[1280px] mx-auto">
          
          {/* LEFT PANEL: 40% (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[36px] sm:text-[46px] font-extrabold tracking-tight text-dark leading-[1.1] mb-4">
                What's stopping you from investing?
              </h2>
              <p className="text-[18px] sm:text-[20px] text-dark/60 font-medium mb-12">
                Choose what feels most like you.
              </p>

              <div className="flex flex-col gap-5">
                {BLOCKERS.map((b) => {
                  const isActive = selectedId === b.id;

                  return (
                    <button
                      key={b.id}
                      onClick={() => handleBlockerSelect(b)}
                      className={cn(
                        "group relative flex w-full items-center gap-5 sm:gap-6 rounded-[24px] border p-5 transition-all text-left",
                        isActive 
                          ? "bg-white border-[#25D366] shadow-[0_12px_40px_rgb(37,211,102,0.15)] scale-[1.02] z-10" 
                          : "bg-white/50 border-dark/5 hover:bg-white hover:shadow-md hover:border-dark/10"
                      )}
                    >
                      <div className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] transition-colors text-[28px]",
                        isActive ? "bg-transparent" : "bg-[#F1F3F5] group-hover:bg-[#E5E7EB]"
                      )}>
                        {b.emoji}
                      </div>
                      <span className={cn(
                        "flex-1 text-[17px] sm:text-[19px] font-bold transition-colors",
                        isActive ? "text-dark" : "text-dark/80 group-hover:text-dark"
                      )}>
                        {b.label}
                      </span>
                      
                      {/* Only show the arrow if NOT active, per the design */}
                      {!isActive && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full text-dark/30 group-hover:translate-x-0.5 transition-transform">
                          <ArrowRight size={20} strokeWidth={2.5} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT PANEL: 60% (lg:col-span-7) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            
            <div className="relative w-full max-w-[620px]">
              
              {/* Nova's Orbit - Constellation Icons (Desktop Only) */}
              <div className="hidden xl:block absolute inset-0 pointer-events-none z-20">
                <AnimatePresence>
                  {activeOrbs.map((orbId, i) => {
                    const orb = ORBIT_DATA[orbId];
                    if (!orb) return null;
                    return (
                      <div key={orb.id} className="pointer-events-auto">
                        <FloatingOrb
                          data={orb}
                          delay={i * 0.15}
                          isGlowing={glowingOrbs.includes(orb.id)}
                        />
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* FinYaari Conversational Workspace Panel */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                className="relative flex flex-col w-full h-[720px] rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] overflow-hidden"
              >
              {/* Top Header */}
              <div className="flex items-center gap-4 border-b border-dark/5 bg-white/40 px-6 py-5 shrink-0">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#25D366] to-[#0E9F6E] shadow-sm">
                  <Sparkles size={22} className="text-white" />
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-dark leading-tight">Nova</h3>
                  <p className="text-[14px] font-medium text-dark/50">FinYaari Assistant</p>
                </div>
              </div>

              {/* Chat Area */}
              <div
                ref={scrollRef}
                className="relative flex flex-1 flex-col overflow-y-auto px-6 py-8 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                <AnimatePresence>
                  {messages.map((m) => (
                    <Message key={m.id} m={m} />
                  ))}
                </AnimatePresence>

                {typing && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex w-fit items-center gap-3 self-start rounded-[24px] rounded-tl-sm bg-white border border-dark/5 px-5 py-4 shadow-sm mb-2 ml-11"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-dark/20"
                          animate={{ y: [0, -4, 0], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Custom Input Bar */}
              <div className="shrink-0 p-6 pt-2 bg-gradient-to-t from-white/90 via-white/80 to-transparent">
                <div className="relative flex items-center bg-white border border-dark/10 rounded-full p-2 pr-2.5 shadow-sm focus-within:border-emerald-500/50 focus-within:shadow-md transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-dark/40 hover:text-dark transition-colors cursor-pointer">
                    <Mic size={20} />
                  </div>
                  <div className="flex-1 px-2 text-[15px] font-medium text-dark/40 overflow-hidden whitespace-nowrap">
                    {placeholderText}
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-[2px] h-[18px] bg-dark/40 ml-0.5 align-middle"
                    />
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark text-white cursor-pointer hover:scale-105 transition-transform">
                    <Send size={16} className="-ml-0.5" />
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
          </div>

        </div>
      </div>
    </section>
  );
}
