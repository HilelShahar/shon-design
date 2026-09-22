'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Ground contact under the sleeve, and a one-shot dust trail under the disc.
 * Strength 0 removes a layer. Sleeve fractions are the visible cover in
 * salif-end.png (1600×720), not the full transparent frame.
 * Disc contact is sampled from salif-vinyl-alpha.webm, in seconds of playback.
 */
export const SALIF_ATMOSPHERE = {
  shadowStrength: 1,
  dustStrength: 1,
  sleeve: { left: 0.6069, right: 0.955, bottom: 0.8889 },
  /** Shadow size relative to the sleeve width and the frame height. */
  shadow: { width: 0.7, height: 0.085, blurPx: 4 },
  /** Disc bottom while it is on the ground, as a fraction of the frame. */
  groundY: 0.882,
};

/** Playback time → disc contact x, fraction of the frame. Holds, then rolls off the left edge. */
const DISC_CONTACT: ReadonlyArray<readonly [number, number]> = [
  [0.65, 0.671],
  [0.75, 0.669],
  [0.9, 0.657],
  [1.05, 0.635],
  [1.2, 0.6],
  [1.35, 0.563],
  [1.5, 0.507],
  [1.65, 0.459],
  [1.8, 0.393],
  [1.95, 0.34],
  [2.1, 0.268],
  [2.25, 0.214],
  [2.4, 0.148],
  [2.55, 0.094],
  [2.7, 0.035],
  [2.85, -0.02],
];

const DUST = {
  spawnStart: 1.02,
  spawnEnd: 2.62,
  count: 18,
  clearAt: 3.35,
};

type Puff = {
  birth: number;
  behind: number;
  rise: number;
  life: number;
  rx: number;
  ry: number;
  peak: number;
  drift: number;
};

function discContactX(time: number) {
  const keys = DISC_CONTACT;
  if (time <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (time >= last[0]) return last[1];
  for (let i = 1; i < keys.length; i++) {
    if (time > keys[i][0]) continue;
    const [t0, x0] = keys[i - 1];
    const [t1, x1] = keys[i];
    const u = (time - t0) / (t1 - t0);
    return x0 + (x1 - x0) * u;
  }
  return last[1];
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPuffs(): Puff[] {
  const rand = mulberry32(0x5a11f);
  const puffs: Puff[] = [];
  for (let i = 0; i < DUST.count; i++) {
    const slot = (i + 0.25 + rand() * 0.55) / DUST.count;
    puffs.push({
      birth: DUST.spawnStart + slot * (DUST.spawnEnd - DUST.spawnStart),
      behind: 0.008 + rand() * 0.042,
      rise: 0.01 + rand() * 0.02,
      life: 0.34 + rand() * 0.22,
      rx: 0.014 + rand() * 0.02,
      ry: 0.006 + rand() * 0.008,
      peak: 0.18 + rand() * 0.16,
      drift: (rand() - 0.35) * 0.012,
    });
  }
  return puffs;
}

const PUFFS = buildPuffs();

function drawDust(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, strength: number) {
  ctx.clearRect(0, 0, width, height);
  for (const puff of PUFFS) {
    const age = time - puff.birth;
    if (age < 0 || age > puff.life) continue;
    const u = age / puff.life;
    const fade = Math.sin(u * Math.PI) * (1 - u * 0.25);
    const alpha = puff.peak * fade * strength;
    if (alpha < 0.012) continue;
    const x = (discContactX(puff.birth) + puff.behind + puff.drift * u) * width;
    const y = (SALIF_ATMOSPHERE.groundY - puff.rise * Math.pow(u, 0.72)) * height;
    const rx = puff.rx * width;
    const ry = puff.ry * height;
    const paint = (ox: number, oy: number, scale: number, amount: number) => {
      const gradient = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rx * scale);
      gradient.addColorStop(0, `rgba(232, 196, 142, ${amount})`);
      gradient.addColorStop(0.42, `rgba(186, 132, 74, ${amount * 0.5})`);
      gradient.addColorStop(1, 'rgba(168, 116, 68, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(x + ox, y + oy, rx * scale, ry * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    paint(0, 0, 1, alpha);
    paint(rx * 0.45, ry * 0.15, 0.72, alpha * 0.55);
  }
}

export function SalifContactShadow() {
  const { shadowStrength, sleeve, shadow } = SALIF_ATMOSPHERE;
  if (shadowStrength <= 0) return null;
  const sleeveWidth = sleeve.right - sleeve.left;
  const width = sleeveWidth * shadow.width;
  const left = sleeve.left + (sleeveWidth - width) / 2;
  const top = sleeve.bottom - shadow.height * 0.2;
  return (
    <div
      className="salif-contact-shadow"
      aria-hidden="true"
      style={{
        left: `${left * 100}%`,
        width: `${width * 100}%`,
        top: `${top * 100}%`,
        height: `${shadow.height * 100}%`,
        opacity: shadowStrength,
        filter: `blur(${shadow.blurPx}px)`,
        background:
          'radial-gradient(ellipse 46% 38% at 50% 20%, rgba(32, 10, 4, 0.8) 0%, rgba(64, 24, 8, 0.42) 38%, transparent 72%)',
      }}
    />
  );
}

export function SalifDust({
  videoRef,
  active,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || SALIF_ATMOSPHERE.dustStrength <= 0) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let stopped = false;
    let raf = 0;
    let frameCallback = 0;
    const strength = SALIF_ATMOSPHERE.dustStrength;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const render = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      if (time >= DUST.clearAt) {
        ctx.clearRect(0, 0, width, height);
        stopped = true;
        return;
      }
      drawDust(ctx, width, height, time, strength);
    };

    const track = () => {
      if (stopped) return;
      const node = videoRef.current;
      if (!node || node.ended) return;
      if (typeof node.requestVideoFrameCallback === 'function') {
        frameCallback = node.requestVideoFrameCallback((_now, metadata) => {
          if (stopped) return;
          render(metadata.mediaTime);
          track();
        });
        return;
      }
      raf = window.requestAnimationFrame(() => {
        const current = videoRef.current;
        if (!current || stopped || current.paused || current.ended) return;
        render(current.currentTime);
        track();
      });
    };

    const resume = () => {
      if (stopped) return;
      track();
    };
    video.addEventListener('playing', resume);
    if (!video.paused && !video.ended) track();

    return () => {
      stopped = true;
      observer.disconnect();
      video.removeEventListener('playing', resume);
      if (raf) window.cancelAnimationFrame(raf);
      if (frameCallback && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(frameCallback);
      }
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width && height) ctx.clearRect(0, 0, width, height);
    };
  }, [active, videoRef]);

  if (!active || SALIF_ATMOSPHERE.dustStrength <= 0) return null;

  return <canvas ref={canvasRef} className="salif-dust" aria-hidden="true" />;
}
