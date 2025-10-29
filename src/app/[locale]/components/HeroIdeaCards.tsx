'use client';

import { motion } from 'framer-motion';

interface IdeaCard {
  emoji: string;
  text: string;
  top?: string;
  left?: string;
  right?: string;
  rotate?: string;
  delay?: number;
}

interface HeroIdeaCardsProps {
  cards?: IdeaCard[];
}

const DEFAULT_CARDS: IdeaCard[] = [
  // Left side cards
  { 
    emoji: '', 
    text: 'Makeup artist in Casablanca for the bridal morning.',
    top: '-5%',
    left: '-280px',
    rotate: '-3deg',
    delay: 0
  },
  { 
    emoji: '', 
    text: 'Garden venue in Marrakech for 150 guests.',
    top: '35%',
    left: '-320px',
    rotate: '2deg',
    delay: 0.6
  },
  { 
    emoji: '', 
    text: 'DJ + violin duo for a chic reception.',
    top: '80%',
    left: '-290px',
    rotate: '-2deg',
    delay: 1.2
  },
  // Right side cards
  { 
    emoji: '', 
    text: 'Moroccan catering with live stations in Rabat.',
    top: '10%',
    right: '-310px',
    rotate: '3deg',
    delay: 0.3
  },
  { 
    emoji: '', 
    text: 'Outdoor photographer for golden-hour portraits.',
    top: '45%',
    right: '-280px',
    rotate: '-2deg',
    delay: 0.9
  },
  { 
    emoji: '', 
    text: 'Takchita designer with custom fittings in Fès.',
    top: '75%',
    right: '-320px',
    rotate: '2deg',
    delay: 1.5
  },
];

export default function HeroIdeaCards({ 
  cards = DEFAULT_CARDS
}: HeroIdeaCardsProps) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0 hidden md:block"
      aria-hidden="true"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: card.delay || index * 0.15, duration: 0.5, ease: 'easeOut' }}
          whileHover={{ 
            scale: 1.03, 
            rotate: '0deg',
            transition: { duration: 0.2 } 
          }}
          className={`
            absolute rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] 
            border border-black/5 px-4 py-3 max-w-[240px]
            animate-float
            ${index >= 4 ? 'hidden lg:block' : ''}
          `}
          style={{
            top: card.top,
            left: card.left,
            right: card.right,
            transform: `rotate(${card.rotate})`,
            animationDelay: `${(card.delay || 0) * 2}s`,
          }}
        >
          <p className="text-[14px] leading-snug text-neutral-700">
            {card.emoji && <span className="mr-2">{card.emoji}</span>}
            {card.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

