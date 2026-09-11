import React from 'react';

interface CatLogoProps {
  size?: number;
  className?: string;
}

export const CatLogo: React.FC<CatLogoProps> = ({ size = 130, className }) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Background Soft Aura Ring */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.15,
          height: size * 1.15,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.12) 0%, rgba(59, 130, 246, 0.05) 70%, transparent 100%)',
          zIndex: 0,
        }}
      />

      {/* SVG Maneki-Neko (Japanese Lucky Beckoning Cat) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 16px rgba(234, 88, 12, 0.18))' }}
      >
        {/* Cat Body (Shiro - Pure White) */}
        <ellipse cx="100" cy="135" rx="58" ry="50" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />

        {/* Orenji (Orange) Calico Patch on Body */}
        <path
          d="M135 110 C145 125, 155 145, 142 165 C132 178, 118 180, 115 180 C135 170, 150 150, 145 125 Z"
          fill="#EA580C"
        />

        {/* Cat Head */}
        <circle cx="100" cy="85" r="48" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />

        {/* Right Calico Patch on Head */}
        <path
          d="M115 42 C125 40, 142 50, 145 70 C147 85, 138 98, 130 102 C135 85, 130 65, 115 42 Z"
          fill="#EA580C"
        />

        {/* Left Ear */}
        <path
          d="M62 60 L45 22 C43 18, 50 14, 55 18 L80 44 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Left Inner Ear (Pink) */}
        <path d="M60 52 L50 28 L72 43 Z" fill="#FCA5A5" />

        {/* Right Ear */}
        <path
          d="M138 60 L155 22 C157 18, 150 14, 145 18 L120 44 Z"
          fill="#EA580C"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Right Inner Ear (Pink) */}
        <path d="M140 52 L150 28 L128 43 Z" fill="#FCA5A5" />

        {/* Red Collar */}
        <path
          d="M68 116 C80 125, 120 125, 132 116 C134 122, 130 128, 100 130 C70 128, 66 122, 68 116 Z"
          fill="#DC2626"
          stroke="#0F172A"
          strokeWidth="3"
        />

        {/* Golden Bell on Collar */}
        <circle cx="100" cy="128" r="9" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
        <circle cx="100" cy="129" r="2.5" fill="#B45309" />
        <line x1="93" y1="127" x2="107" y2="127" stroke="#B45309" strokeWidth="2" />

        {/* Smiling Eyes (Happy Closed Eyes ^ ^) */}
        <path
          d="M74 80 C78 74, 86 74, 90 80"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M110 80 C114 74, 122 74, 126 80"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cute Pink Cheeks */}
        <ellipse cx="68" cy="88" rx="7" ry="4" fill="#FECACA" />
        <ellipse cx="132" cy="88" rx="7" ry="4" fill="#FECACA" />

        {/* Nose & Mouth */}
        <path d="M98 87 L102 87 L100 90 Z" fill="#F43F5E" />
        <path
          d="M94 93 C97 96, 100 96, 100 93 C100 96, 103 96, 106 93"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Whiskers (Left & Right) */}
        <line x1="52" y1="84" x2="32" y2="80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="91" x2="30" y2="92" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="148" y1="84" x2="168" y2="80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="150" y1="91" x2="170" y2="92" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

        {/* Beckoning Left Paw (Raised with Paw Pads) - Rotated 180 vertical */}
        <g style={{ transformOrigin: '55px 110px', animation: 'beckonPaw 2.4s ease-in-out infinite' }}>
          <ellipse cx="52" cy="98" rx="14" ry="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
          {/* Paw pads (Pink): Toe beans at top, main palm pad at bottom */}
          <ellipse cx="52" cy="103" rx="6.5" ry="5" fill="#FDA4AF" />
          <circle cx="45" cy="93" r="2.5" fill="#FDA4AF" />
          <circle cx="52" cy="91" r="2.5" fill="#FDA4AF" />
          <circle cx="59" cy="93" r="2.5" fill="#FDA4AF" />
        </g>

        {/* Right Arm Holding Golden Koban Coin */}
        <ellipse cx="140" cy="130" rx="12" ry="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
        {/* Golden Koban Coin (開運 - Good Fortune) with text centered and shifted right */}
        <g transform="rotate(6 131 145)">
          <rect
            x="117"
            y="125"
            width="28"
            height="40"
            rx="12"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="2.5"
          />
          <text
            x="131"
            y="142"
            fontSize="10"
            fontWeight="800"
            fill="#78350F"
            textAnchor="middle"
            fontFamily="'Noto Sans JP', sans-serif"
          >
            開運
          </text>
          <text
            x="131"
            y="156"
            fontSize="8.5"
            fontWeight="700"
            fill="#78350F"
            textAnchor="middle"
            fontFamily="'Noto Sans JP', sans-serif"
          >
            日本
          </text>
        </g>

        {/* Lower Paws */}
        <ellipse cx="78" cy="178" rx="14" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
        <ellipse cx="122" cy="178" rx="14" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
      </svg>

      <style>{`
        @keyframes beckonPaw {
          0%, 100% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(-12deg);
          }
          50% {
            transform: rotate(6deg);
          }
          70% {
            transform: rotate(-8deg);
          }
        }
      `}</style>
    </div>
  );
};
