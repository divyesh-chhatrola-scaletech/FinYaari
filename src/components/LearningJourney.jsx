import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { BookOpen, Dumbbell, TrendingUp, Wallet, BarChart4, Check } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import { cn } from '../lib/utils';

const STEPS = [
  {
    id: 1,
    title: 'Learn',
    desc: 'Master the basics with bite-sized lessons from Nova — no jargon, ever.',
    icon: BookOpen,
    status: 'Unlocked',
  },
  {
    id: 2,
    title: 'Practice',
    desc: 'Trade real markets with ₹10,000 in virtual money.\nZero risk.\nReal prices.',
    icon: Dumbbell,
    status: 'Unlocked',
  },
  {
    id: 3,
    title: 'Build Confidence',
    desc: 'Track your growth and understand the "why" behind every move you make.',
    icon: TrendingUp,
    status: 'Unlocked',
  },
  {
    id: 4,
    title: 'Invest',
    desc: 'Put real money to work — guided by Nova, one confident step at a time.',
    icon: Wallet,
    status: 'Unlocked',
  },
  {
    id: 5,
    title: 'Trade',
    desc: 'Advanced trading tools and live strategies.\nArriving soon.',
    icon: BarChart4,
    status: 'Coming Soon',
  },
];

// 1200px container width perfectly utilizing outer edges
const DESKTOP_STEPS = [
  { ...STEPS[0], x: 45, y: 12, align: 'left', threshold: 0 },
  { ...STEPS[1], x: 55, y: 31, align: 'right', threshold: 0.25 },
  { ...STEPS[2], x: 45, y: 50, align: 'left', threshold: 0.50 },
  { ...STEPS[3], x: 55, y: 69, align: 'right', threshold: 0.75 },
  { ...STEPS[4], x: 45, y: 88, align: 'left', threshold: 1.00 },
];

const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none hidden md:block">
    {[...Array(20)].map((_, i) => {
      const left = 5 + (i * 17) % 90;
      const top = 5 + (i * 23) % 90;
      return (
        <motion.div
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full bg-emerald/20 blur-[1px]"
          style={{ left: `${left}%`, top: `${top}%` }}
          animate={{
            y: [0, -40, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 6 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut'
          }}
        />
      );
    })}
  </div>
);

const GlassCard = ({ title, desc, icon: Icon, status }) => (
  <div className="flex w-full md:w-[440px] flex-col rounded-[24px] bg-white/80 p-7 md:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.03)] backdrop-blur-xl border border-dark/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgb(0,0,0,0.06)]">
    <div className="flex items-start justify-between w-full mb-4">
      <div className="flex items-center gap-3.5">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", status === 'Unlocked' ? "bg-primary/10 text-primary" : "bg-dark/5 text-dark/40")}>
          <Icon size={20} />
        </div>
        <h3 className={cn("text-[19px] font-bold tracking-tight", status === 'Unlocked' ? "text-dark" : "text-dark/50")}>{title}</h3>
      </div>
      {status === 'Unlocked' ? (
        <span className="flex items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1.5 text-[10px] font-bold text-emerald uppercase tracking-wider shrink-0 mt-1">
          <Check size={12} strokeWidth={3} /> UNLOCKED
        </span>
      ) : (
        <span className="rounded-full bg-dark/5 px-3 py-1.5 text-[10px] font-bold text-dark/40 uppercase tracking-wider shrink-0 mt-1">
          COMING SOON
        </span>
      )}
    </div>
    <p className="text-[15.5px] font-medium leading-[1.65] text-dark/60 max-w-[280px] whitespace-pre-line ml-1">
      {desc}
    </p>
  </div>
);

const MobileNode = ({ step }) => (
  <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10%" }}
    className="relative flex items-start gap-4"
  >
    <motion.div 
      variants={{
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
      }}
      className={cn(
        "relative z-10 flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-[4px] border-white mt-1",
        step.status === 'Unlocked' ? "bg-gradient-to-br from-primary to-emerald shadow-[0_8px_20px_rgba(37,211,102,0.25)] text-white" : "bg-[#f4f4f5] shadow-[0_8px_20px_rgba(0,0,0,0.05)] text-dark/30"
      )}
    >
       <step.icon size={22} />
    </motion.div>
    <div className="pt-0 w-full">
       <GlassCard {...step} />
    </div>
  </motion.div>
);

export default function LearningJourney() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 45%'], 
  });
  
  const lineProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const activePathLength = useTransform(lineProgress, (v) => Math.min(v, 0.75));

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Extremely subtle ambient glow to reduce empty space */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[15%] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[180px]" />
        <div className="absolute left-[30%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-emerald/5 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 lg:px-8">
        <SectionHeading
          className="mb-24 mx-auto max-w-[800px]"
          eyebrow="YOUR JOURNEY"
          title={<>From first lesson to <span className="text-gradient">first investment.</span></>}
          subtitle="No overwhelm. Just one clear path — unlock each milestone as you grow."
        />

        {/* ================= DESKTOP ROADMAP ================= */}
        <div className="relative mx-auto hidden w-full max-w-[1200px] h-[1000px] md:block mb-10">
          
          <FloatingParticles />

          {/* Animated SVG Path (1200x1000) */}
          <svg viewBox="0 0 1200 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full fill-none overflow-visible">
            <defs>
              <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#31D67B" />
                <stop offset="50%" stopColor="#25D366" />
                <stop offset="100%" stopColor="#0E9F6E" />
              </linearGradient>
            </defs>

            {/* Base faded line */}
            <path 
              d="M 540 120 C 540 215, 660 215, 660 310 C 660 405, 540 405, 540 500 C 540 595, 660 595, 660 690" 
              stroke="#f4f4f5" strokeWidth="10" strokeLinecap="round" 
            />
            {/* Dashed coming soon line */}
            <path 
              d="M 660 690 C 660 785, 540 785, 540 880" 
              stroke="#e4e4e7" strokeWidth="6" strokeLinecap="round" strokeDasharray="14 14" 
            />
            
            {/* Active animated green line with glow */}
            <motion.path 
              d="M 540 120 C 540 215, 660 215, 660 310 C 660 405, 540 405, 540 500 C 540 595, 660 595, 660 690 C 660 785, 540 785, 540 880" 
              stroke="url(#pathGradient)" 
              strokeWidth="10" 
              strokeLinecap="round" 
              filter="url(#subtleGlow)"
              style={{ pathLength: activePathLength }} 
            />
          </svg>

          {/* Nodes and Cards */}
          {DESKTOP_STEPS.map((step, i) => {
            const isActive = useTransform(lineProgress, (v) => v >= step.threshold - 0.05);
            
            return (
              <div key={step.id}>
                {/* 90px Floating Node */}
                <motion.div 
                  className={cn(
                    "absolute z-20 flex items-center justify-center rounded-full border-[5px] border-white",
                    step.status === 'Unlocked' ? "text-white" : "text-dark/30"
                  )}
                  style={{
                    left: `${step.x}%`,
                    top: `${step.y}%`,
                    width: '90px',
                    height: '90px',
                    transform: 'translate(-50%, -50%)',
                    background: step.status === 'Unlocked' ? 'linear-gradient(135deg, #25D366, #0E9F6E)' : '#f4f4f5',
                    boxShadow: step.status === 'Unlocked' ? '0 10px 30px rgba(37,211,102,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
                  }}
                  animate={
                    step.status === 'Unlocked'
                      ? { boxShadow: ["0 10px 30px rgba(37,211,102,0.3)", "0 10px 45px rgba(37,211,102,0.6)", "0 10px 30px rgba(37,211,102,0.3)"] }
                      : {}
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                >
                  <step.icon size={34} strokeWidth={2.5} />
                </motion.div>

                {/* Staggered Content Card using exact outer edge positioning */}
                <div
                  className="absolute z-10 hidden md:block w-[440px]"
                  style={{
                    left: step.align === 'left' ? '0' : 'auto',
                    right: step.align === 'right' ? '0' : 'auto',
                    top: `${step.y}%`,
                  }}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: "-50%", scale: 1 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ type: 'spring', stiffness: 60, damping: 20, delay: i * 0.15 + 0.1 }}
                  >
                     <GlassCard {...step} />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MOBILE TIMELINE ================= */}
        <div className="md:hidden flex flex-col gap-10 relative mt-16 w-full px-2">
          {/* Timeline track */}
          <div className="absolute left-[34px] top-8 bottom-8 w-[4px] bg-[#f4f4f5] rounded-full" />
          
          {/* Animated active path */}
          <motion.div 
            className="absolute left-[34px] top-8 bottom-8 w-[4px] bg-gradient-to-b from-primary to-emerald rounded-full origin-top"
            style={{ scaleY: activePathLength }}
          />

          {STEPS.map((step, i) => (
            <MobileNode key={step.id} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
