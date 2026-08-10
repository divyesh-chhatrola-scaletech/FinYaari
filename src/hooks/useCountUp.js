import { useState, useEffect } from 'react';

const easeOut = (p) => 1 - Math.pow(1 - p, 3);

/**
 * Animate a number from 0 → `to` once `active` becomes true.
 * Returns the current integer value; resets to 0 when inactive.
 */
export default function useCountUp(to, active, dur = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) {
      setV(0);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(easeOut(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, dur]);
  return v;
}
