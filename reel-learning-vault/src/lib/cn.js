// Tiny className joiner — avoids pulling in clsx for a one-liner.
export const cn = (...parts) => parts.filter(Boolean).join(' ');
