import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { MessageCircle, Sparkles, Wallet, LineChart, TrendingUp } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  The five steps, from joining to confidence                                 */
/* -------------------------------------------------------------------------- */
const STEPS = [
  {
    id: 'join',
    icon: MessageCircle,
    title: 'Join FinYaari',
    desc: 'Say hi on WhatsApp. No app to install, no forms to fill.',
  },
  {
    id: 'nova',
    icon: Sparkles,
    title: 'Meet Nova',
    desc: 'Your finance friend introduces the basics — at your pace.',
  },
  {
    id: 'practice',
    icon: Wallet,
    title: 'Practice with ₹10L',
    desc: 'Get ₹10L in virtual money to invest and learn, risk-free.',
  },
  {
    id: 'nse',
    icon: LineChart,
    title: 'Learn from Real NSE Prices',
    desc: 'Follow real market movements — the same data the pros watch.',
  },
  {
    id: 'confidence',
    icon: TrendingUp,
    title: 'Build Confidence',
    desc: 'Understand every move, until investing finally feels simple.',
  },
];

function Step({ step, index, progress, count }) {
  const Icon = step.icon;
  // each node lights up as the drawn line reaches it
  const threshold = index / (count - 1);
  const lit = useTransform(progress, (v) => (v >= threshold - 0.01 ? 1 : 0));
  const dotScale = useTransform(lit, [0, 1], [0.9, 1]);
  const iconFade = useTransform(lit, [0, 1], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-1 flex-col items-center text-center"
    >
      {/* node (kept first so the connecting line aligns at its 40px centre) */}
      <motion.div
        style={{ scale: dotScale }}
        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-premium ring-1 ring-dark/5"
      >
        <motion.span
          style={{ opacity: lit }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-emerald shadow-glow"
        />
        <motion.span style={{ opacity: iconFade }} className="absolute text-dark/30">
          <Icon size={30} />
        </motion.span>
        <motion.span style={{ opacity: lit }} className="absolute text-white">
          <Icon size={30} />
        </motion.span>

        {/* step number badge */}
        <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-dark text-[11px] font-bold text-white">
          {index + 1}
        </span>
      </motion.div>

      <h3 className="mt-6 text-[18px] font-bold tracking-tight text-dark">{step.title}</h3>
      <p className="mx-auto mt-2 max-w-[220px] text-[14px] font-medium leading-snug text-dark/55">
        {step.desc}
      </p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'center 55%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <section id="how-it-works" ref={ref} className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[14%] h-[420px] w-[520px] -translate-x-1/2 animate-aurora rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1160px] px-6">
        <SectionHeading
          className="mb-16 md:mb-24"
          eyebrow="How it works"
          title={<>Five simple steps to <span className="text-gradient">confidence.</span></>}
          subtitle="No overwhelm. Just one clear path — from your first hello to your first confident decision."
        />

        <div className="relative">
          {/* connecting line — desktop horizontal, aligned to the 40px node centre */}
          <div className="pointer-events-none absolute left-0 hidden h-[3px] w-full md:block" style={{ top: '38px' }}>
            <div className="absolute inset-0 mx-[10%] rounded-full bg-dark/5" />
            <motion.div
              className="absolute inset-y-0 left-[10%] origin-left rounded-full bg-gradient-to-r from-primary to-emerald"
              style={{ scaleX: progress, width: '80%' }}
            />
          </div>

          <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-4">
            {STEPS.map((step, i) => (
              <Step key={step.id} step={step} index={i} progress={progress} count={STEPS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
