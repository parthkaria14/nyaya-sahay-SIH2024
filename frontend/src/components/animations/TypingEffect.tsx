import { motion } from 'framer-motion';

export function TypingEffect({ text, className }) {
  // Create an array of letters from the text
  const letters = text.split('');

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: index * 0.05, // Typing speed
            duration: 0.1, // Duration for each character
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
