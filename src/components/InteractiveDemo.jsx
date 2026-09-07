import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCheck, Flame, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import SectionHeading from './ui/SectionHeading';
import { useWaitlistModal } from '../context/WaitlistModalContext';

/* -------------------------------------------------------------------------- */
/*  WhatsApp UI Components                                                     */
/* -------------------------------------------------------------------------- */

function WhatsAppHeader() {
  return (
    <div className="z-10 flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-7 text-white shadow-sm">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#0E9F6E]">
        <span className="text-[17px]">✨</span>
        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
      </div>
      <div className="leading-tight flex-1">
        <h4 className="text-[15px] font-bold">Nova</h4>
        <p className="text-[11px] text-white/80">online</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-sm">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-dark/30"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ text, isUser, delay = 0, status = 'read' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative max-w-[85%] px-3.5 py-2 text-[14px] leading-snug shadow-sm',
        isUser
          ? 'ml-auto rounded-2xl rounded-tr-sm bg-[#dcf8c6] text-[#0A0F1C]'
          : 'mr-auto rounded-2xl rounded-tl-sm bg-white text-[#0A0F1C]'
      )}
    >
      <div className="pb-2 text-[14.5px] whitespace-pre-wrap">{text}</div>
      <div className="absolute bottom-1 right-2 flex items-center gap-1">
        <span className="text-[9.5px] text-dark/40">10:42 AM</span>
        {isUser && (
          <CheckCheck size={14} className={status === 'read' ? 'text-[#34B7F1]' : 'text-dark/30'} />
        )}
      </div>
    </motion.div>
  );
}

function PortfolioCard({ updated }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
      className="mx-auto mt-2 w-[90%] overflow-hidden rounded-2xl border border-dark/5 bg-white shadow-sm"
    >
      <div className="bg-[#F8FAFC] px-4 py-2 border-b border-dark/5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-dark/40">Virtual Portfolio</p>
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium text-dark/50 mb-1">Total Value</p>
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-bold text-dark">
                ₹{updated ? '10,23,000' : '10,00,000'}
              </span>
              {updated && (
                <motion.span 
                  initial={{ opacity: 0, x: -5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="flex items-center text-[12px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded"
                >
                  <TrendingUp size={12} className="mr-1" /> +2.3%
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExperienceNotification() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.4 }}
      className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border border-[#FFD700]/30 bg-[#FFFAEB] px-4 py-2 shadow-sm"
    >
      <div className="flex items-center gap-1.5 font-bold text-[#D97706]">
        <span className="text-[18px]">✨</span>
        <span className="text-[14px]">+25 XP</span>
      </div>
      <div className="h-4 w-[1px] bg-[#D97706]/20" />
      <div className="flex items-center gap-1 font-bold text-[#D97706]">
        <Flame size={16} className="fill-[#D97706]" />
        <span className="text-[13px]">7 Day Streak</span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function InteractiveDemo() {
  const { openWaitlistModal } = useWaitlistModal();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);

  // Auto-progress first step
  useEffect(() => {
    const t = setTimeout(() => setStep(1), 800);
    return () => clearTimeout(t);
  }, []);

  const handleAnswer = (kind) => {
    if (step >= 2) return;
    setChoice(kind);
    setStep(2); // User picks an option
    setTimeout(() => setStep(3), 500); // User message appears, Nova starts typing
    setTimeout(() => setStep(4), 2000); // Nova finishes typing, sends message
    setTimeout(() => setStep(5), 3200); // Portfolio updates, XP appears
  };

  return (
    <section id="learning" className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Very subtle background styling */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-[#25D366]/5 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-24 max-w-6xl mx-auto">
          
          {/* Left Side: Content (55%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading
              className="mb-8"
              eyebrow="Real WhatsApp learning"
              title="Your first investing lesson starts with one message."
              subtitle="No long videos. No complicated charts. Just a simple conversation with Nova that helps you understand the market one lesson at a time."
              align="left"
            />

            <div className="space-y-4 mb-10">
              {[
                'Learn with real market examples',
                'Practice using virtual money',
                'Understand every decision before investing'
              ].map((benefit, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-dark/70 font-medium"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {benefit}
                </motion.div>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={openWaitlistModal}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex h-14 items-center gap-3 rounded-full bg-dark pl-6 pr-5 font-bold text-white shadow-premium transition-all hover:bg-dark/90 hover:shadow-premium-hover"
            >
              <span className="text-[16px]">Start Learning on WhatsApp</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </motion.button>
          </motion.div>

          {/* Right Side: Phone Mockup (45%) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto flex h-[640px] w-full max-w-[320px] flex-col overflow-hidden rounded-[48px] border-[10px] border-[#1a1f2e] bg-[#e5ddd5] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]"
          >
            {/* Phone Notch */}
            <div className="absolute left-1/2 top-0 z-30 h-6 w-32 -translate-x-1/2 rounded-b-3xl bg-[#1a1f2e]" />
            
            <WhatsAppHeader />
            
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 pb-8 pattern-whatsapp bg-[#e5ddd5]">
              
              <AnimatePresence>
                {step >= 1 && (
                  <MessageBubble 
                    text={"👋 Good Morning!\n\nReliance Industries is up 2.3% today.\n\nDo you know why?"} 
                    isUser={false} 
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="flex gap-2 pt-2 ml-auto w-fit items-end"
                  >
                    <button onClick={() => handleAnswer('explain')} className="rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-primary shadow-sm hover:bg-primary/5 active:scale-95 transition-all">
                      Explain
                    </button>
                    <button onClick={() => handleAnswer('guess')} className="rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-dark/70 shadow-sm hover:bg-dark/5 active:scale-95 transition-all">
                      I'll Guess
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step >= 2 && (
                  <MessageBubble text={choice === 'guess' ? "I'll guess 🤔" : 'Explain please'} isUser={true} />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <TypingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step >= 4 && (
                  <MessageBubble
                    text={
                      choice === 'guess'
                        ? "Good instinct! 👏 It's because the company reported stronger quarterly earnings yesterday.\n\nLet's see how this moves your virtual portfolio."
                        : "Because the company reported stronger quarterly earnings yesterday.\n\nLet's see how this moves your virtual portfolio."
                    }
                    isUser={false}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <PortfolioCard updated={true} />
                    <ExperienceNotification />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Message Input Bar Mockup */}
            <div className="bg-[#f0f2f5] p-2.5 px-3 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full h-10 px-4 flex items-center text-[15px] text-dark/40 shadow-sm">
                Message
              </div>
              <div className="h-10 w-10 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 rounded bg-white" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        .pattern-whatsapp {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d0c9c2' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </section>
  );
}
