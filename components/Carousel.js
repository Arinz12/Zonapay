import React, { useState, useEffect, useRef } from 'react';

const Carousel2 = ({ 
  children, 
  autoRotate = true, 
  interval = 3000,
  showIndicators = true,
  slideHeight = 95,
  bgColor = 'white',
  activeIndicatorColor = 'blue'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const trackRef = useRef(null);
  const slides = React.Children.toArray(children);
  const intervalRef = useRef(null);

  // Handle auto rotation
  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        goToSlide((currentIndex + 1) % slides.length);
      }, interval);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRotate, interval, currentIndex, slides.length]);

  // Update carousel position
  useEffect(() => {
    setTrackPosition();
  }, [currentIndex]);

  const setTrackPosition = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  };

  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    else if (index >= slides.length) index = 0;
    setCurrentIndex(index);
  };

  // Touch/pointer event handlers
  const handleTouchStart = (e) => {
    if (autoRotate) clearInterval(intervalRef.current);
    setIsDragging(true);
    setStartX(getPositionX(e));
    setPrevTranslate(currentIndex * -100);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diffX = currentX - startX;
    const newTranslate = prevTranslate + (diffX / window.innerWidth) * 100;
    setCurrentTranslate(newTranslate);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${newTranslate}%)`;
      trackRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -10) goToSlide(currentIndex + 1);
    else if (movedBy > 10) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.5s ease-in-out';
    }
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        goToSlide((currentIndex + 1) % slides.length);
      }, interval);
    }
  };

  const getPositionX = (e) => {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  };

  return (
    <div  className="w-full overflow-hidden relative">
      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="flex"
        style={{
          height: `${slideHeight}px`,
          transition: isDragging ? 'none' : 'transform 0.5s ease-in-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="flex-shrink-0 flex justify-center items-center rounded-xl font-bold"
            style={{
              width: '90%',
              height: '100%',
              margin: '0 5%',
              color: '#333',
              backgroundColor: bgColor,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Indicators - Conditionally rendered */}
      {showIndicators && (
        <div className="flex justify-center mt-5">
          {slides.map((_, index) => (
            <button
              key={index}
              style={{
                width: '3px',
                height: '3px',
                backgroundColor: index === currentIndex ? activeIndicatorColor : '#ccc'
              }}
              className="rounded-full mx-1 cursor-pointer"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel2;