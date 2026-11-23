import React, { useState } from 'react';
import { LOGO_SRC } from '../data/bookletPages';

export const NasmatLogoMark = ({
  size = 'md',
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const dims =
    size === 'xs'
      ? 'w-11 h-7 rounded-md px-1 py-0.5'
      : size === 'sm'
      ? 'w-14 h-9 rounded-lg px-1.5 py-0.5'
      : size === 'lg'
      ? 'w-56 h-32 rounded-2xl px-4 py-2'
      : 'w-40 h-24 rounded-xl px-3 py-1.5';

  if (imgFailed) {
    return (
      <div
        className={`${dims} bg-[#FFF7E9] border border-[#7CC9B6]/60 flex items-center justify-center text-[#0F4C5C] font-heading font-bold ${className}`}
      >
        <span className={size === 'lg' ? 'text-2xl' : 'text-xs'}>نسمة حياة</span>
      </div>
    );
  }

  return (
    <div
      className={`${dims} bg-[#FCF7ED] border border-[#7CC9B6]/50 flex items-center justify-center overflow-hidden shadow-xs shrink-0 ${className}`}
    >
      <img
        src={LOGO_SRC}
        alt="شعار مبادرة نسمة حياة"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export const WaveBreezeDivider = ({
  color = '#7CC9B6',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 120 14"
    fill="none"
    aria-hidden="true"
    className={`w-24 h-3 ${className}`}
  >
    <path
      d="M2 5.5C18 1.5 34 9.5 50 5.5C66 1.5 82 9.5 98 5.5C106 3.5 113 4.5 118 6"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M12 10.5C26 7.5 40 13 54 10.5C68 8 82 13 96 10.5C102 9.5 107 10 111 11"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
  </svg>
);

export const BrushStrokeUnderline = ({
  color = '#FF8A65',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 160 12"
    fill="none"
    aria-hidden="true"
    className={`w-32 h-2.5 ${className}`}
  >
    <path
      d="M3 8.5C38 3.5 96 2.5 157 6.5"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeOpacity="0.45"
    />
    <path
      d="M12 9.5C52 6 105 5.5 148 8.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
  </svg>
);

export const BotanicalLeaves = ({
  color = '#2E7D32',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 40 28"
    fill="none"
    aria-hidden="true"
    className={`w-8 h-6 ${className}`}
  >
    <path
      d="M20 25C20 17 21 10 29 4C29 12 26 19 20 25Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M20 25C15 19 10 15 4 13C10 11 16 14 20 25Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M20 26V17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SunHorizonIcon = ({
  color = '#FFC857',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 44 26"
    fill="none"
    aria-hidden="true"
    className={`w-9 h-5 ${className}`}
  >
    <path
      d="M11 21C11 14.925 15.925 10 22 10C28.075 10 33 14.925 33 21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M22 2V5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.5 7.5L12 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M34.5 7.5L32 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 21H40" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.65" />
  </svg>
);
