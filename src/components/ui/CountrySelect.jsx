import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

function flagEmoji(iso2) {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

/**
 * Searchable country / dial-code combobox. Renders like a select trigger but
 * opens a filterable list instead of the native (unsearchable) dropdown.
 */
export default function CountrySelect({ countries, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  const selected = countries.find((c) => c.code === value) ?? countries[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dialCode.includes(q.replace('+', ''))
    );
  }, [countries, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlighted(0);
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  const selectCountry = (code) => {
    onChange(code);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const match = filtered[highlighted];
      if (match) selectCountry(match.code);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Country code"
        className="flex h-full items-center gap-1.5 py-3.5 pl-4 pr-3 text-[14px] font-semibold text-dark outline-none disabled:opacity-60"
      >
        <span aria-hidden="true">{flagEmoji(selected.code)}</span>
        <span>
          {selected.code} +{selected.dialCode}
        </span>
        <ChevronDown size={14} className="text-dark/40" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-20 w-[280px] max-w-[80vw] overflow-hidden rounded-2xl border border-dark/10 bg-white shadow-premium-hover"
        >
          <div className="flex items-center gap-2 border-b border-dark/10 px-3.5 py-2.5">
            <Search size={15} className="shrink-0 text-dark/35" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlighted(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search country or code"
              className="w-full bg-transparent text-[14px] font-medium text-dark outline-none placeholder:text-dark/35"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1.5">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-[13px] font-medium text-dark/45">No countries found.</li>
            )}
            {filtered.map((c, i) => (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.code === value}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => selectCountry(c.code)}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[14px] font-medium text-dark transition-colors',
                    i === highlighted ? 'bg-primary/10' : 'hover:bg-dark/5'
                  )}
                >
                  <span aria-hidden="true">{flagEmoji(c.code)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-dark/45">+{c.dialCode}</span>
                  {c.code === value && <Check size={15} className="text-emerald" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
