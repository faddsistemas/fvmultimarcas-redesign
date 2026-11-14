"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/lib/use-media-query";
import { cn } from "cn";

const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "ul";
  durationMs?: number;
  delayMs?: number;
  offsetY?: number;
  staggerMs?: number;
  id?: string;
};

export function ScrollReveal({
  children,
  className,
  style,
  as: Tag = "div",
  durationMs = 700,
  delayMs = 0,
  offsetY = 20,
  staggerMs = 0,
  id,
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    document.documentElement.classList.add("motion-reveal-ready");

    const items: HTMLElement[] =
      staggerMs > 0 && root.children.length > 0
        ? (Array.from(root.children) as HTMLElement[])
        : [root];

    const setRevealVars = (el: HTMLElement, index: number) => {
      el.style.setProperty("--reveal-y", `${offsetY}px`);
      el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      el.style.setProperty("--reveal-delay", `${delayMs + index * staggerMs}ms`);
      el.style.setProperty("--reveal-ease", REVEAL_EASE);
    };

    const reveal = (el: HTMLElement) => {
      el.dataset.reveal = "shown";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    items.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) return;
      setRevealVars(el, index);
      el.dataset.reveal = "pending";
      observer.observe(el);
    });

    const fallback = window.setTimeout(() => {
      for (const el of items) reveal(el);
      observer.disconnect();
    }, 1500);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [delayMs, durationMs, offsetY, reducedMotion, staggerMs]);

  if (staggerMs > 0) {
    return (
      <Tag ref={rootRef as never} className={className} style={style} id={id}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          return cloneElement(child as ReactElement<{ className?: string }>, {
            className: cn("scroll-reveal-item", (child.props as { className?: string }).className),
          });
        })}
      </Tag>
    );
  }

  return (
    <Tag
      ref={rootRef as never}
      className={cn("scroll-reveal", className)}
      style={style}
      id={id}
    >
      {children}
    </Tag>
  );
}