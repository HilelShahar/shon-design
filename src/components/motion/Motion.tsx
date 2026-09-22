"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { observeOnce } from "./observeOnce";

const STAGGER_MS = 85;
const STAGGER_CAP = 5;

function arm(el: HTMLElement | null) {
  if (!el) return () => {};
  return observeOnce(el, () => el.setAttribute("data-motion", "shown"));
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Tiny scale, for images and mockups. */
  media?: boolean;
  /** Delay after the element enters, in ms. */
  delay?: number;
};

/** Paragraphs, blocks, CTAs, metadata. Plays once. */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  media = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => arm(ref.current), []);

  return (
    <Tag
      ref={ref}
      data-motion="hidden"
      data-motion-kind={media ? "media" : "content"}
      className={className}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

type MaskedRevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Section headings: rise through a clip, almost no fade. */
export function MaskedReveal({
  as: Tag = "h2",
  className,
  children,
}: MaskedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => arm(ref.current), []);

  return (
    <div ref={ref} data-motion="hidden" data-motion-kind="mask" className="motion-mask">
      <Tag className={className}>{children}</Tag>
    </div>
  );
}

type StaggerProps = {
  className?: string;
  children: ReactNode;
  media?: boolean;
  /**
   * When true, direct children are left alone and any descendant with
   * `data-motion-item` is staggered instead. Used when a parent like
   * Accordion must stay the direct wrapper.
   */
  nested?: boolean;
};

/** Cards, lists, and related groups. Children arrive 85ms apart, capped. */
export function Stagger({ className, children, media = false, nested = false }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => arm(ref.current), []);

  const content = nested
    ? children
    : Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        const element = child as ReactElement<{ style?: CSSProperties }>;
        const delay = Math.min(index, STAGGER_CAP) * STAGGER_MS;
        return cloneElement(element, {
          "data-motion-item": "",
          style: { ...element.props.style, animationDelay: `${delay}ms` },
        } as { style: CSSProperties });
      });

  return (
    <div
      ref={ref}
      data-motion="hidden"
      data-motion-stagger={media ? "media" : "content"}
      className={className}
    >
      {content}
    </div>
  );
}
