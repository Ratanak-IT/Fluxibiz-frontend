import Image from "next/image";
import Link from "next/link";
import { House, Mail, Phone } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import cbrdFundLogo from "../../../public/image/footer/cbrd-fund.png";
import fluxibizLogo from "../../../public/image/footer/fluxibiz-logo.png";
import istadLogo from "../../../public/image/footer/istad.png";
import mptcLogo from "../../../public/image/footer/mptc.png";

const usefulLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy & Policy", href: "/privacy-policy" },
  { label: "Social Media", href: "/social-media" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/", icon: FaInstagram },
  { label: "Telegram", href: "https://t.me/", icon: FaTelegramPlane },
  { label: "X", href: "https://x.com/", icon: FaXTwitter },
  { label: "YouTube", href: "https://www.youtube.com/", icon: FaYoutube },
  { label: "TikTok", href: "https://www.tiktok.com/", icon: FaTiktok },
];

const partners = [
  {
    src: mptcLogo,
    alt: "Ministry of Post and Telecommunications",
    className: "col-span-2 w-full max-w-[280px] sm:col-span-1 sm:max-w-[320px]",
  },
  { src: istadLogo, alt: "ISTAD", className: "w-full max-w-[120px] sm:max-w-[150px]" },
  { src: cbrdFundLogo, alt: "CBRD Fund", className: "w-full max-w-[135px] sm:max-w-[165px]" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-border bg-card text-card-foreground">
      <div className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.35fr_.7fr_1fr] lg:gap-14">
          <section
            className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1 lg:items-start lg:text-left"
            aria-label="About FluxiBiz"
          >
            <Link href="/" aria-label="FluxiBiz home" className="inline-flex">
              <Image
                src={fluxibizLogo}
                alt="FluxiBiz"
                priority
                className="h-auto w-[155px] object-contain sm:w-[180px]"
              />
            </Link>

            <div className="mt-4 max-w-md space-y-1 text-sm leading-6 text-muted-foreground sm:mt-5 sm:space-y-2 sm:text-[15px] sm:leading-7">
              <p>Powering Business Without Limits.</p>
              <p>Manage Better. Sell More. Grow Faster.</p>
              <p>Everything Your Business Needs, All in One.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background/45 p-5 text-left sm:p-6 md:rounded-none md:border-0 md:bg-transparent md:p-0">
            <FooterTitle>Useful Links</FooterTitle>
            <nav
              className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap md:flex-col md:items-start md:gap-4"
              aria-label="Footer navigation"
            >
              {usefulLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-base"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </section>

          <section className="rounded-2xl border border-border bg-background/45 p-5 text-left sm:p-6 md:rounded-none md:border-0 md:bg-transparent md:p-0">
            <FooterTitle>Contact Us</FooterTitle>
            <address className="mt-5 max-w-md space-y-4 not-italic text-sm leading-6 text-muted-foreground sm:text-base">
              <div className="flex items-start gap-3 text-left">
                <House
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary sm:size-6"
                  strokeWidth={2}
                />
                <p>
                  #40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork,
                  Phnom Penh
                </p>
              </div>

              <ContactLink href="tel:+85515338826" label="+855 15 33 88 26">
                <Phone aria-hidden="true" className="size-5 sm:size-6" strokeWidth={2} />
              </ContactLink>

              <ContactLink href="mailto:ipos.istad@gmail.com" label="ipos.istad@gmail.com">
                <Mail aria-hidden="true" className="size-5 sm:size-6" strokeWidth={2} />
              </ContactLink>
            </address>
          </section>
        </div>

        <div className="mt-9 border-t border-border pt-7 sm:mt-12 sm:pt-9">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:mb-7 sm:text-xs">
            Supported by
          </p>
          <div className="mx-auto grid max-w-sm grid-cols-1 items-center justify-items-center gap-7 min-[420px]:grid-cols-2 sm:max-w-none sm:grid-cols-3 sm:gap-6">
            {partners.map((partner) => (
              <Image
                key={partner.alt}
                src={partner.src}
                alt={partner.alt}
                className={`${partner.className} h-auto object-contain`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary text-white">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:px-8 md:flex-row md:gap-6 md:py-4 lg:px-10">
          <p className="text-center text-xs leading-5 text-white/80 sm:text-sm md:text-left">
            All Rights Reserved © Copyright 2026 FluxiBiz Cambodia.
          </p>

          <div className="grid grid-cols-6 items-center justify-center gap-0.5 sm:flex sm:gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-10"
              >
                <Icon aria-hidden="true" className="size-[17px]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-wide text-card-foreground sm:text-xl">{children}</h2>
      <div className="mt-2 h-1 w-12 rounded-full bg-secondary" aria-hidden="true" />
    </div>
  );
}

function ContactLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex w-fit max-w-full items-center gap-3 text-left transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="shrink-0 text-primary">{children}</span>
      <span className="break-all">{label}</span>
    </a>
  );
}
