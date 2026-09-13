import React from 'react';
import { CatLogo } from './CatLogo';

export interface CultureMascotProps {
  language: string;
  size?: number;
  className?: string;
}

export const KoreanTigerLogo: React.FC<{ size?: number; className?: string }> = ({ size = 130, className }) => {
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
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(220, 38, 38, 0.06) 70%, transparent 100%)',
          zIndex: 0,
        }}
      />
      {/* SVG Horangi (Korean Guardian Tiger) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 16px rgba(234, 88, 12, 0.2))' }}
      >
        {/* Tiger Body */}
        <ellipse cx="100" cy="138" rx="55" ry="48" fill="#FDBA74" stroke="#0F172A" strokeWidth="4" />
        {/* White Chest */}
        <ellipse cx="100" cy="144" rx="34" ry="32" fill="#FFFFFF" />
        {/* Body Tiger Stripes */}
        <path d="M50 135 L68 138 L50 144 Z" fill="#0F172A" />
        <path d="M150 135 L132 138 L150 144 Z" fill="#0F172A" />
        <path d="M52 152 L70 154 L52 159 Z" fill="#0F172A" />
        <path d="M148 152 L130 154 L148 159 Z" fill="#0F172A" />

        {/* Tiger Ears */}
        <circle cx="58" cy="52" r="22" fill="#FDBA74" stroke="#0F172A" strokeWidth="4" />
        <circle cx="58" cy="52" r="13" fill="#FCA5A5" />
        <circle cx="142" cy="52" r="22" fill="#FDBA74" stroke="#0F172A" strokeWidth="4" />
        <circle cx="142" cy="52" r="13" fill="#FCA5A5" />

        {/* Head */}
        <circle cx="100" cy="90" r="48" fill="#FB923C" stroke="#0F172A" strokeWidth="4" />

        {/* Forehead Wang (King / 왕) Mark */}
        <path d="M88 62 H112 M100 62 V76 M90 69 H110 M88 76 H112" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />

        {/* Cheeks Stripes */}
        <path d="M58 84 L72 87 L58 91 Z" fill="#0F172A" />
        <path d="M142 84 L128 87 L142 91 Z" fill="#0F172A" />
        <path d="M59 97 L74 99 L59 103 Z" fill="#0F172A" />
        <path d="M141 97 L126 99 L141 103 Z" fill="#0F172A" />

        {/* White Muzzle */}
        <ellipse cx="89" cy="103" rx="14" ry="11" fill="#FFFFFF" />
        <ellipse cx="111" cy="103" rx="14" ry="11" fill="#FFFFFF" />

        {/* Nose */}
        <path d="M94 95 Q100 92 106 95 L102 101 Q100 102 98 101 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />

        {/* Friendly Mouth */}
        <path d="M92 104 Q96 109 100 105 Q104 109 108 104" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cute Eyes */}
        <ellipse cx="80" cy="86" rx="6.5" ry="7.5" fill="#0F172A" />
        <circle cx="82.5" cy="83.5" r="2.5" fill="#FFFFFF" />
        <ellipse cx="120" cy="86" rx="6.5" ry="7.5" fill="#0F172A" />
        <circle cx="122.5" cy="83.5" r="2.5" fill="#FFFFFF" />

        {/* Whiskers */}
        <path d="M66 102 L50 99 M66 106 L48 107 M66 110 L52 115" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        <path d="M134 102 L150 99 M134 106 L152 107 M134 110 L148 115" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

        {/* Korean Bokjumeoni (Lucky Pouch) around neck */}
        <ellipse cx="100" cy="146" rx="20" ry="18" fill="#DC2626" stroke="#0F172A" strokeWidth="3" />
        <path d="M92 130 Q100 134 108 130 L104 135 Q100 133 96 135 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
        <circle cx="100" cy="146" r="8" fill="#FBBF24" />
        <text x="100" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0F172A">福</text>
        {/* Pouch Tassels */}
        <path d="M96 164 L94 174 M104 164 L106 174" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const SpanishFiestaLogo: React.FC<{ size?: number; className?: string }> = ({ size = 130, className }) => {
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
      <div
        style={{
          position: 'absolute',
          width: size * 1.15,
          height: size * 1.15,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.18) 0%, rgba(245, 158, 11, 0.08) 70%, transparent 100%)',
          zIndex: 0,
        }}
      />
      {/* SVG Fiesta Sun & Bull Motif */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 16px rgba(234, 88, 12, 0.2))' }}
      >
        {/* Sun Rays */}
        <g stroke="#F59E0B" strokeWidth="5" strokeLinecap="round">
          <line x1="100" y1="14" x2="100" y2="28" />
          <line x1="100" y1="172" x2="100" y2="186" />
          <line x1="14" y1="100" x2="28" y2="100" />
          <line x1="172" y1="100" x2="186" y2="100" />
          <line x1="39" y1="39" x2="49" y2="49" />
          <line x1="151" y1="151" x2="161" y2="161" />
          <line x1="151" y1="49" x2="161" y2="39" />
          <line x1="39" y1="161" x2="49" y2="151" />
        </g>
        {/* Radiant Corona */}
        <circle cx="100" cy="100" r="64" fill="#FBBF24" stroke="#0F172A" strokeWidth="4" />
        <circle cx="100" cy="100" r="54" fill="#EA580C" opacity="0.15" />

        {/* Friendly Cordobés Hat */}
        <path d="M60 62 C60 52, 140 52, 140 62 L132 68 H68 Z" fill="#0F172A" />
        <rect x="52" y="66" width="96" height="7" rx="3.5" fill="#0F172A" />
        <rect x="70" y="62" width="60" height="4" fill="#EF4444" />

        {/* Friendly Face / Horns */}
        <path d="M68 85 C62 76, 56 65, 52 50 C58 54, 66 64, 70 75 Z" fill="#0F172A" />
        <path d="M132 85 C138 76, 144 65, 148 50 C142 54, 134 64, 130 75 Z" fill="#0F172A" />

        {/* Cheerful Eyes */}
        <ellipse cx="82" cy="102" rx="7" ry="8" fill="#0F172A" />
        <circle cx="84" cy="99" r="2.5" fill="#FFFFFF" />
        <ellipse cx="118" cy="102" rx="7" ry="8" fill="#0F172A" />
        <circle cx="120" cy="99" r="2.5" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="73" cy="112" rx="7" ry="4.5" fill="#F87171" opacity="0.6" />
        <ellipse cx="127" cy="112" rx="7" ry="4.5" fill="#F87171" opacity="0.6" />

        {/* Fiesta Smile */}
        <path d="M88 116 Q100 130 112 116" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Spanish Flag Heart Ribbon */}
        <g transform="translate(86, 132)">
          <path d="M14 8 C14 3, 22 3, 24 8 C26 13, 14 20, 14 20 C14 20, 2 13, 4 8 C6 3, 14 3, 14 8 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M9 7 H19 V13 H9 Z" fill="#FBBF24" />
        </g>
      </svg>
    </div>
  );
};

export const FrenchRoosterLogo: React.FC<{ size?: number; className?: string }> = ({ size = 130, className }) => {
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
      <div
        style={{
          position: 'absolute',
          width: size * 1.15,
          height: size * 1.15,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(239, 68, 68, 0.08) 70%, transparent 100%)',
          zIndex: 0,
        }}
      />
      {/* SVG Le Coq Gaulois (French Gallic Rooster) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 16px rgba(37, 99, 235, 0.18))' }}
      >
        {/* Plume Tail (Bleu, Blanc, Rouge) */}
        <path d="M50 140 C35 115, 30 80, 55 60 C52 75, 55 95, 66 110 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="2.5" />
        <path d="M60 145 C45 125, 42 95, 65 75 C64 90, 68 110, 78 122 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        <path d="M70 150 C55 135, 54 110, 74 95 C75 110, 80 125, 88 135 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="2.5" />

        {/* Rooster Body (Crisp Cream White) */}
        <ellipse cx="115" cy="138" rx="46" ry="40" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />

        {/* Stylish Beret / Rooster Comb (Crête) */}
        <path
          d="M102 46 C96 32, 110 22, 118 30 C125 22, 138 24, 137 36 C145 32, 154 40, 146 52 Z"
          fill="#EF4444"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Head & Elegant Neck */}
        <path d="M100 130 C96 100, 106 65, 126 62 C146 65, 150 95, 146 130 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />

        {/* Beak & Wattle (Barbillon) */}
        <path d="M142 74 L162 80 L142 88 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
        <path d="M136 86 C136 96, 145 98, 142 86 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />

        {/* Cute Inquisitive Eye */}
        <circle cx="128" cy="74" r="6" fill="#0F172A" />
        <circle cx="130" cy="72" r="2" fill="#FFFFFF" />

        {/* French Tricolor Scarf / Bow */}
        <path d="M112 118 C122 124, 138 124, 146 118 L142 134 C132 138, 122 138, 114 134 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="2" />
        <rect x="124" y="120" width="8" height="15" fill="#FFFFFF" />
        <rect x="132" y="120" width="8" height="15" fill="#EF4444" />
      </svg>
    </div>
  );
};

export const CultureMascot: React.FC<CultureMascotProps> = ({ language, size = 130, className }) => {
  const norm = (language || '').toLowerCase().trim();

  if (norm.includes('korea')) {
    return <KoreanTigerLogo size={size} className={className} />;
  }
  if (norm.includes('span') || norm.includes('espa')) {
    return <SpanishFiestaLogo size={size} className={className} />;
  }
  if (norm.includes('fren') || norm.includes('fran')) {
    return <FrenchRoosterLogo size={size} className={className} />;
  }

  // Default to Japanese Maneki-Neko
  return <CatLogo size={size} className={className} />;
};
