"use client";
import { useEffect, useRef } from "react";

/** Scroll-reveal wrapper: voegt .in toe zodra het element in beeld komt.
 *  Optionele `delay` (ms) geeft grids een gestaffeld cascade-effect. */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`rv ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
