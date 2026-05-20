import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  url: string;
  title: string;
  subtitle: string;
  label?: string;
}

const slides: Slide[] = [
  {
    url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    title: "คลังข้อสอบ",
    subtitle: "รวบรวมข้อสอบเก่า สอวน. และ TCAS ครบถ้วนทุกวิชา",
    label: "EXAM ARCHIVE",
  },
  {
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    title: "เตรียมสอบ",
    subtitle: "คู่มือและสรุปเนื้อหาสำหรับการสอบแข่งขันทุกระดับ",
    label: "STUDY GUIDE",
  },
  {
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    title: "โครงงานวิทย์",
    subtitle: "ไอเดียโครงงานวิทยาศาสตร์และวิศวกรรมที่น่าสนใจ",
    label: "SCIENCE LAB",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
    title: "มหาวิทยาลัย",
    subtitle: "ข้อมูลการรับเข้าและคะแนนสอบของมหาวิทยาลัยชั้นนำ",
    label: "UNIVERSITIES",
  },
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90910b68d?q=80&w=2070&auto=format&fit=crop",
    title: "ผลงาน",
    subtitle: "Portfolio และผลงานเด่นจากรุ่นพี่",
    label: "PORTFOLIO",
  },
];

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, nextSlide]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -300) {
      nextSlide();
    } else if (info.offset.x > 80 || info.velocity.x > 300) {
      prevSlide();
    }
  };

  const getPosition = (index: number) => {
    const len = slides.length;
    let diff = index - currentIndex;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    return diff;
  };

  return (
    <div
      className="relative w-full h-[320px] sm:h-[450px] md:h-[550px] overflow-hidden rounded-3xl select-none group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cards layer */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {slides.map((slide, index) => {
          const pos = getPosition(index);
          if (Math.abs(pos) > 2) return null;

          const absPos = Math.abs(pos);

          return (
            <motion.div
              key={index}
              className="absolute inset-y-8 sm:inset-y-10 md:inset-y-12 rounded-3xl overflow-hidden shadow-2xl"
              style={{ width: "68%", left: "16%" }}
              animate={{
                x: `${pos * 68}%`,
                scale: pos === 0 ? 1 : 0.88,
                opacity: pos === 0 ? 1 : absPos === 1 ? 0.5 : 0,
                zIndex: 30 - absPos * 10,
                filter: pos === 0
                  ? "brightness(1)"
                  : absPos === 1
                    ? "brightness(0.55)"
                    : "brightness(0.3)",
                borderRadius: pos === 0 ? "1.5rem" : "1.25rem",
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 32,
                mass: 1.2,
              }}
            >
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Active slide dark overlay + content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center"
        >
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-12 max-w-3xl w-full">
            {/* Label */}
            {slides[currentIndex].label && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
                className="text-[10px] sm:text-xs tracking-[0.25em] text-white/40 font-mono uppercase mb-4 sm:mb-6"
              >
                {slides[currentIndex].label}
              </motion.span>
            )}

            {/* Massive semi-transparent serif title */}
            <motion.h2
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic text-white/10 leading-none mb-2 sm:mb-4 tracking-tight select-none"
            >
              {slides[currentIndex].title}
            </motion.h2>

            {/* Sans-serif body text */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm sm:text-lg text-white/75 font-sans max-w-lg leading-relaxed"
            >
              {slides[currentIndex].subtitle}
            </motion.p>

            {/* Pill-shaped ghost button */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-5 sm:mt-8 px-8 sm:px-12 py-2.5 sm:py-3 border border-white/25 text-white text-sm sm:text-base rounded-full font-medium backdrop-blur-sm hover:bg-white/10 hover:border-white/45 transition-all duration-300"
            >
              เรียนรู้เพิ่มเติม
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Drag layer */}
      <motion.div
        className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "pan-y" }}
      />

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 border border-white/15 opacity-0 group-hover/carousel:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 border border-white/15 opacity-0 group-hover/carousel:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dash pagination */}
      <div className="absolute bottom-4 sm:bottom-8 inset-x-0 z-50 flex justify-center gap-1.5 sm:gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ease-out ${
              currentIndex === index
                ? "w-7 sm:w-10 bg-white shadow-sm"
                : "w-2.5 sm:w-4 bg-white/25 hover:bg-white/45"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
