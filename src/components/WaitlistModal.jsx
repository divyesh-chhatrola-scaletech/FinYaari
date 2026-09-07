import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { CheckCircle2, ChevronDown, Loader2, MessageCircle, X } from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY } from '../lib/countries';
import { submitToWaitlist, warmUpWaitlistApi, WaitlistApiError } from '../lib/waitlistApi';
import { cn } from '../lib/utils';

const initialState = {
  country: DEFAULT_COUNTRY,
  number: '',
  error: '',
  isSubmitting: false,
  step: 'form', // 'form' | 'success'
};

export default function WaitlistModal({ isOpen, onClose }) {
  const [state, setState] = useState(initialState);
  const dialogRef = useRef(null);

  // Always present a fresh popup the next time it's opened.
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setState(initialState), 250);
      return () => clearTimeout(t);
    }
    // Give a sleeping free-tier API a head start before the user hits Submit.
    warmUpWaitlistApi();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (state.isSubmitting) return;
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const handleNumberChange = (e) => {
    const filtered = e.target.value.replace(/[^\d\s()+-]/g, '');
    setState((s) => ({ ...s, number: filtered, error: '' }));
  };

  const handleCountryChange = (e) => {
    setState((s) => ({ ...s, country: e.target.value, error: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state.isSubmitting) return;

    const trimmed = state.number.trim();
    if (!trimmed) {
      setState((s) => ({ ...s, error: 'WhatsApp number is required.' }));
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(trimmed, state.country);
    if (!phoneNumber || !phoneNumber.isValid()) {
      setState((s) => ({ ...s, error: 'Please enter a valid WhatsApp number.' }));
      return;
    }

    setState((s) => ({ ...s, isSubmitting: true, error: '' }));

    try {
      await submitToWaitlist(phoneNumber.nationalNumber);
      setState((s) => ({ ...s, isSubmitting: false, step: 'success' }));
    } catch (err) {
      const message = err instanceof WaitlistApiError ? err.message : 'Something went wrong. Please try again.';
      setState((s) => ({ ...s, isSubmitting: false, error: message }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleOverlayClick}
          role="presentation"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] bg-white p-8 shadow-premium-hover sm:p-9"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-dark/40 transition-colors hover:bg-dark/5 hover:text-dark"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {state.step === 'form' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-emerald">
                    <MessageCircle size={22} />
                  </div>
                  <h2 id="waitlist-modal-title" className="mt-4 text-2xl font-bold tracking-tight text-dark">
                    Join the Waitlist
                  </h2>
                  <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-dark/60">
                    Enter your WhatsApp number and we&rsquo;ll let you know when learning on WhatsApp is available.
                  </p>

                  <form className="mt-7" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="waitlist-phone" className="mb-2 block text-[13px] font-bold text-dark">
                      WhatsApp Number
                    </label>
                    <div
                      className={cn(
                        'flex items-stretch overflow-hidden rounded-2xl border bg-white transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
                        state.error ? 'border-red-400' : 'border-dark/10'
                      )}
                    >
                      <div className="relative flex items-center border-r border-dark/10 bg-dark/[0.03]">
                        <select
                          aria-label="Country code"
                          value={state.country}
                          onChange={handleCountryChange}
                          disabled={state.isSubmitting}
                          className="h-full appearance-none bg-transparent py-3.5 pl-4 pr-8 text-[14px] font-semibold text-dark outline-none disabled:opacity-60"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} +{c.dialCode}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-dark/40" />
                      </div>
                      <input
                        id="waitlist-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="Enter your WhatsApp number"
                        value={state.number}
                        onChange={handleNumberChange}
                        disabled={state.isSubmitting}
                        aria-invalid={!!state.error}
                        aria-describedby={state.error ? 'waitlist-phone-error' : undefined}
                        className="h-full flex-1 min-w-0 bg-transparent px-4 py-3.5 text-[15px] font-medium text-dark outline-none placeholder:text-dark/35 disabled:opacity-60"
                      />
                    </div>

                    <AnimatePresence>
                      {state.error && (
                        <motion.p
                          id="waitlist-phone-error"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-[13px] font-semibold text-red-500"
                        >
                          {state.error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={state.isSubmitting}
                      className={cn(
                        'group relative mt-6 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-[16px] font-bold text-white shadow-glow transition-all hover:bg-accent',
                        'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-primary'
                      )}
                    >
                      {state.isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center py-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 18 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-emerald"
                  >
                    <CheckCircle2 size={34} />
                  </motion.div>
                  <h2 id="waitlist-modal-title" className="mt-5 text-2xl font-bold tracking-tight text-dark">
                    Thank You!
                  </h2>
                  <p className="mt-2.5 max-w-xs text-[15px] font-medium leading-relaxed text-dark/60">
                    You&rsquo;ve successfully joined the waitlist. We&rsquo;ll contact you on WhatsApp when learning on
                    WhatsApp is available.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-7 flex h-14 w-full items-center justify-center rounded-full bg-primary text-[16px] font-bold text-white shadow-glow transition-all hover:bg-accent"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
