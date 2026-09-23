'use client';

import { useEffect, useRef, useState } from 'react';
import { SalifContactShadow, SalifDust } from '@/components/SalifVinylAtmosphere';

/** Place inside a position:relative, full-width hero with overflow:hidden. */
export default function SalifVinylVideo({
  basePath = '/media/salif',
  hevcAlphaSrc,
}: {
  basePath?: string;
  /** Optional genuine HEVC-with-alpha source for Safari; a normal MP4 is insufficient. */
  hevcAlphaSrc?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ua = navigator.userAgent;
    const appleMobile = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const safari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
    // Conservative static fallback on Apple browsers unless an HEVC-alpha asset is supplied.
    const selected = appleMobile || safari ? hevcAlphaSrc ?? null : `${basePath}/salif-vinyl-alpha.webm`;
    if (!motion.matches) setSource(selected);
    const stop = () => {
      if (motion.matches) {
        ref.current?.pause();
        setFinished(true);
      }
    };
    motion.addEventListener('change', stop);
    return () => motion.removeEventListener('change', stop);
  }, [basePath, hevcAlphaSrc]);

  return (
    <div className="salif-vinyl" aria-hidden="true">
      <SalifContactShadow />
      <img src={`${basePath}/salif-end.png`} alt="" style={{
        display: 'block', width: '100%', height: '100%',
        visibility: source && playing && !finished ? 'hidden' : 'visible',
      }} />
      {source && !finished && (
        <video ref={ref} src={source} autoPlay muted playsInline preload="auto"
          poster={`${basePath}/salif-start.png`}
          onPlaying={() => setPlaying(true)}
          onEnded={() => setFinished(true)}
          onError={() => setFinished(true)}
          onCanPlay={() => { ref.current?.play().catch(() => setFinished(true)); }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', opacity: playing ? 1 : 0 }}
        />
      )}
      <SalifDust videoRef={ref} active={Boolean(source) && playing && !finished} />
    </div>
  );
}
