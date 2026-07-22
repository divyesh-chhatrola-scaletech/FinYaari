import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  PiggyBank,
  Car,
  Plane,
  Briefcase,
  Target,
  Clock,
  Gauge,
  Wallet,
  Lightbulb,
  BadgeCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  Asset palette (consistent across goals for honest comparison)             */
/* -------------------------------------------------------------------------- */
const ASSET = {
  Equity: '#25D366',
  Debt: '#3B82F6',
  Gold: '#F59E0B',
  Liquid: '#14B8A6',
};

/* -------------------------------------------------------------------------- */
/*  Goal data                                                                  */
/* -------------------------------------------------------------------------- */
const GOALS = [
  {
    id: 'emergency',
    label: 'Emergency Fund',
    icon: ShieldCheck,
    accent: '#0E9F6E',
    emoji: '🛡️',
    horizon: '3–6 months',
    target: '₹1.5L',
    monthly: '₹12,500',
    risk: 'Very Low',
    allocation: [
      { asset: 'Liquid', pct: 50 },
      { asset: 'Debt', pct: 35 },
      { asset: 'Gold', pct: 15 },
    ],
    convo: [
      'Smart first move! 🛡️',
      'An emergency fund is your safety net.',
      "We'll keep it safe & liquid — reach it anytime.",
    ],
    tips: [
      'Aim for 3–6 months of expenses',
      'Keep it liquid — access beats returns here',
      "Don't invest it in volatile assets",
    ],
    recs: [
      { name: 'Liquid Mutual Funds', detail: 'Instant access, stable' },
      { name: 'High-yield Savings', detail: 'For quick withdrawals' },
      { name: 'Short-term Debt Funds', detail: 'A little extra yield' },
    ],
  },
  {
    id: 'retirement',
    label: 'Retirement',
    icon: PiggyBank,
    accent: '#7C3AED',
    emoji: '🌱',
    horizon: '25+ years',
    target: '₹5 Cr',
    monthly: '₹15,000',
    risk: 'Moderate–High',
    allocation: [
      { asset: 'Equity', pct: 70 },
      { asset: 'Debt', pct: 20 },
      { asset: 'Gold', pct: 10 },
    ],
    convo: [
      'Thinking long-term? Love it. 🌱',
      'Time is your superpower here.',
      'More equity now — decades to compound.',
    ],
    tips: [
      'Start early — compounding rewards time',
      'Higher equity is fine for long horizons',
      'Step up your SIP as income grows',
    ],
    recs: [
      { name: 'Index Funds', detail: 'Low-cost market returns' },
      { name: 'NPS', detail: 'Tax-efficient retirement' },
      { name: 'Equity Mutual Funds', detail: 'Long-term growth' },
    ],
  },
  {
    id: 'car',
    label: 'Car',
    icon: Car,
    accent: '#0284C7',
    emoji: '🚗',
    horizon: '2–3 years',
    target: '₹8L',
    monthly: '₹22,000',
    risk: 'Low',
    allocation: [
      { asset: 'Debt', pct: 60 },
      { asset: 'Equity', pct: 25 },
      { asset: 'Liquid', pct: 15 },
    ],
    convo: [
      'New wheels? 🚗',
      'Short goal — so we play it safer.',
      'Mostly debt, a little equity for a boost.',
    ],
    tips: [
      'Short goals need lower risk',
      'Avoid heavy equity for < 3-year goals',
      'Automate a monthly SIP to stay on track',
    ],
    recs: [
      { name: 'Short-term Debt Funds', detail: 'Steady & predictable' },
      { name: 'Recurring Deposit', detail: 'Zero-risk saving' },
      { name: 'Balanced Advantage', detail: 'Auto risk-adjusting' },
    ],
  },
  {
    id: 'travel',
    label: 'Travel',
    icon: Plane,
    accent: '#DB2777',
    emoji: '✈️',
    horizon: '~1 year',
    target: '₹2.5L',
    monthly: '₹20,000',
    risk: 'Very Low',
    allocation: [
      { asset: 'Liquid', pct: 55 },
      { asset: 'Debt', pct: 40 },
      { asset: 'Equity', pct: 5 },
    ],
    convo: [
      'Adventure awaits! ✈️',
      'A year out — safety first.',
      "Keep it liquid so it's ready when you are.",
    ],
    tips: [
      'Under 1 year? Stay liquid',
      'Lock a target date & work backwards',
      'Only a tiny equity slice, if flexible',
    ],
    recs: [
      { name: 'Liquid Funds', detail: 'Ready when you are' },
      { name: 'Fixed Deposit', detail: 'Guaranteed & simple' },
      { name: 'Arbitrage Funds', detail: 'Low-risk, tax-friendly' },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: Briefcase,
    accent: '#D97706',
    emoji: '🚀',
    horizon: '3–5 years',
    target: '₹25L',
    monthly: '₹40,000',
    risk: 'Moderate–High',
    allocation: [
      { asset: 'Equity', pct: 55 },
      { asset: 'Debt', pct: 30 },
      { asset: 'Gold', pct: 15 },
    ],
    convo: [
      'Building something? 🚀',
      'Bigger goal, balanced growth.',
      'Equity to grow, debt to steady the ride.',
    ],
    tips: [
      'Match risk to your runway',
      'Keep a liquid buffer for surprises',
      'Review the allocation every 6 months',
    ],
    recs: [
      { name: 'Flexi-cap Funds', detail: 'Growth across sizes' },
      { name: 'Corporate Bond Funds', detail: 'Stable income' },
      { name: 'Gold ETF', detail: 'A hedge for balance' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Animated allocation donut (redraws on each goal via key)                   */
/* -------------------------------------------------------------------------- */
function Donut({ goal }) {
  const R = 52;
  let cum = 0;
  return (
    <div className="relative h-[132px] w-[132px] shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#eef2f6" strokeWidth="15" />
        {goal.allocation.map((seg, i) => {
          const start = cum;
          cum += seg.pct;
          return (
            <motion.circle
              key={`${goal.id}-${seg.asset}`}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={ASSET[seg.asset]}
              strokeWidth="15"
              strokeLinecap="butt"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', rotate: (start / 100) * 360 }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: (seg.pct / 100) * 0.985 }}
              transition={{ delay: 0.15 + i * 0.14, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={goal.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35 }}
            className="text-[22px] font-bold tracking-tight text-dark"
          >
            {goal.target}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] font-bold uppercase tracking-wider text-dark/40">target</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phone with portfolio + conversation                                        */
/* -------------------------------------------------------------------------- */
function GoalPhone({ goal }) {
  return (
    <div className="relative mx-auto h-[600px] w-[300px] rounded-[52px] border-[3px] border-[#1a1f2e] bg-[#0A0F1C] p-[9px] shadow-phone">
      <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[44px] bg-[#F5F7FA]">
        {/* header */}
        <div className="z-10 flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-7 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#0E9F6E]">
            <Sparkles size={17} />
          </div>
          <div className="leading-tight">
            <h4 className="text-[14px] font-semibold">Nova</h4>
            <p className="text-[11px] text-white/70">planning your goal…</p>
          </div>
        </div>

        {/* body */}
        <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
          {/* goal banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.id + '-banner'}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 rounded-2xl border border-white bg-white px-3.5 py-2.5 shadow-sm"
            >
              <span className="text-2xl">{goal.emoji}</span>
              <div className="leading-tight">
                <p className="text-[14px] font-bold text-dark">{goal.label}</p>
                <p className="text-[11px] font-medium text-dark/45">{goal.horizon} horizon</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* portfolio card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={goal.id + '-port'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white bg-white p-3.5 shadow-sm"
            >
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-dark/40">
                Suggested portfolio
              </p>
              <div className="flex items-center gap-3">
                <Donut goal={goal} />
                <div className="flex-1 space-y-1.5">
                  {goal.allocation.map((seg, i) => (
                    <motion.div
                      key={seg.asset}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center justify-between text-[12.5px]"
                    >
                      <span className="flex items-center gap-1.5 font-medium text-dark/70">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: ASSET[seg.asset] }} />
                        {seg.asset}
                      </span>
                      <span className="font-bold text-dark">{seg.pct}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-dark/5 pt-2.5 text-[12px]">
                <span className="font-medium text-dark/50">Monthly SIP</span>
                <span className="font-bold text-emerald">{goal.monthly}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* conversation */}
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              <motion.div key={goal.id + '-convo'} className="space-y-2">
                {goal.convo.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.18, type: 'spring', stiffness: 380, damping: 26 }}
                    className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2 text-[13.5px] leading-snug text-gray-800 shadow-sm"
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stat tile with animated value swap                                         */
/* -------------------------------------------------------------------------- */
function Stat({ icon: Icon, label, value, goalId }) {
  return (
    <div className="rounded-2xl border border-dark/5 bg-white/70 p-4 shadow-sm backdrop-blur-md">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-emerald">
        <Icon size={17} />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-dark/40">{label}</p>
      <div className="h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={goalId + value}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[17px] font-bold text-dark"
          >
            {value}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */
export default function GoalExplorer() {
  const [activeId, setActiveId] = useState('emergency');
  const goal = GOALS.find((g) => g.id === activeId);

  return (
    <section
      id="goals"
      className="relative overflow-hidden bg-gradient-to-b from-background to-white py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute right-[10%] top-[16%] h-[420px] w-[420px] animate-aurora rounded-full blur-[150px]"
          style={{ background: `${goal.accent}22` }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <SectionHeading
          className="mb-12"
          eyebrow="Try it yourself"
          eyebrowIcon={Target}
          title="What are you saving for?"
          subtitle="Pick a goal and watch Nova rebuild your plan instantly — portfolio, tips and all."
        />

        {/* goal selector */}
        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
          {GOALS.map((g) => {
            const active = g.id === activeId;
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-bold transition-colors',
                  active ? 'text-white' : 'text-dark/60 hover:text-dark'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="goal-pill"
                    className="absolute inset-0 rounded-full shadow-glow"
                    style={{ background: `linear-gradient(135deg, ${g.accent}, #0E9F6E)` }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {!active && <span className="absolute inset-0 rounded-full border border-dark/10 bg-white/70" />}
                <span className="relative flex items-center gap-2">
                  <Icon size={16} />
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* interactive board */}
        <div className="grid items-start gap-8 lg:grid-cols-[320px_1fr]">
          {/* phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <GoalPhone goal={goal} />
          </motion.div>

          {/* right column */}
          <div className="space-y-6">
            {/* stat tiles */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat icon={Target} label="Target" value={goal.target} goalId={goal.id} />
              <Stat icon={Clock} label="Horizon" value={goal.horizon} goalId={goal.id} />
              <Stat icon={Gauge} label="Risk" value={goal.risk} goalId={goal.id} />
              <Stat icon={Wallet} label="Monthly" value={goal.monthly} goalId={goal.id} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* learning tips */}
              <div className="rounded-3xl border border-dark/5 bg-white/70 p-6 shadow-premium backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
                    <Lightbulb size={18} />
                  </span>
                  <h3 className="text-[17px] font-bold text-dark">What you'll learn</h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.ul key={goal.id} className="space-y-3">
                    {goal.tips.map((tip, i) => (
                      <motion.li
                        key={tip}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                        className="flex items-start gap-2.5 text-[14.5px] font-medium leading-snug text-dark/70"
                      >
                        <BadgeCheck size={18} className="mt-0.5 shrink-0 text-primary" />
                        {tip}
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>

              {/* recommendations */}
              <div className="rounded-3xl border border-dark/5 bg-white/70 p-6 shadow-premium backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-emerald">
                    <Sparkles size={18} />
                  </span>
                  <h3 className="text-[17px] font-bold text-dark">Nova recommends</h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={goal.id} className="space-y-2.5">
                    {goal.recs.map((rec, i) => (
                      <motion.div
                        key={rec.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                        className="group flex items-center justify-between rounded-2xl border border-dark/5 bg-white px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
                      >
                        <div className="leading-tight">
                          <p className="text-[14px] font-bold text-dark">{rec.name}</p>
                          <p className="text-[12.5px] font-medium text-dark/45">{rec.detail}</p>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-dark/30 transition-transform group-hover:translate-x-1 group-hover:text-emerald"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
