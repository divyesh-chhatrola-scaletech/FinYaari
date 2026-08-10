import { motion } from 'framer-motion';
import {
  MonitorPlay,
  BadgeIndianRupee,
  BookText,
  UserRound,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Play,
  ArrowRight,
} from 'lucide-react';
import SectionHeading from './ui/SectionHeading';

/* -------------------------------------------------------------------------- */
/*  The transformation: how beginners learn today → the FinYaari way          */
/* -------------------------------------------------------------------------- */
const SWAPS = [
  {
    id: 'doing',
    oldIcon: MonitorPlay,
    old: 'Learn from YouTube',
    oldSub: 'Endless videos, nothing sticks.',
    newIcon: Play,
    now: 'Learn by Doing',
    newSub: 'Practice on real markets, hands-on.',
  },
  {
    id: 'practice',
    oldIcon: BadgeIndianRupee,
    old: 'Risk Real Money',
    oldSub: 'One mistake and it stings for months.',
    newIcon: ShieldCheck,
    now: 'Practice First',
    newSub: '₹10L virtual money. Zero real risk.',
  },
  {
    id: 'simple',
    oldIcon: BookText,
    old: 'Complex Jargon',
    oldSub: 'P/E, SIP, NAV… who talks like that?',
    newIcon: MessageCircle,
    now: 'Simple WhatsApp Chats',
    newSub: 'Plain language, one message at a time.',
  },
  {
    id: 'guided',
    oldIcon: UserRound,
    old: 'Learn Alone',
    oldSub: 'No one to ask when you get stuck.',
    newIcon: Sparkles,
    now: 'Nova Guides You',
    newSub: 'A patient friend, always a text away.',
  },
];

function SwapCard({ swap, index }) {
  const OldIcon = swap.oldIcon;
  const NewIcon = swap.newIcon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[28px] border border-dark/5 bg-white/70 p-6 shadow-premium backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-premium-hover md:p-7"
    >
      {/* old way */}
      <div className="flex items-center gap-3 opacity-60">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-dark/5 text-dark/45">
          <OldIcon size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dark/35">The old way</p>
          <p className="text-[15px] font-bold text-dark/60 line-through decoration-dark/25">{swap.old}</p>
        </div>
      </div>

      <p className="ml-14 mt-1 text-[13px] font-medium text-dark/40">{swap.oldSub}</p>

      {/* connector */}
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dark/10 to-primary/30" />
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.08, type: 'spring', stiffness: 320, damping: 18 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-glow"
        >
          <ArrowRight size={16} className="rotate-90" />
        </motion.span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-dark/10 to-primary/30" />
      </div>

      {/* finyaari way */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald text-white shadow-sm">
          <NewIcon size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald">The FinYaari way</p>
          <p className="text-[17px] font-bold text-dark">{swap.now}</p>
        </div>
      </div>

      <p className="ml-14 mt-1 text-[13.5px] font-medium text-dark/55">{swap.newSub}</p>

      {/* hover glow */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function WhyFinYaari() {
  return (
    <section id="why-finyaari" className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-[380px] w-[380px] animate-aurora rounded-full bg-primary/10 blur-[150px]" />
        <div
          className="absolute bottom-[6%] right-[6%] h-[420px] w-[420px] animate-aurora rounded-full bg-emerald/10 blur-[150px]"
          style={{ animationDelay: '5s' }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6">
        <SectionHeading
          className="mb-14 md:mb-20"
          eyebrow="Why FinYaari"
          title={<>A whole new way to <span className="text-gradient">start.</span></>}
          subtitle="Most beginners learn the hard way. FinYaari flips it — you practice first, understand as you go, and never learn alone."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {SWAPS.map((swap, i) => (
            <SwapCard key={swap.id} swap={swap} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
