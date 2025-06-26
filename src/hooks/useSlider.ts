import { useState, useRef, useCallback, useEffect } from "react";
import type { SliderState, SliderControls } from "@/types";

interface UseSliderOptions {
  slides: any[];
  autoPlayInterval?: number;
  pauseOnInteraction?: boolean;
  resumeDelay?: number;
}

export function useSlider({
  slides,
  autoPlayInterval = 5000,
  pauseOnInteraction = true,
  resumeDelay = 3000,
}: UseSliderOptions): SliderState & SliderControls {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const autoPlayRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Автопрокрутка
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const pauseAutoPlay = useCallback(() => {
    if (pauseOnInteraction) {
      setIsAutoPlaying(false);
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }
  }, [pauseOnInteraction]);

  const resumeAutoPlay = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, resumeDelay);
  }, [resumeDelay]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      pauseAutoPlay();
      resumeAutoPlay();
    },
    [pauseAutoPlay, resumeAutoPlay],
  );

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    pauseAutoPlay();
    resumeAutoPlay();
  }, [slides.length, pauseAutoPlay, resumeAutoPlay]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    pauseAutoPlay();
    resumeAutoPlay();
  }, [slides.length, pauseAutoPlay, resumeAutoPlay]);

  const handleDragStart = useCallback(
    (clientX: number) => {
      setIsDragging(true);
      setStartX(clientX);
      setCurrentX(clientX);
      pauseAutoPlay();
    },
    [pauseAutoPlay],
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      setCurrentX(clientX);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else {
      resumeAutoPlay();
    }

    setIsDragging(false);
  }, [isDragging, startX, currentX, goToNext, goToPrev, resumeAutoPlay]);

  return {
    currentSlide,
    isAutoPlaying,
    isDragging,
    startX,
    currentX,
    goToSlide,
    goToPrev,
    goToNext,
    pauseAutoPlay,
    resumeAutoPlay,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
