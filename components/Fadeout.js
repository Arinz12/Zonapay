// FadeOutComponent.js
import React, { useEffect, useRef, useState } from 'react';

const FadeOutComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`fade-out ${!isVisible ? 'fade-out-effect' : ''}`}>
      {children}
    </div>
  );
};

export default FadeOutComponent;
