'use client';

import React from 'react';

/**
 * Six bespoke line marks, one per principle.
 * Each one draws itself in on scroll (stroke-dashoffset) and performs a small
 * gesture when its row goes active — the gesture *is* the meaning of the
 * principle, not a generic wiggle.
 *
 * Pure CSS transitions, no animation library, no icon dependency.
 */

export type MarkId = 'simple' | 'local' | 'connected' | 'fair' | 'better' | 'longrun';

const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DRAW = 640; // ms — stroke draw-in
const GEST = 560; // ms — active gesture

type Props = {
  id: MarkId;
  revealed: boolean;
  active: boolean;
  reduced: boolean;
  /** ms offset so each row's mark draws slightly after the one above it */
  delay?: number;
};

export function FeatureMark({ id, revealed, active, reduced, delay = 0 }: Props) {
  const on = active && !reduced;

  /**
   * i           — draw order within the mark
   * extra       — per-shape overrides (transform, transform-origin, …)
   * gestDelay   — stagger for the active gesture only
   */
  const s = (i: number, extra?: React.CSSProperties, gestDelay = 0): React.CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: revealed || reduced ? 0 : 1,
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transitionProperty: 'stroke-dashoffset, transform, opacity',
    transitionDuration: reduced ? '0ms' : `${DRAW}ms, ${GEST}ms, 380ms`,
    transitionTimingFunction: EASE_CSS,
    transitionDelay: reduced ? '0ms' : `${delay + i * 80}ms, ${gestDelay}ms, 0ms`,
    ...extra,
  });

  const groupTransition: React.CSSProperties = {
    transitionProperty: 'transform',
    transitionDuration: reduced ? '0ms' : `${GEST}ms`,
    transitionTimingFunction: EASE_CSS,
  };

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-full w-full"
    >
      {/* Simple by default — three rules collapse toward one */}
      {id === 'simple' && (
        <>
          <path pathLength={1} d="M7 10h18" style={s(0, { transform: on ? 'scaleX(0.5)' : 'scaleX(1)' })} />
          <path pathLength={1} d="M7 16h18" style={s(1)} />
          <path pathLength={1} d="M7 22h18" style={s(2, { transform: on ? 'scaleX(0.26)' : 'scaleX(1)' }, 70)} />
        </>
      )}

      {/* Made for Cambodia — tiered spire, lifts on its base */}
      {id === 'local' && (
        <g style={{ ...groupTransition, transform: on ? 'translateY(-1.5px)' : 'none' }}>
          <path pathLength={1} d="M16 4v4.5" style={s(0)} />
          <path pathLength={1} d="M10 13.5l6-5 6 5" style={s(1)} />
          <path pathLength={1} d="M6.5 20.5L16 12.5l9.5 8" style={s(2)} />
          <path pathLength={1} d="M4 27h24" style={s(3)} />
        </g>
      )}

      {/* One connected system — hub pulls its nodes in */}
      {id === 'connected' && (
        <>
          <path pathLength={1} d="M16 16L8 9.5M16 16l8.5-6.5M16 16v9.5" style={s(0)} />
          <circle pathLength={1} cx="16" cy="16" r="3.2" style={s(1, { transform: on ? 'scale(1.24)' : 'scale(1)' })} />
          <circle pathLength={1} cx="8" cy="9.5" r="2" style={s(2, { transform: on ? 'translate(1.4px, 1.1px)' : 'none' }, 60)} />
          <circle pathLength={1} cx="24.5" cy="9.5" r="2" style={s(2, { transform: on ? 'translate(-1.4px, 1.1px)' : 'none' }, 90)} />
          <circle pathLength={1} cx="16" cy="25.5" r="2" style={s(2, { transform: on ? 'translateY(-1.6px)' : 'none' }, 120)} />
        </>
      )}

      {/* Fair and affordable — the scales come level */}
      {id === 'fair' && (
        <>
          <path pathLength={1} d="M16 10v15" style={s(0)} />
          <path pathLength={1} d="M11 25.5h10" style={s(1)} />
          <g
            style={{
              ...groupTransition,
              transformBox: 'view-box',
              transformOrigin: '16px 10px',
              transform: on ? 'rotate(0deg)' : 'rotate(-9deg)',
            }}
          >
            <path pathLength={1} d="M5 10h22" style={s(2)} />
            <path pathLength={1} d="M7 10v4.5M3.5 14.5h7" style={s(3)} />
            <path pathLength={1} d="M25 10v4.5M21.5 14.5h7" style={s(3)} />
          </g>
        </>
      )}

      {/* Better every week — each bar grows a step higher */}
      {id === 'better' && (
        <>
          <path pathLength={1} d="M6.5 25.5v-4.5" style={s(0, { transform: on ? 'scaleY(1.5)' : 'none', transformOrigin: 'bottom' })} />
          <path pathLength={1} d="M13 25.5v-8" style={s(1, { transform: on ? 'scaleY(1.35)' : 'none', transformOrigin: 'bottom' }, 60)} />
          <path pathLength={1} d="M19.5 25.5v-11.5" style={s(2, { transform: on ? 'scaleY(1.24)' : 'none', transformOrigin: 'bottom' }, 120)} />
          <path pathLength={1} d="M26 25.5v-15" style={s(3, { transform: on ? 'scaleY(1.16)' : 'none', transformOrigin: 'bottom' }, 180)} />
        </>
      )}

      {/* Here for the long run — a segment runs the loop, and keeps going */}
      {id === 'longrun' && (
        <>
          <path
            pathLength={1}
            d="M16 16C16 11 19 8.2 22 8.2C25.5 8.2 28 11.6 28 16C28 20.4 25.5 23.8 22 23.8C19 23.8 16 21 16 16C16 11 13 8.2 10 8.2C6.5 8.2 4 11.6 4 16C4 20.4 6.5 23.8 10 23.8C13 23.8 16 21 16 16Z"
            style={s(0, { opacity: on ? 0.35 : 1 })}
          />
          <path
            pathLength={1}
            d="M16 16C16 11 19 8.2 22 8.2C25.5 8.2 28 11.6 28 16C28 20.4 25.5 23.8 22 23.8C19 23.8 16 21 16 16C16 11 13 8.2 10 8.2C6.5 8.2 4 11.6 4 16C4 20.4 6.5 23.8 10 23.8C13 23.8 16 21 16 16Z"
            style={{
              strokeDasharray: '0.2 0.8',
              strokeDashoffset: on ? -2 : 0,
              opacity: on ? 1 : 0,
              transitionProperty: 'stroke-dashoffset, opacity',
              transitionDuration: reduced ? '0ms' : '3200ms, 320ms',
              transitionTimingFunction: 'linear, ease',
            }}
          />
        </>
      )}
    </svg>
  );
}