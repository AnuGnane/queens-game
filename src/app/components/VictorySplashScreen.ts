import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

interface VictorySplashScreenProps {
  isVisible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  time: string;
}

const VictorySplashScreen: React.FC<VictorySplashScreenProps> = ({ isVisible, onClose, onNewGame, time }) => {
  useEffect(() => {
    if (isVisible) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          zIndex: 100,
        });
        confetti({
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          zIndex: 100,
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return React.createElement(
    'div',
    { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" },
    React.createElement(
      'div',
      { className: "bg-white p-8 rounded-lg shadow-lg text-center" },
      React.createElement('h2', { className: "text-3xl font-bold mb-4" }, "Congratulations!"),
      React.createElement('p', { className: "text-xl mb-4" }, "You've solved the Advanced Queens Puzzle!"),
      React.createElement('p', { className: "text-lg mb-6" }, `Your time: ${time}`),
      React.createElement(
        'div',
        { className: "flex justify-center space-x-4" },
        React.createElement(Button, { onClick: onClose }, "Close"),
        React.createElement(Button, { onClick: onNewGame }, "New Game")
      )
    )
  );
};

export default VictorySplashScreen;