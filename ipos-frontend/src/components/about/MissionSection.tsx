'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Chart } from './Chart';

interface FeatureCard {
  icon: 'clipboard' | 'heart' | 'clock' | 'shield';
  title: string;
  description: string;
}

export interface MissionSectionProps {
  eyebrow?: string;
  headlinePrefix?: string;
  headlineHighlight?: string;
  headlineSuffix?: string;
  cards?: FeatureCard[];
  slideDurationSec?: number;
  className?: string;
}

function Icon({ name }: { name: FeatureCard['icon'] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'clipboard':
      return (
        <svg {...common}>
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );

    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      );

    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );

    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

export default function MissionSection({
  eyebrow,
  headlinePrefix,
  headlineHighlight,
  headlineSuffix,
  cards,
  slideDurationSec = 15,
  className = '',
}: MissionSectionProps) {
  const t = useTranslations('About.mission');

  const translatedCards: FeatureCard[] = [
    {
      icon: 'clipboard',
      title: t('cards.everything.title'),
      description: t('cards.everything.description'),
    },
    {
      icon: 'heart',
      title: t('cards.easy.title'),
      description: t('cards.easy.description'),
    },
    {
      icon: 'clock',
      title: t('cards.cambodia.title'),
      description: t('cards.cambodia.description'),
    },
    {
      icon: 'shield',
      title: t('cards.secure.title'),
      description: t('cards.secure.description'),
    },
  ];

  const displayedCards = cards ?? translatedCards;
  const loopedCards = [...displayedCards, ...displayedCards];

  return (
    <section
      className={`ms-scope w-full overflow-hidden px-[5.5%] pb-24 font-googlesans antialiased ${className}`}
    >
      <div className="mb-[3.2rem] max-w-[900px]">
        <div className="mb-4 inline-flex animate-[ah-fade-up_0.6s_var(--ah-ease)_forwards] items-center gap-2 text-[0.85rem] font-bold uppercase tracking-[0.04em] text-[#00932A] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100">
          <span className="h-1.5 w-1.5 animate-[ms-pulse_2.2s_ease-in-out_infinite] rounded-full dark:bg-white bg-[#00932A] motion-reduce:animate-none" />
          {eyebrow ?? t('eyebrow')}
        </div>

        <h2 className="m-0 translate-y-4 animate-[ah-fade-up_0.75s_0.12s_var(--ah-ease)_forwards] dark:text-gray-300 text-[2.6rem] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#030712] opacity-0 motion-reduce:translate-y-0 motion-reduce:animate-none motion-reduce:opacity-100 max-[720px]:text-[1.7rem]">
          {headlinePrefix ?? t('headlinePrefix')}
          <br />
          {t('with')}{' '}
          <span className="text-[#00932A]">
            {headlineHighlight ?? t('headlineHighlight')}
          </span>{' '}
          {headlineSuffix ?? t('headlineSuffix')}
        </h2>
      </div>

      <div
        className="
          py-8 relative w-full overflow-hidden
          [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]
          [-webkit-mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]
        "
      >
        <div
          className="
            flex w-max
            animate-[ms-slide-left_linear_infinite]
            gap-6
            motion-reduce:animate-none
          "
          style={{
            animationDuration: `${slideDurationSec}s`,
          }}
        >
          {loopedCards.map((card, i) => (
            <div
              key={`${card.title}-${i}`}
              style={{
                animationDelay: `${(i % displayedCards.length) * 0.1}s`,
              }}
              className="
                ease-hero flex-[0_0_auto]
                w-[260px] translate-y-[18px]
                animate-[ah-card-in_0.7s_var(--ah-ease)_forwards]
                rounded-[18px]
                border border-border
                bg-card
                px-6 pb-[1.8rem] pt-[1.6rem]
                opacity-0
                shadow-[0_10px_28px_-14px_rgba(3,7,18,0.12)]
                transition-transform duration-300 ease-out hover:-translate-y-1.5
                motion-reduce:translate-y-0 motion-reduce:transition-none
                motion-reduce:animate-none motion-reduce:opacity-100
                max-[720px]:w-[220px]
              "
            >
              <div
                className="
                  mb-4 flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-brand
                  shadow-[0_8px_18px_-6px_rgba(33,185,75,0.45)]
                "
              >
                <Icon name={card.icon} />
              </div>

              <h3
                className="
                  m-0 mb-2
                  text-[1.02rem] font-bold
                  tracking-[-0.005em]
                  text-card-foreground
                "
              >
                {card.title}
              </h3>

              <p
                className="
                  m-0
                  text-[0.85rem]
                  leading-[1.45]
                  text-muted-foreground
                "
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}