import React from 'react';

const SAGE_GRADIENT = 'linear-gradient(180deg, #A0B092 0%, #7E8F6E 55%, #627254 100%)';
const PINK_GRADIENT = 'linear-gradient(180deg, #F4B6C6 0%, #E58FA6 55%, #C9677F 100%)';

function MaskShape({ src, gradient, style, className = '' }: {
  src: string;
  gradient: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: gradient,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        ...style,
      }}
    />
  );
}

/** Small pink lotus flourish shown above section headings. Pass alignment (e.g. mx-auto) via className. */
export function LotusDivider({ className = '' }: { className?: string }) {
  return (
    <MaskShape
      src="/lotus-flourish.svg"
      gradient={PINK_GRADIENT}
      className={className}
      style={{ width: 'min(44vw, 170px)', height: 'min(16vw, 62px)' }}
    />
  );
}

/** Faint, slowly turning sage mandala behind a section. Parent must be `relative overflow-hidden`. */
export function MandalaBackdrop({ position = 'center' }: { position?: 'center' | 'left' | 'right' }) {
  const place =
    position === 'left'
      ? 'left-0 -translate-x-1/2'
      : position === 'right'
        ? 'right-0 translate-x-1/2'
        : 'left-1/2 -translate-x-1/2';
  return (
    <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${place} w-[min(140vw,820px)] h-[min(140vw,820px)] opacity-[0.07] z-0`}>
      <MaskShape src="/mandala.svg" gradient={SAGE_GRADIENT} className="w-full h-full mandala-spin" />
    </div>
  );
}
