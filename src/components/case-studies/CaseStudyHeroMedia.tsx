"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Still + one-shot opening video for a case study hero.
 *
 * The still is the real first paint and always stays underneath. The video is
 * layered above it at opacity 0 and only fades in once it can actually play.
 * It plays once (no loop) and rests on its final frame. Nothing restarts it:
 * `start` runs a single time per mount, and the video stays visible after it ends.
 * Both layers share one class, so size, object-fit and object-position match.
 */
export default function CaseStudyHeroMedia({
  still,
  video,
}: {
  still: string;
  video: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Starts false so the server render and first paint are the still only. The
  // video element is not mounted (and not downloaded) under reduced motion.
  const [motionOk, setMotionOk] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setMotionOk(!query.matches);
      if (query.matches) setReady(false);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!motionOk || failed || !el) return;
    const node: HTMLVideoElement = el;

    let started = false;
    function start() {
      // Enough data to play through, not just the first frame metadata.
      if (started || node.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return;
      started = true;
      node.muted = true;
      const attempt = node.play();
      if (!attempt) {
        setReady(true);
        return;
      }
      attempt.then(
        () => setReady(true),
        // Autoplay refused: leave the still alone, no frozen frame.
        () => {
          started = false;
        },
      );
    }
    function onError() {
      setFailed(true);
      setReady(false);
    }

    node.addEventListener("loadeddata", start);
    node.addEventListener("canplay", start);
    node.addEventListener("error", onError);
    start(); // Cached video can already be ready before listeners attach.
    return () => {
      node.removeEventListener("loadeddata", start);
      node.removeEventListener("canplay", start);
      node.removeEventListener("error", onError);
    };
  }, [motionOk, failed]);

  return (
    <>
      <Image
        className="case-study-hero-media"
        src={still}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={85}
        draggable={false}
      />
      {motionOk && !failed ? (
        <video
          ref={ref}
          className={ready ? "case-study-hero-media case-study-hero-video is-ready" : "case-study-hero-media case-study-hero-video"}
          src={video}
          autoPlay
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        />
      ) : null}
    </>
  );
}
