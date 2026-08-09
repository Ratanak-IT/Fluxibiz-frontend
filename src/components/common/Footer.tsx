"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { House, Mail, Phone } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";

// Light mode logos
import cbrdFundLogo from "../../../public/image/footer/cbrd-fund.png";
import fluxibizLogo from "../../../public/image/footer/fluxibiz-lightmode.png";
import istadLogo from "../../../public/image/footer/istad.png";
import mptcLogo from "../../../public/image/footer/mptc.png";

// Dark mode logos
import cbrdDarkMode from "../../../public/image/footer/cbrd-darkmode.png";
import fluxibizDarkMode from "../../../public/image/footer/fluxibiz-darkmode.png";
import istadDarkMode from "../../../public/image/footer/istad-darkmode.png";
import mptcDarkMode from "../../../public/image/footer/mptc-darkmode.png";

const usefulLinks = [
  { key: "aboutUs", href: "/about" },
  { key: "contactUs", href: "/contact" },
  { key: "privacyPolicy", href: "/privacy-policy" },
] as const;

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    label: "Telegram",
    href: "https://t.me/",
    icon: FaTelegramPlane,
  },
];

const partners = [
  {
    lightSrc: istadLogo,
    darkSrc: istadDarkMode,
    alt: "ISTAD",
    className:
      "w-full max-w-[130px] sm:max-w-[160px] md:max-w-[140px] lg:max-w-[160px]",
    imageClassName:
      "sm:-translate-x-[6px] md:translate-x-0 lg:translate-x-0",
  },
  {
    lightSrc: mptcLogo,
    darkSrc: mptcDarkMode,
    alt: "Ministry of Post and Telecommunications",
    className:
      "w-full max-w-[270px] sm:max-w-[320px] md:max-w-[230px] lg:max-w-[320px]",
    imageClassName:
      "sm:-translate-x-[6px] md:translate-x-0 lg:translate-x-0",
  },
  {
    lightSrc: cbrdFundLogo,
    darkSrc: cbrdDarkMode,
    alt: "CBRD Fund",
    className:
      "w-full max-w-[130px] sm:max-w-[165px] md:max-w-[110px] lg:max-w-[165px]",
    imageClassName:
      "sm:-translate-x-[6px] md:translate-x-0 lg:translate-x-0",
  },
];

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer
      className="
        relative
        z-10
        mt-auto
        border-t
        border-[#e5e7eb]
        bg-white
        text-[#111827]
        [color-scheme:light]

        dark:border-white/10
        dark:bg-background
        dark:text-white
        dark:[color-scheme:dark]
      "
    >
      <div
        className="
          container
          mx-auto
          w-full
          max-w-7xl
          overflow-hidden

          px-4
          py-8

          sm:px-6
          sm:py-10

          md:px-6
          md:py-12

          lg:px-10
          lg:py-14
        "
      >
    {/* ======================================================
    TOP FOOTER SECTION
====================================================== */}
<div
  className="
    mx-auto
    grid
    w-full
    max-w-7xl

    grid-cols-1
    gap-7

    md:grid-cols-[1.35fr_0.8fr_1.15fr]
    md:items-start
    md:gap-x-6
    md:gap-y-0

    lg:grid-cols-[1.15fr_0.85fr_1.15fr]
    lg:gap-8
  "
>
  {/* ==================================================
      FLUXIBIZ LOGO + DESCRIPTION
  ================================================== */}
  <section
    aria-label={t("aboutFluxiBiz")}
    className="
      flex
      h-full
      flex-col
      items-center
      text-center

      md:items-center
      md:text-center
      md:pr-2

      lg:items-center
      lg:pr-9
      lg:text-center
    "
  >
    <div
      className="
        flex
        w-full
        flex-col
        items-center
      "
    >
      {/* FluxiBiz logo */}
      <Link
        href="/store"
        aria-label={t("fluxiBizHome")}
        className="
          inline-flex
          h-[54px]
          items-center
          justify-center

          translate-x-2

          sm:h-[58px]
          sm:translate-x-2

          md:h-[56px]
          md:translate-x-0

          lg:h-[63px]
        "
      >
        {/* Light mode */}
        <Image
          src={fluxibizLogo}
          alt="FluxiBiz"
          priority
          className="
            block
            h-full
            w-[150px]
            object-contain
            object-center

            sm:w-[160px]

            md:w-[145px]

            lg:w-[180px]

            dark:hidden
          "
        />

        {/* Dark mode */}
        <Image
          src={fluxibizDarkMode}
          alt="FluxiBiz"
          priority
          className="
            hidden
            h-full
            w-[150px]
            object-contain
            object-center

            sm:w-[160px]

            md:w-[145px]

            lg:w-[180px]

            dark:block
          "
        />
      </Link>

      {/* FluxiBiz description */}
      <div
        className="
          mt-4
          w-full
          max-w-md
          space-y-1

          text-center
          text-sm
          leading-6
          text-[#6b7280]

          sm:mt-5
          sm:space-y-2
          sm:text-[15px]
          sm:leading-7

          md:mt-4
          md:max-w-none
          md:space-y-2
          md:text-center
          md:text-[11px]
          md:leading-5

          lg:max-w-md
          lg:text-[16px]
          lg:leading-7

          dark:text-white
        "
      >
        <p className="whitespace-nowrap">
          {t("poweringBusiness")}
        </p>

        <p className="whitespace-nowrap">
          {t("manageBetter")}
          {t("growFaster")}
        </p>

        <p className="whitespace-nowrap">
          {t("everythingNeeded")}
          {t("allInOne")}
        </p>
      </div>
    </div>
  </section>

  {/* ==================================================
      USEFUL LINKS
  ================================================== */}
  <section
    className="
      flex
      h-full
      flex-col

      rounded-2xl
      border
      border-[#e5e7eb]
      bg-white

      p-4
      text-left

      sm:p-6

      md:ml-0
      md:items-start
      md:rounded-none
      md:border-0
      md:bg-transparent
      md:p-0

      lg:ml-20

      dark:border-white/10
      dark:bg-background
      md:dark:bg-transparent
    "
  >
    <FooterTitle>{t("usefulLinks")}</FooterTitle>

    <nav
      aria-label={t("footerNavigation")}
      className="
        mt-5

        grid
        grid-cols-2
        gap-x-4
        gap-y-3

        sm:flex
        sm:flex-wrap
        sm:items-center
        sm:justify-center
        sm:gap-x-6
        sm:gap-y-3

        md:flex
        md:min-w-0
        md:flex-col
        md:items-start
        md:justify-start
        md:gap-3

        lg:min-w-[180px]
        lg:gap-4
      "
    >
      {usefulLinks.map(({ key, href }) => (
        <Link
          key={key}
          href={href}
          className="
            w-fit
            text-sm
            text-[#6b7280]
            transition-colors

            hover:text-[#00932A]

            focus-visible:rounded-sm
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-[#00932A]

            sm:text-base
            md:text-[13px]
            lg:text-base

            dark:text-white
          "
        >
          {t(key)}
        </Link>
      ))}
    </nav>
  </section>

  {/* ==================================================
      CONTACT US
  ================================================== */}
  <section
    className="
      flex
      h-full
      flex-col

      rounded-2xl
      border
      border-[#e5e7eb]
      bg-white

      p-5
      text-left

      sm:p-6

      md:items-start
      md:rounded-none
      md:border-0
      md:bg-transparent
      md:p-0

      lg:pl-20

      dark:border-white/10
      dark:bg-background
      md:dark:bg-transparent
    "
  >
    <FooterTitle>{t("contactUs")}</FooterTitle>

    <address
      className="
        mt-5
        max-w-md
        space-y-4

        text-sm
        not-italic
        leading-6
        text-[#6b7280]

        sm:text-base

        md:mt-4
        md:max-w-full
        md:space-y-3
        md:text-[12px]
        md:leading-5

        lg:mt-5
        lg:max-w-md
        lg:space-y-4
        lg:text-base
        lg:leading-6

        dark:text-white
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
          text-left

          md:gap-2
          lg:gap-3
        "
      >
        <House
          aria-hidden="true"
          strokeWidth={2}
          className="
            mt-0.5
            size-5
            shrink-0
            text-[#00932A]

            sm:size-6
            md:size-[18px]
            lg:size-6
          "
        />

        <p>
          {t("addressLine1")}
          <br />
          {t("addressLine2")}
        </p>
      </div>

      <ContactLink
        href="tel:+85515338826"
        label="+855 15 33 88 26"
      >
        <Phone
          aria-hidden="true"
          strokeWidth={2}
          className="
            size-5
            sm:size-6
            md:size-[18px]
            lg:size-6
          "
        />
      </ContactLink>

      <ContactLink
        href="mailto:ipos.istad@gmail.com"
        label="ipos.istad@gmail.com"
      >
        <Mail
          aria-hidden="true"
          strokeWidth={2}
          className="
            size-5
            sm:size-6
            md:size-[18px]
            lg:size-6
          "
        />
      </ContactLink>
    </address>
  </section>
</div>

        {/* ======================================================
            ORGANIZED AND SPONSORED BY
        ====================================================== */}
        <div
          className="
            mt-10
            border-t
            border-[#e5e7eb]
            pt-8

            sm:mt-12
            sm:pt-9

            md:mt-14
            md:pt-10

            dark:border-white/10
          "
        >
          <p
            className="
              mb-6
              text-center

              font-body
              text-[16px]
              uppercase
              tracking-[0.18em]

              text-[#6b7280]

              sm:mb-7
              sm:text-xs

              md:mb-8

              dark:text-white
            "
          >
            {t("organizedAndSponsored")}
          </p>

          {/* Partner logos */}
          <div
            className="
              mx-auto
              flex

              w-[220px]
              flex-col
              items-start
              gap-y-7

              sm:w-full
              sm:max-w-7xl
              sm:flex-row
              sm:flex-wrap
              sm:items-center
              sm:justify-center
              sm:gap-x-10
              sm:gap-y-8

              md:flex-nowrap
              md:gap-x-8

              lg:gap-x-16
            "
          >
            {partners.map((partner) => (
              <div
                key={partner.alt}
                className={`
                  flex
                  h-16
                  w-full
                  items-center
                  justify-start

                  sm:w-auto
                  sm:justify-center

                  ${partner.className}
                `}
              >
                {/* Light mode logo */}
                <Image
                  src={partner.lightSrc}
                  alt={partner.alt}
                  width={200}
                  height={64}
                  className={`
                    block
                    !h-full
                    !w-auto
                    max-w-full

                    object-contain
                    object-left

                    dark:hidden

                    ${partner.imageClassName}
                  `}
                />

                {/* Dark mode logo */}
                <Image
                  src={partner.darkSrc}
                  alt={partner.alt}
                  width={200}
                  height={64}
                  className={`
                    hidden
                    !h-full
                    !w-auto
                    max-w-full

                    object-contain
                    object-left

                    dark:block

                    ${partner.imageClassName}
                  `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================
          COPYRIGHT BAR
      ====================================================== */}
      <div className="bg-[#00932A] text-white">
        <div
          className="
            mx-auto
            flex
            min-h-10
            w-full
            max-w-[1600px]

            flex-col
            items-center
            justify-between

            gap-3
            px-4
            py-5

            sm:px-6

            md:flex-row
            md:gap-6
            md:px-8
            md:py-4

            lg:px-10
          "
        >
          <p
            className="
              text-center
              text-xs
              leading-5
              text-white/80

              sm:text-sm

              md:text-left
            "
          >
            {t("copyright")}
          </p>

          {/* Facebook + Telegram only */}
          <div className="flex items-center justify-center gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="
                  grid
                  size-9
                  place-items-center

                  rounded-full

                  text-white

                  transition-colors

                  hover:bg-white/15

                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-white

                  sm:size-10
                "
              >
                <Icon
                  aria-hidden="true"
                  className="size-[17px]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   FOOTER TITLE
============================================================ */
function FooterTitle({ children }: { children: ReactNode }) {
  return (
    <div>
      <h2
        className="
          text-lg
          font-semibold
          tracking-wide
          text-[#111827]

          sm:text-xl

          md:text-base

          lg:text-xl

          dark:text-white
        "
      >
        {children}
      </h2>

      <div
        aria-hidden="true"
        className="
          mt-2
          h-1
          w-12
          rounded-full
          bg-[#FEB90D]

          md:w-10

          lg:w-12
        "
      />
    </div>
  );
}

/* ============================================================
   CONTACT LINK
============================================================ */
function ContactLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="
        flex
        w-fit
        max-w-full

        items-center

        gap-3

        text-left
        text-[#6b7280]

        transition-colors

        hover:text-[#00932A]

        focus-visible:rounded-sm
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#00932A]

        md:gap-2

        lg:gap-3

        dark:text-white
      "
    >
      <span className="shrink-0 text-[#00932A]">
        {children}
      </span>

      <span className="break-all">
        {label}
      </span>
    </a>
  );
}