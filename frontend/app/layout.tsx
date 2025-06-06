import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import NavbarWrapper from "../lib/components/common/navbar";
import Footer from "../lib/components/common/footer";
import "../styles/globals.css";
import clsx from "clsx";
import {
  ArticulatCF_DemiBold,
  ArticulatCF_Regular,
  fontArchivo,
  Panel_Sans_Bold,
  Panel_Sans_Medium,
} from "@/config/fonts";

export const metadata: Metadata = {
  title: "marketplacenft",
  description: "Generated by create next app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
  minHeight = "150vh",
}: {
  children: React.ReactNode;
  minHeight: string;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head title={metadata.title + ""}>
        <title>{metadata.title + ""}</title>
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background antialiased",
          ArticulatCF_Regular.variable,
          ArticulatCF_DemiBold.variable,
          Panel_Sans_Bold.variable,
          Panel_Sans_Medium.variable,
          fontArchivo.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex min-h-screen flex-col">
            <NavbarWrapper />
            <main
              className="w-full flex-grow"
              style={{
                minHeight: minHeight,
                // You can also set a fixed height if needed
                // height: "800px",
              }}
            >
              {children}
            </main>
          </div>
          <div style={{ marginTop: 20 }}>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
