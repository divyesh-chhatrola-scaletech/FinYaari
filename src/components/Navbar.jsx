import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { MessageCircle, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './ui/Button';
import { useWaitlistModal } from '../context/WaitlistModalContext';

const NAV_LINKS = [
  { name: 'Why FinYaari', href: '#why-finyaari', id: 'why-finyaari' },
  { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { name: 'Your Journey', href: '#journey', id: 'journey' },
  { name: 'Meet Nova', href: '#nova', id: 'nova' },
  { name: 'FAQ', href: '#faq', id: 'faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const { openWaitlistModal } = useWaitlistModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // active-section detection
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // lock scroll + Esc to close on mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* scroll progress */}
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-emerald via-primary to-mint"
        style={{ scaleX: scrollYProgress }}
      />

      <header className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'pointer-events-auto flex w-full items-center justify-between rounded-full p-2 pl-[30px] pr-[18px] transition-all duration-500 ease-out',
            scrolled ? 'glass max-w-[1440px] bg-white/70 shadow-premium' : 'max-w-[1440px] bg-transparent'
          )}
        >
          {/* logo */}
          <a href="#home" className="group flex items-center gap-2 rounded-full" aria-label="FinYaari home">
            <img src="/logo-dark.svg" alt="FinYaari" className="h-[4.5rem] w-auto transition-transform duration-300 group-hover:scale-105" />
          </a>

          {/* desktop menu */}
          <div className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.id)}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'text-emerald' : 'text-dark/60 hover:text-dark'
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  {hovered === link.id && (
                    <motion.span layoutId="nav-hover" className="absolute inset-0 z-0 rounded-full bg-dark/5" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                  )}
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-0.5 z-0 h-[3px] rounded-full bg-primary" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
                  )}
                </a>
              );
            })}
          </div>

          {/* right actions */}
          <div className="flex items-center gap-2">
            <Button as="button" type="button" onClick={openWaitlistModal} size="sm" variant="dark" className="hidden md:inline-flex">
              Start Learning on WhatsApp
            </Button>

            {/* mobile toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-dark text-white md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {open ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass absolute inset-x-4 top-20 rounded-3xl bg-white/90 p-4 shadow-premium-hover"
            >
              <nav className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className={cn(
                      'rounded-2xl px-4 py-3.5 text-[16px] font-semibold transition-colors',
                      active === link.id ? 'bg-primary/10 text-emerald' : 'text-dark/70 hover:bg-dark/5'
                    )}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <div className="mt-2 border-t border-dark/5 pt-3">
                  <Button
                    as="button"
                    type="button"
                    size="md"
                    variant="primary"
                    icon={MessageCircle}
                    trailing
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      openWaitlistModal();
                    }}
                  >
                    Start Learning on WhatsApp
                  </Button>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
