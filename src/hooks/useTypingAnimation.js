import { useState, useEffect } from 'react';

/**
 * Custom hook for typing animation effect.
 * @param {string} text - The text to animate.
 * @param {number} speed - Typing speed in milliseconds.
 * @param {boolean} shouldStop - Flag to immediately stop the animation.
 * @returns {string} - The animated text.
 */
export const useTypingAnimation = (text, speed = 2, shouldStop = false) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to handle the typing animation
  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    // If shouldStop is true, just display the full text
    if (shouldStop) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, speed, shouldStop]);

  // Effect to reset the animation when the source text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return displayedText;
};