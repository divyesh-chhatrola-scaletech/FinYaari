import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Shared section heading: eyebrow pill + title + subtitle, with a consistent reveal.
 * theme: 'light' (default, dark text on light bg) | 'dark' (light text on dark bg)
 */
export default function SectionHeading({
  eyebrow,
  eyebrowIcon: EyebrowIcon = Sparkles,
  title,
  subtitle,
  theme = 'light',
  align = 'center',
  className,
}) {
  const dark = theme === 'dark';
  return (
    <div
      className={cn(
        'mx-auto max-w-2xl',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            'mb-5 inline-flex items-center gap-2 rounded-full border py-1.5 pl-3 pr-4 backdrop-blur-md',
            dark ? 'border-white/15 bg-white/5' : 'border-primary/20 bg-white/70 shadow-sm'
          )}
        >
          <EyebrowIcon size={15} className={dark ? 'text-mint' : 'text-primary'} />
          <span className={cn('text-[13px] font-bold uppercase tracking-wider', dark ? 'text-mint' : 'text-emerald')}>
            {eyebrow}
          </span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl',
          dark ? 'text-white' : 'text-dark'
        )}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={cn(
            'mx-auto mt-5 max-w-lg text-lg font-medium leading-relaxed',
            dark ? 'text-white/55' : 'text-dark/60'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
