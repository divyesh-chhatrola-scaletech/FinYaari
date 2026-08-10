import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Wallet,
  Compass,
  CheckCircle,
  TrendingUp,
  Trophy,
  Shield,
} from 'lucide-react';
import useCountUp from '../hooks/useCountUp';
import SectionHeading from './ui/SectionHeading';
import { cn } from '../lib/utils';

const STATS = [
  {
    id: 'portfolio',
    icon: Wallet,
    label: 'Virtual Practice Portfolio',
    to: 1000000,
    format: (v) => `₹${v.toLocaleString('en-IN')}`,
    accent: '#0E9F6E',
  },
  {
    id: 'topics',
    icon: Compass,
    label: 'Topics Explored',
    subtitle: 'Stocks • SIP • IPO • ETFs',
    to: 12,
    format: (v) => `${v}`,
    accent: '#7C3AED',
  },
  {
    id: 'activities',
    icon: CheckCircle,
    label: 'Practice Activities',
    subtitle: 'Interactive exercises completed with Nova',
    to: 28,
    format: (v) => `${v}`,
    accent: '#25D366',
  },
  {
    id: 'insights',
    icon: TrendingUp,
    label: 'Market Insights',
    subtitle: 'Real market movements explored',
    to: 45,
    format: (v) => `${v}`,
    accent: '#F59E0B',
  },
  {
    id: 'milestones',
    icon: Trophy,
    label: 'Journey Milestones',
    subtitle: 'Personal investing milestones unlocked',
    to: 7,
    format: (v) => `${v}`,
    accent: '#EF4444',
  },
  {
    id: 'confidence',
    icon: Shield,
    label: 'Investing Confidence',
    subtitle: 'Growing through every conversation',
    to: 0,
    isString: true,
    valueString: 'Building',
    format: () => 'Building',
    accent: '#14B8A6',
  },
];

function StatTile({ stat, active, index }) {
  const Icon = stat.icon;
  const value = useCountUp(stat.to || 0, active, 1200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[26px] border border-dark/5 bg-white/70 p-6 shadow-premium backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-premium-hover"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${stat.accent}, #0E9F6E)` }}
      >
        <Icon size={22} />
      </span>
      <p className="mt-5 text-[32px] font-bold leading-none tracking-tight text-dark">
        {stat.isString ? stat.valueString : stat.format(value)}
      </p>
      <p className="mt-2 text-[15px] font-bold text-dark/80">{stat.label}</p>
      {stat.subtitle && (
        <p className="mt-1 text-[13.5px] font-medium leading-[1.4] text-dark/50">
          {stat.subtitle}
        </p>
      )}
      <div
        className="pointer-events-none absolute -bottom-14 -right-14 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${stat.accent}22` }}
      />
    </motion.div>
  );
}

export default function LearningProgress() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (inView) setActive(true);
  }, [inView]);

  const journeySteps = [
    { label: 'Starting Out', active: true },
    { label: 'Learning', active: true },
    { label: 'Practicing', active: true },
    { label: 'Investing with Confidence', active: false },
  ];

  return (
    <section id="progress" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[10%] top-[12%] h-[400px] w-[400px] animate-aurora rounded-full bg-primary/10 blur-[150px]" />
        <div
          className="absolute bottom-[8%] left-[8%] h-[380px] w-[380px] animate-aurora rounded-full bg-emerald/10 blur-[150px]"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div ref={ref} className="relative z-10 mx-auto w-full max-w-[1100px] px-6">
        <SectionHeading
          className="mb-14 md:mb-20"
          eyebrow="YOUR PROGRESS"
          title="Every conversation builds confidence."
          subtitle="Practice with virtual money, understand real market movements, and build investing confidence—one WhatsApp conversation at a time."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat, i) => (
            <StatTile key={stat.id} stat={stat} active={active} index={i} />
          ))}
        </div>

        {/* Visual Journey */}
        <div className="mx-auto mt-24 mb-10 max-w-3xl px-4 sm:px-10">
          <div className="relative">
            {/* Background line */}
            <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-dark/5" />
            
            {/* Animated foreground line */}
            <motion.div
              className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
              initial={{ width: '0%' }}
              whileInView={{ width: '75%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
            />
            
            {/* Points */}
            <div className="relative flex justify-between">
              {journeySteps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.3, type: 'spring' }}
                    className={cn(
                      'z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border-4 shadow-sm transition-colors duration-300',
                      step.active ? 'border-white bg-primary' : 'border-white bg-dark/10'
                    )}
                  />
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.3 }}
                    className={cn(
                      'absolute top-8 w-max -translate-x-1/2 left-1/2 text-center text-[13px] font-bold tracking-tight',
                      step.active ? 'text-primary' : 'text-dark/40'
                    )}
                  >
                    {step.label}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
