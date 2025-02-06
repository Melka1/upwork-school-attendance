import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LayoutContainer from "../components/LayoutContainer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params = { locale: "en" },
}: {
  children: React.ReactNode;
  params?: { locale: string };
}) {
  const { locale } = await params;
  console.log("locale: ", locale, routing.locales.includes(locale as any));
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        <title>Student Attendance Tracker</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <LayoutContainer>{children}</LayoutContainer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
