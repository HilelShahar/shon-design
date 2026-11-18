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
 *
 * An optional line is a late campaign title for one hero. Other heroes omit it.
 */
export type HeroLockup = {
  /** Reveal the line from this time onward. Playback is not paused. */
  at: number;
  headline: string;
  /** Frame shown with the line when motion is reduced. */
  rest: string;
};

export default function CaseStudyHeroMedia({
  still,
  video,
  lockup,
  grain = false,
}: {
  still: string;
  video: string;
  lockup?: HeroLockup;
  /** Fine monochrome grain above the picture and below any campaign line. */
  grain?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Starts false so the server render and first paint are the still only. The
  // video element is not mounted (and not downloaded) under reduced motion.
  const [motionOk, setMotionOk] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const reduced = query.matches;
      setReduce(reduced);
      setMotionOk(!reduced);
      if (reduced) setReady(false);
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

  useEffect(() => {
    const node = ref.current;
    if (!lockup || !motionOk || failed || !node) return;
    const at = lockup.at;
    let raf = 0;
    let frame = 0;

    function reveal() {
      if (node.currentTime < at && !node.ended) return;
      setRevealed(true);
    }
    function watch() {
      reveal();
      if (node.currentTime < at && typeof node.requestVideoFrameCallback === "function") {
        frame = node.requestVideoFrameCallback(watch);
      }
    }
    function tick() {
      reveal();
      if (node.currentTime < at) raf = requestAnimationFrame(tick);
    }

    watch();
    raf = requestAnimationFrame(tick);
    node.addEventListener("timeupdate", reveal);
    node.addEventListener("ended", reveal);
    return () => {
      cancelAnimationFrame(raf);
      if (typeof node.cancelVideoFrameCallback === "function") node.cancelVideoFrameCallback(frame);
      node.removeEventListener("timeupdate", reveal);
      node.removeEventListener("ended", reveal);
    };
  }, [lockup, motionOk, failed]);

  const showLockup = Boolean(lockup) && (revealed || reduce);

  return (
    <>
      <Image
        className="case-study-hero-media"
        src={reduce && lockup ? lockup.rest : still}
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
      {grain ? (
        <div className={motionOk ? "movimiento-grain is-live" : "movimiento-grain"} aria-hidden="true" />
      ) : null}
      {showLockup && lockup ? (
        <div className={motionOk ? "movimiento-lockup is-on" : "movimiento-lockup is-static"}>
          <p className="movimiento-lockup-line">{lockup.headline}</p>
        </div>
      ) : null}
    </>
  );
}
