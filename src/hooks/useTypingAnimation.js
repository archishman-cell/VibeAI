import { useState, useEffect } from 'react';

/**
 * Custom hook for typing animation effect
 * @param {string} text - The text to animate
 * @param {number} speed - Typing speed in milliseconds
 * @returns {string} - The animated text
 */
export const useTypingAnimation = (text, speed = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, speed]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return displayedText;
};
