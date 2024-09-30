import type { Metadata } from "next";
import "./globals.css";
import { MailAtSign01Icon } from "hugeicons-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cheik Cissé",
  description: "Designer et Développeur web/mobile fullstack",
  icons: [
    {
      url: "https://bzszwpattbiphmxezsij.supabase.co/storage/v1/object/sign/CC%20Portfolio/moi-min.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDQyBQb3J0Zm9saW8vbW9pLW1pbi5qcGVnIiwiaWF0IjoxNzI3Njg4Nzk5LCJleHAiOjQ4ODEyODg3OTl9.HHJmKDkJUFETgWt3XGhZZf6zeLxtflKmzs9wNTrhOu8&t=2024-09-30T09%3A33%3A19.386Z",
    },
  ],
  openGraph: {
    title: "Cheik Cissé",
    description: "Designer et Développeur web/mobile fullstack",
    type: "website",
    url: "https://cheikcisse.com",
    images: [
      {
        url: "https://bzszwpattbiphmxezsij.supabase.co/storage/v1/object/sign/CC%20Portfolio/moi-min.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDQyBQb3J0Zm9saW8vbW9pLW1pbi5qcGVnIiwiaWF0IjoxNzI3Njg4Nzk5LCJleHAiOjQ4ODEyODg3OTl9.HHJmKDkJUFETgWt3XGhZZf6zeLxtflKmzs9wNTrhOu8&t=2024-09-30T09%3A33%3A19.386Z",
        width: 1200,
        height: 630,
        alt: "Cheik Cissé",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "Cheik Cissé",
    description: "Designer et Développeur web/mobile fullstack",
    title: "Cheik Cissé",
    images: [
      {
        url: "https://bzszwpattbiphmxezsij.supabase.co/storage/v1/object/sign/CC%20Portfolio/moi-min.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDQyBQb3J0Zm9saW8vbW9pLW1pbi5qcGVnIiwiaWF0IjoxNzI3Njg4Nzk5LCJleHAiOjQ4ODEyODg3OTl9.HHJmKDkJUFETgWt3XGhZZf6zeLxtflKmzs9wNTrhOu8&t=2024-09-30T09%3A33%3A19.386Z",
        width: 1200,
        height: 630,
        alt: "Cheik Cissé",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="cc-container flex flex-row justify-center sm:justify-between items-center mt-6 sm:mt-12 pb-6 border-b border-black sm:pb-0 sm:border-none">
          <Link href="/" className="text-[24px] sm:text-base">
            Cheik Cissé
          </Link>
          <nav className="hidden sm:block">
            <ul className="flex items-center space-x-12">
              <li className="border-b-2 border-transparent hover:border-black transition-colors duration-300">
                <Link href="/#projects">Projets</Link>
              </li>
              <li className="border-b-2 border-transparent hover:border-black transition-colors duration-300">
                <Link href="/#about">À propos</Link>
              </li>
              <li className="border-b-2 border-transparent hover:border-black transition-colors duration-300">
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer id="contact" className="py-[130px] bg-white normal-case ">
          <div className="cc-container flex flex-col items-center space-y-11">
            <p className="text-center text-[44px] sm:text-[64px] leading-tight">
              Vous avez un projet ou une opportunité pour moi? <br />
              Discutons-en
            </p>
            <a
              href="mailto:papicisse24@gmail.com"
              className="font-light text-[24px] sm:text-[48px] flex items-center space-x-8"
            >
              <span className="hidden sm:inline-block mt-2">
                <MailAtSign01Icon size={48} />
              </span>
              <span className="inline-block sm:hidden mt-2">
                <MailAtSign01Icon size={32} />
              </span>
              <span>papicisse24@gmail.com</span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
