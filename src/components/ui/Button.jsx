import { forwardRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Reusable, accessible button.
 * variant: primary | secondary | dark | ghost | white
 * size: md | sm
 * icon: leading lucide icon component
 * trailing: show the arrow-in-circle affordance
 */
const VARIANTS = {
  primary:
    'bg-primary text-white shadow-glow hover:bg-accent',
  secondary:
    'bg-white text-dark shadow-premium hover:shadow-premium-hover',
  dark: 'bg-dark text-white hover:bg-emerald',
  white: 'bg-white text-dark shadow-glow hover:shadow-premium-hover',
  ghost:
    'bg-transparent text-dark hover:bg-dark/5',
};

const SIZES = {
  md: 'h-14 text-[16px] gap-3',
  sm: 'h-11 text-[14px] gap-2 px-5',
};

const Button = forwardRef(function Button(
  { as = 'button', variant = 'primary', size = 'md', icon: Icon, trailing = false, className, children, ...props },
  ref
) {
  const Comp = as;
  return (
    <Comp
      ref={ref}
      className={cn(
        'group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-bold outline-none transition-all duration-300',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        SIZES[size],
        VARIANTS[variant],
        trailing ? 'pl-6 pr-2' : size === 'md' ? 'px-7' : '',
        className
      )}
      {...props}
    >
      {/* shine sweep on primary/white */}
      {(variant === 'primary' || variant === 'white') && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
      {Icon && <Icon size={size === 'sm' ? 17 : 20} className="relative shrink-0" />}
      <span className="relative whitespace-nowrap">{children}</span>
      {trailing && (
        <span
          className={cn(
            'relative flex items-center justify-center rounded-full transition-transform group-hover:translate-x-1',
            size === 'sm' ? 'h-7 w-7' : 'h-8 w-8',
            variant === 'primary' || variant === 'dark' ? 'bg-white/20' : 'bg-primary text-white'
          )}
        >
          <ArrowRight size={size === 'sm' ? 14 : 16} />
        </span>
      )}
    </Comp>
  );
});

export default Button;
