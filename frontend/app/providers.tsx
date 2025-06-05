"use client";
import * as React from "react";
import { ReactNode } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

const useQueryClient = () => {
  if (isServer) return getQueryClient();

  if (!browserQueryClient) browserQueryClient = getQueryClient();

  return browserQueryClient;
};

export interface ProvidersProps {
  children: ReactNode;
  themeProps: ThemeProviderProps;
}

const Providers = ({ children, themeProps }: ProvidersProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HeroUIProvider navigate={router.push}>
          <ToastProvider />
          <ThemeProvider {...themeProps}>
            <NuqsAdapter> {children}</NuqsAdapter>
          </ThemeProvider>
        </HeroUIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
