import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";

export const plusJakartaSansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-roboto-mono",
});
