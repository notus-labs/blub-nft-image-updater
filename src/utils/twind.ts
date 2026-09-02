import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { fontSizes } from '../styles/theme';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': Object.keys(fontSizes).map((key) => `text-${key}`),
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
