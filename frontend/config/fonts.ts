import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Archivo as FontArchivo,
  Work_Sans as FontWorkSans,
} from "next/font/google";

import localFont from "next/font/local";

// Google Fonts
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontArchivo = FontArchivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const fontWorkSans = FontWorkSans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Local Fonts
export const ArticulatCF_Regular = localFont({
  src: "../app/fonts/ArticulatCF-Regular.woff",
  weight: "700",
  variable: "--articulat-cf-regular",
});

export const ArticulatCF_DemiBold = localFont({
  src: "../app/fonts/ArticulatCF-DemiBold.woff",
  weight: "700",
  variable: "--articulat-cf-demi-bold",
});

export const Panel_Sans_Bold = localFont({
  src: "../app/fonts/Panel_Sans_Bold.otf",
  weight: "900",
  variable: "--panel-sans-bold",
});

export const Panel_Sans_Medium = localFont({
  src: "../app/fonts/Panel_Sans_Medium.otf",
  weight: "500",
  variable: "--panel-sans-medium",
});
