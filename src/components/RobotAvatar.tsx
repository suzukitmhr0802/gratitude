import { motion } from 'motion/react';

interface RobotAvatarProps {
  mood?: 'neutral' | 'happy' | 'reflecting';
  size?: 'sm' | 'md' | 'lg';
}

export function RobotAvatar({ mood = 'neutral', size = 'md' }: RobotAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }[size];

  return (
    <motion.div
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${sizeClasses}`}
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        <motion.circle
          cx="50"
          cy="8"
          r="6"
          fill="#34d399"
          animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Ears */}
        <rect x="14" y="38" width="6" height="16" rx="3" fill="#059669" />
        <rect x="80" y="38" width="6" height="16" rx="3" fill="#059669" />

        {/* Head */}
        <rect
          x="20"
          y="20"
          width="60"
          height="52"
          rx="18"
          fill="#ecfdf5"
          stroke="#10b981"
          strokeWidth="3.5"
        />

        {/* Screen/Faceplate */}
        <rect
          x="28"
          y="28"
          width="44"
          height="36"
          rx="10"
          fill="#064e3b"
        />

        {/* Cheeks */}
        <circle cx="34" cy="53" r="3" fill="#f43f5e" opacity="0.75" />
        <circle cx="66" cy="53" r="3" fill="#f43f5e" opacity="0.75" />

        {/* Eyes based on mood */}
        {mood === 'happy' ? (
          <>
            {/* Happy arch eyes ^ ^ */}
            <path
              d="M 36 43 Q 41 36 46 43"
              stroke="#34d399"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 54 43 Q 59 36 64 43"
              stroke="#34d399"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Smile mouth */}
            <path
              d="M 46 52 Q 50 56 54 52"
              stroke="#6ee7b7"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : mood === 'reflecting' ? (
          <>
            {/* Gentle calm eyes */}
            <circle cx="41" cy="42" r="3.5" fill="#a7f3d0" />
            <circle cx="59" cy="42" r="3.5" fill="#a7f3d0" />
            {/* Gentle serene smile */}
            <path
              d="M 47 51 Q 50 54 53 51"
              stroke="#6ee7b7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Neutral friendly blinking eyes */}
            <motion.ellipse
              cx="41"
              cy="42"
              rx="3.5"
              ry="4"
              fill="#34d399"
              animate={{
                scaleY: [1, 1, 0.1, 1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.9, 0.93, 0.96, 1],
              }}
            />
            <motion.ellipse
              cx="59"
              cy="42"
              rx="3.5"
              ry="4"
              fill="#34d399"
              animate={{
                scaleY: [1, 1, 0.1, 1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.9, 0.93, 0.96, 1],
              }}
            />
            {/* Gentle smile */}
            <path
              d="M 46 51 Q 50 54 54 51"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
