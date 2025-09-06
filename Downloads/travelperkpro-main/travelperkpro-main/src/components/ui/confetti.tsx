import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  useEffect(() => {
    if (trigger) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['hsl(178, 100%, 50%)', 'hsl(285, 100%, 50%)', 'hsl(86, 84%, 52%)']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['hsl(178, 100%, 50%)', 'hsl(285, 100%, 50%)', 'hsl(86, 84%, 52%)']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else if (onComplete) {
          onComplete();
        }
      };

      frame();
    }
  }, [trigger, onComplete]);

  return null;
};