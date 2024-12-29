import React, { useState, useEffect } from "react";

const FloatingAnimation = ({
  emoji = "📚", // Default emoji
  count = 20, // Number of floating elements
  duration = { min: 1.5, max: 3 }, // Faster animation duration (was 3-6)
  delay = { max: 1 }, // Shorter delay (was 2)
  cycleLength = 4000, // Shorter cycle (was 8000)
  size = "text-4xl", // Size class for the emoji
}) => {
  const [elements, setElements] = useState([]);

  const randomPosition = () => Math.random() * 100;
  const randomDuration = () =>
    Math.random() * (duration.max - duration.min) + duration.min;
  const randomDelay = () => Math.random() * delay.max;

  const createElements = () =>
    Array.from({ length: count }, (_, index) => ({
      id: index + Date.now(),
      left: randomPosition(),
      duration: randomDuration(),
      delay: randomDelay(),
    }));

  useEffect(() => {
    setElements(createElements());

    const interval = setInterval(() => {
      setElements(createElements());
    }, cycleLength);

    return () => clearInterval(interval);
  }, [count, cycleLength]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute ${size}`}
          style={{
            left: `${element.left}%`,
            bottom: "-10%",
            animation: `float ${element.duration}s linear ${element.delay}s forwards`,
            zIndex: 50,
          }}
        >
          {emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingAnimation;
