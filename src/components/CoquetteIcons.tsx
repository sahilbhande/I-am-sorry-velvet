import type { SVGProps } from 'react';

export function CoquetteBowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 56" fill="none" aria-hidden="true" {...props}>
      {/* Ribbon tails */}
      <path
        d="M36 28L18 52L29 46L35 53L40 31Z"
        fill="#FF8FBD"
        stroke="#D94F91"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M44 28L62 52L51 46L45 53L40 31Z"
        fill="#FF8FBD"
        stroke="#D94F91"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left loop */}
      <path
        d="M37 25C29 10 10 8 8 22C6 34 25 36 37 28Z"
        fill="#F8C8DC"
        stroke="#D94F91"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 25C25 18 16 17 15 23"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Right loop */}
      <path
        d="M43 25C51 10 70 8 72 22C74 34 55 36 43 28Z"
        fill="#F8C8DC"
        stroke="#D94F91"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M48 25C55 18 64 17 65 23"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Center knot */}
      <rect
        x="34"
        y="20"
        width="12"
        height="13"
        rx="6"
        fill="#D94F91"
        stroke="#B53574"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function WaxHeartSeal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <circle cx="32" cy="32" r="29" fill="#D94F91" />
      <circle
        cx="32"
        cy="32"
        r="23"
        fill="#E664A3"
        stroke="#F8C8DC"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <path
        d="M32 43.5C32 43.5 18.5 35.2 18.5 26.2C18.5 22.1 21.7 19 25.5 19C28.1 19 30.4 20.4 32 22.7C33.6 20.4 35.9 19 38.5 19C42.3 19 45.5 22.1 45.5 26.2C45.5 35.2 32 43.5 32 43.5Z"
        fill="#FFF0F5"
      />
    </svg>
  );
}

export function TeddyEmblemIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <circle cx="13" cy="14" r="7" fill="#E8C7A8" stroke="#70445C" strokeWidth="2" />
      <circle cx="13" cy="14" r="3.4" fill="#F8C8DC" />
      <circle cx="35" cy="14" r="7" fill="#E8C7A8" stroke="#70445C" strokeWidth="2" />
      <circle cx="35" cy="14" r="3.4" fill="#F8C8DC" />
      <circle cx="24" cy="25" r="15" fill="#F3D9BF" stroke="#70445C" strokeWidth="2" />
      <ellipse cx="24" cy="29" rx="6.5" ry="5" fill="#FFF7F0" />
      <circle cx="19" cy="22" r="2" fill="#70445C" />
      <circle cx="29" cy="22" r="2" fill="#70445C" />
      <circle cx="15" cy="26.5" r="2.2" fill="#FF8FBD" opacity="0.65" />
      <circle cx="33" cy="26.5" r="2.2" fill="#FF8FBD" opacity="0.65" />
      <ellipse cx="24" cy="27.2" rx="2.4" ry="1.8" fill="#70445C" />
      <path
        d="M21.8 30.2C22.8 31.6 25.2 31.6 26.2 30.2"
        stroke="#70445C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LaceDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-[#E49ABF] ${className}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F4B9D4] to-[#F4B9D4]" />
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#F4B9D4] to-[#F4B9D4]" />
    </div>
  );
}
