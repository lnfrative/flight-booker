import type { Metadata } from "next";
import { CssBaseline, ThemeProvider } from "@mui/material"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import theme from "@/theme";

export const metadata: Metadata = {
  title: "Flight Booker",
  description: "A yada yada page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
