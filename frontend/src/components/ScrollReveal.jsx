import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, direction = 'up', delay = 0, duration = 0.8, style = {} }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getDirectionStyles = () => {
    switch (direction) {
      case 'left':
        return {
          transform: isIntersecting ? 'translateX(0)' : 'translateX(-60px)',
          opacity: isIntersecting ? 1 : 0
        };
      case 'right':
        return {
          transform: isIntersecting ? 'translateX(0)' : 'translateX(60px)',
          opacity: isIntersecting ? 1 : 0
        };
      case 'down':
        return {
          transform: isIntersecting ? 'translateY(0)' : 'translateY(-60px)',
          opacity: isIntersecting ? 1 : 0
        };
      case 'up':
      default:
        return {
          transform: isIntersecting ? 'translateY(0)' : 'translateY(60px)',
          opacity: isIntersecting ? 1 : 0
        };
    }
  };

  const baseStyle = {
    transition: `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s, opacity ${duration}s ease-out ${delay}s`,
    willChange: 'transform, opacity',
    ...getDirectionStyles(),
    ...style,
  };

  return (
    <div ref={ref} style={baseStyle}>
      {children}
    </div>
  );
};

export default ScrollReveal;
