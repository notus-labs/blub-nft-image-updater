import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

import { SettingsContextProvider } from '@/context/settings-context';
import { WalletContextProvider } from '@/context/wallet-context';

import { ToastProvider } from './toaster';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <SettingsContextProvider>
        <QueryClientProvider client={queryClient}>
          <WalletContextProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </WalletContextProvider>
        </QueryClientProvider>
      </SettingsContextProvider>
    </ToastProvider>
  );
};

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
