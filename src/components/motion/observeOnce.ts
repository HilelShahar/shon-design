/**
 * One shared observer for one-shot viewport entrances.
 * The root is shrunk from the bottom so motion starts before an element
 * reaches the middle of the screen, then never replays.
 */
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        observer?.unobserve(entry.target);
        callbacks.delete(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
  );
  return observer;
}

export function observeOnce(el: Element, onEnter: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onEnter();
    return () => {};
  }
  callbacks.set(el, onEnter);
  getObserver().observe(el);
  return () => {
    getObserver().unobserve(el);
    callbacks.delete(el);
  };
}
