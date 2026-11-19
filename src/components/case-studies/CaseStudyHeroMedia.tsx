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
 * Movimiento also passes `crossfade`: two copies of the same film dissolve into
 * each other near the end, instead of the browser's hard loop.
 */
export type HeroLockup = {
  /** Reveal the line from this time onward. Playback is not paused. */
  at: number;
  headline: string;
  /** Frame shown with the line when motion is reduced. */
  rest: string;
};

/** Overlap between the outgoing film and the copy that takes over. */
const CROSSFADE_MS = 800;

type LinePhase = "off" | "on" | "settle" | "leaving";

/**
 * Two preloaded copies of one film. The visible copy plays. Near its end the
 * other starts at 0, on top, and fades in. Roles swap when that fade ends.
 * Classes are state, not per-frame renders: playback is watched with video
 * frames and only crosses into React at the cue and the handoff.
 */
function HeroCrossfade({
  src,
  cueAt,
  onCue,
  onFade,
  onError,
}: {
  src: string;
  cueAt?: number;
  onCue: () => void;
  onFade: () => void;
  onError: () => void;
}) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const onCueRef = useRef(onCue);
  const onFadeRef = useRef(onFade);
  const onErrorRef = useRef(onError);
  const cuedRef = useRef(false);
  onCueRef.current = onCue;
  onFadeRef.current = onFade;
  onErrorRef.current = onError;

  const [lead, setLead] = useState<"a" | "b">("a");
  const [phase, setPhase] = useState<"boot" | "live" | "arm" | "fade">("boot");

  useEffect(() => {
    const aEl = aRef.current;
    const bEl = bRef.current;
    if (!aEl || !bEl) return;
    // Copies keep the narrowed element type inside the async startup closure.
    const a: HTMLVideoElement = aEl;
    const b: HTMLVideoElement = bEl;
    let dead = false;
    let started = false;
    let gesture: (() => void) | null = null;

    function fail() {
      if (!dead) onErrorRef.current();
    }

    function clearGesture() {
      if (!gesture) return;
      window.removeEventListener("pointerdown", gesture);
      window.removeEventListener("touchstart", gesture);
      gesture = null;
    }

    function armGesture() {
      if (gesture) return;
      gesture = () => {
        clearGesture();
        void start();
      };
      window.addEventListener("pointerdown", gesture);
      window.addEventListener("touchstart", gesture, { passive: true });
    }

    // Phones often refuse to buffer a second copy until something is playing.
    // Warm it without holding the visible copy back, and resume the lead if
    // the spare play paused it.
    function primeSpare() {
      if (b.readyState < HTMLMediaElement.HAVE_METADATA) return;
      b.play()
        .then(() => {
          b.pause();
          if (b.currentTime > 0.02) b.currentTime = 0;
          if (!dead && a.paused) void a.play();
        })
        .catch(() => {});
    }

    async function start() {
      if (dead || started) return;
      // Metadata is enough. Waiting for HAVE_FUTURE_DATA on both copies never
      // arrives on mobile, so the still underneath stays on screen.
      if (a.readyState < HTMLMediaElement.HAVE_METADATA) return;
      started = true;
      a.muted = true;
      b.muted = true;
      a.playsInline = true;
      b.playsInline = true;
      a.autoplay = true;
      try {
        await a.play();
      } catch {
        started = false;
        armGesture();
        return;
      }
      if (dead) return;
      clearGesture();
      primeSpare();
      setPhase("live");
    }

    a.addEventListener("loadedmetadata", start);
    a.addEventListener("loadeddata", start);
    a.addEventListener("canplay", start);
    a.addEventListener("error", fail);
    b.addEventListener("error", fail);
    start();
    return () => {
      dead = true;
      clearGesture();
      a.removeEventListener("loadedmetadata", start);
      a.removeEventListener("loadeddata", start);
      a.removeEventListener("canplay", start);
      a.removeEventListener("error", fail);
      b.removeEventListener("error", fail);
    };
  }, [src]);

  useEffect(() => {
    if (phase !== "arm") return;
    const id = requestAnimationFrame(() => setPhase("fade"));
    return () => cancelAnimationFrame(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "live") return;
    const outgoingEl = (lead === "a" ? aRef : bRef).current;
    const incomingEl = (lead === "a" ? bRef : aRef).current;
    if (!outgoingEl || !incomingEl) return;
    const outgoing: HTMLVideoElement = outgoingEl;
    const incoming: HTMLVideoElement = incomingEl;

    const token = {};
    let current: object | null = token;
    let frame = 0;
    let handoff = false;

    if (cueAt == null || outgoing.currentTime < cueAt) cuedRef.current = false;

    async function begin() {
      if (handoff || current !== token) return;
      // play() is what starts the spare copy loading on mobile. A full buffer
      // is not required before the fade.
      handoff = true;
      incoming.muted = true;
      incoming.playsInline = true;
      try {
        if (incoming.currentTime > 0.04) {
          await new Promise<void>((resolve) => {
            incoming.addEventListener("seeked", () => resolve(), { once: true });
            incoming.currentTime = 0;
          });
        } else {
          incoming.currentTime = 0;
        }
        if (current !== token) return;
        await incoming.play();
        await new Promise<void>((resolve) => {
          if (typeof incoming.requestVideoFrameCallback === "function") {
            incoming.requestVideoFrameCallback(() => resolve());
          } else {
            incoming.addEventListener("playing", () => resolve(), { once: true });
          }
        });
      } catch {
        handoff = false;
        return;
      }
      if (current !== token) return;
      onFadeRef.current();
      setPhase("arm");
    }

    function check() {
      if (current !== token || handoff) return;
      const dur = outgoing.duration;
      if (cueAt != null && !cuedRef.current && outgoing.currentTime >= cueAt) {
        cuedRef.current = true;
        onCueRef.current();
      }
      const due =
        (Number.isFinite(dur) && outgoing.currentTime >= dur - CROSSFADE_MS / 1000) || outgoing.ended;
      if (!due) {
        if (typeof outgoing.requestVideoFrameCallback === "function") {
          frame = outgoing.requestVideoFrameCallback(check);
        }
        return;
      }
      void begin();
    }

    check();
    outgoing.addEventListener("timeupdate", check);
    outgoing.addEventListener("ended", check);
    return () => {
      current = null;
      if (typeof outgoing.cancelVideoFrameCallback === "function") outgoing.cancelVideoFrameCallback(frame);
      outgoing.removeEventListener("timeupdate", check);
      outgoing.removeEventListener("ended", check);
    };
  }, [phase, lead, cueAt]);

  useEffect(() => {
    if (phase !== "fade") return;
    const outgoingEl = (lead === "a" ? aRef : bRef).current;
    const incomingEl = (lead === "a" ? bRef : aRef).current;
    if (!outgoingEl || !incomingEl) return;
    const outgoing: HTMLVideoElement = outgoingEl;
    const incoming: HTMLVideoElement = incomingEl;
    let done = false;

    function finish() {
      if (done) return;
      done = true;
      outgoing.pause();
      outgoing.currentTime = 0;
      setLead(lead === "a" ? "b" : "a");
      setPhase("live");
    }

    function onEnd(event: TransitionEvent) {
      if (event.propertyName !== "opacity" || event.target !== incoming) return;
      finish();
    }

    incoming.addEventListener("transitionend", onEnd);
    const backup = window.setTimeout(finish, CROSSFADE_MS + 120);
    return () => {
      incoming.removeEventListener("transitionend", onEnd);
      window.clearTimeout(backup);
    };
  }, [phase, lead]);

  function classFor(which: "a" | "b") {
    const isLead = lead === which;
    const incoming = !isLead && (phase === "arm" || phase === "fade");
    let name = "case-study-hero-media movimiento-loop";
    if (phase !== "boot" && isLead) name += " is-base";
    if (incoming) name += " is-incoming";
    if (!isLead && phase === "fade") name += " is-show";
    return name;
  }

  return (
    <div
      className="movimiento-loop-stack"
      style={{ ["--movimiento-crossfade" as string]: `${CROSSFADE_MS}ms` }}
    >
      <video
        ref={aRef}
        className={classFor("a")}
        src={src}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
      />
      <video
        ref={bRef}
        className={classFor("b")}
        src={src}
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

export default function CaseStudyHeroMedia({
  still,
  video,
  lockup,
  grain = false,
  crossfade = false,
}: {
  still: string;
  video: string;
  lockup?: HeroLockup;
  /** Fine monochrome grain above the picture and below any campaign line. */
  grain?: boolean;
  /** Dissolve two copies into a continuous loop. Other heroes omit it. */
  crossfade?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Starts false so the server render and first paint are the still only. The
  // video element is not mounted (and not downloaded) under reduced motion.
  const [motionOk, setMotionOk] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [line, setLine] = useState<LinePhase>("off");

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
    if (crossfade || !motionOk || failed || !el) return;
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
  }, [crossfade, motionOk, failed]);

  useEffect(() => {
    const nodeEl = ref.current;
    if (crossfade || !lockup || !motionOk || failed || !nodeEl) return;
    const node: HTMLVideoElement = nodeEl;
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
  }, [crossfade, lockup, motionOk, failed]);

  useEffect(() => {
    if (line !== "settle") return;
    const id = requestAnimationFrame(() => setLine("leaving"));
    return () => cancelAnimationFrame(id);
  }, [line]);

  useEffect(() => {
    if (line !== "leaving") return;
    const id = window.setTimeout(() => setLine((current) => (current === "leaving" ? "off" : current)), 760);
    return () => window.clearTimeout(id);
  }, [line]);

  const showLockup = Boolean(lockup) && (crossfade ? line !== "off" || reduce : revealed || reduce);
  const lockupClass = !motionOk
    ? "movimiento-lockup is-static"
    : line === "leaving"
      ? "movimiento-lockup is-leaving"
      : line === "settle"
        ? "movimiento-lockup is-settle"
        : "movimiento-lockup is-on";

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
      {crossfade && motionOk && !failed ? (
        <HeroCrossfade
          src={video}
          cueAt={lockup?.at}
          onCue={() => setLine("on")}
          onFade={() => setLine((current) => (current === "on" ? "settle" : current))}
          onError={() => {
            setFailed(true);
            setReady(false);
          }}
        />
      ) : null}
      {!crossfade && motionOk && !failed ? (
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
        <div className={lockupClass}>
          <p className="movimiento-lockup-line">{lockup.headline}</p>
        </div>
      ) : null}
    </>
  );
}
