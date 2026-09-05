export function IconPeople({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
      <path d="M15.5 20c0-2.6 1.6-4.8 3.9-5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IconBuilding({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="11" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="15" y="9" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
      <path d="M7 7h1.5M11 7h1.5M7 11h1.5M11 11h1.5M7 15h1.5M11 15h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17.5 12.5h1.5M17.5 16h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function IconClipboard({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" fill="currentColor" opacity="0.8" />
      <path d="M8.5 11.5l2 2 4-4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 16.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IconTrophy({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M14 8h20v10a10 10 0 0 1-20 0V8z" fill="url(#trophyGrad)" stroke="#40a4db" strokeWidth="1.5" />
      <path d="M14 10H8a2 2 0 0 0-2 2v2a6 6 0 0 0 6 6" stroke="#40a4db" strokeWidth="1.5" />
      <path d="M34 10h6a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6" stroke="#40a4db" strokeWidth="1.5" />
      <rect x="21" y="28" width="6" height="6" fill="#40a4db" />
      <rect x="16" y="34" width="16" height="4" rx="1" fill="#40a4db" />
      <defs>
        <linearGradient id="trophyGrad" x1="14" y1="8" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6fc6ee" />
          <stop offset="1" stopColor="#2c7ba8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IconTarget({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke="#40a4db" strokeWidth="2" opacity="0.4" />
      <circle cx="24" cy="24" r="12" stroke="#40a4db" strokeWidth="2" opacity="0.7" />
      <circle cx="24" cy="24" r="6" fill="#40a4db" />
    </svg>
  );
}

export function IconQuizBlob({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <path
        d="M45 55 C60 20, 140 20, 155 55 C175 90, 170 140, 130 160 C95 178, 55 168, 35 135 C15 100, 25 90, 45 55 Z"
        fill="url(#blobGrad)"
        opacity="0.9"
      />
      <circle cx="80" cy="85" r="6" fill="#0a0e14" />
      <circle cx="120" cy="85" r="6" fill="#0a0e14" />
      <path d="M78 115c8 10 36 10 44 0" stroke="#0a0e14" strokeWidth="4" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="blobGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6fc6ee" />
          <stop offset="1" stopColor="#2c7ba8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
