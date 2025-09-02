import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SliderIcon } from './icons/SliderIcon';
import { useTranslation } from '../i18n/config';

interface ImageComparatorProps {
  beforeSrc: string;
  afterSrc: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ beforeSrc, afterSrc }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    // Allow clicking anywhere to move the slider
    if ('clientX' in e) {
      handleMove(e.clientX);
    } else if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };
  
  useEffect(() => {
    const handleInteractionMove = (clientX: number) => {
        if (!isDragging) return;
        handleMove(clientX);
    };

    const handleMouseMove = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) handleInteractionMove(e.touches[0].clientX);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchend', handleInteractionEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleMove, handleInteractionEnd]);


  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full select-none bg-gray-900 cursor-ew-resize"
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      {/* Base image dictates the component's dimensions and aspect ratio */}
      <img 
        src={beforeSrc} 
        alt={t('display.original')} 
        className="block w-full h-full object-cover pointer-events-none" 
        draggable="false"
      />
      
      {/* Clipped "after" image container, positioned perfectly over the base image */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
         <img 
            src={afterSrc} 
            alt={t('display.remodeled')} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
            draggable="false"
         />
      </div>

      {/* Slider handle visual */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white group pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 h-10 w-10 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
        >
          <SliderIcon className="w-6 h-6" />
        </div>
      </div>

       <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md pointer-events-none">{t('display.original')}</div>
       <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md pointer-events-none" style={{ opacity: sliderPosition > 60 ? 1 : 0, transition: 'opacity 0.3s' }}>{t('display.remodeled')}</div>
    </div>
  );
};