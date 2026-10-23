'use client';

import { useEffect, useRef, useState } from 'react';
import { SalifContactShadow, SalifDust } from '@/components/SalifVinylAtmosphere';

/** Place inside a position:relative, full-width hero with overflow:hidden. */
export default function SalifVinylVideo({
  basePath = '/media/salif',
  hevcAlphaSrc = `${basePath}/salif-vinyl-alpha-hevc.mov`,
}: {
  basePath?: string;
  /** HEVC-with-alpha twin of the WebM, for Safari and every iOS browser. A normal MP4 would lose the alpha. */
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
    // WebKit (Safari, and every iOS browser including in-app ones) cannot decode alpha from VP9 WebM,
    // so it gets the HEVC-with-alpha twin. If that cannot play, the static end frame stays.
    const hevc = Boolean(document.createElement('video').canPlayType('video/mp4; codecs="hvc1"'));
    const selected = appleMobile || safari
      ? (hevc ? hevcAlphaSrc : null)
      : `${basePath}/salif-vinyl-alpha.webm`;
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
