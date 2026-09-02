import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { colorPalette, fontSizes, sizes } from './src/styles/theme';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial-wallet-dialog':
          'radial-gradient(closest-corner circle at 50% 50%, #006EFF44, rgba(255,0,0,0) 70%)',
      },
      height: {
        ...sizes,
      },
      maxHeight: {
        ...sizes,
      },
      width: {
        ...sizes,
      },
      maxWidth: {
        ...sizes,
      },
      minWidth: {
        ...sizes,
      },
      colors: {
        background: {
          DEFAULT: '#ffffff',
          dark: '#0c0c10',
        },
        foreground: {
          DEFAULT: '#0c0c10',
          dark: '#ffffff',
        },
        ...colorPalette,
      },
      fontSize: {
        ...fontSizes,
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.hidden-scroll': {
          scrollbarWidth: 'none',
          scrollbarHeight: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            width: '0',
            height: '0',
          },
        },
        '.transition-background': {
          'transition-property':
            'background-color, border-color, text-decoration-color, fill, stroke',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },
      });
    }),
  ],
};
export default config;
