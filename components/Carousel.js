import React, { useState, useEffect, useRef } from 'react';

const Carousel2 = ({ children, autoRotate = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const slides = React.Children.toArray(children);
  const intervalRef = useRef(null);

  const updateCarousel = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    updateCarousel();
  }, [currentIndex]);

  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, interval, slides.length]);

  return (
    <div className="w-full overflow-hidden relative">
      {/* Carousel Track */}
      <div 
        ref={trackRef}
        className="flex"
        style={{
          height: '70px',
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="flex-shrink-0 flex justify-center items-center rounded-lg font-bold"
            style={{
              width: '80%',
              height: '70px',
              margin: '0 10%',
              color: 'white',
              background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Indicators */}
      <div className="flex justify-center mt-5">
        {slides.map((_, index) => (
          <button
            key={index}
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: index === currentIndex ? '#6e8efb' : '#ccc'
            }}
            className="rounded-full mx-1 cursor-pointer"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel2;