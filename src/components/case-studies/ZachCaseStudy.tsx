"use client";

import { useEffect, useRef, useState } from "react";
import SalifVinylVideo from "@/components/SalifVinylVideo";
import {
  CaseStudyClientFeedback,
  CaseStudyClose,
  CaseStudyCreativeDirection,
  CaseStudyFinalWork,
  CaseStudyFrame,
  CaseStudyOverview,
  CaseStudyProcess,
  CaseStudyText,
} from "@/components/case-studies/CaseStudySections";
import { MaskedReveal, Reveal } from "@/components/motion/Motion";
import type { Project } from "@/lib/projects";
import { ZACH_CLIENT_FEEDBACK } from "@/lib/testimonials";

const HERO_TAGS = ["Cover art", "Art direction", "Visual identity", "Merchandise"];
const TRACK_DESIGN_INTRO =
  "After listening to the track, I built the visual direction around the feeling it gave me: an African sunset, warm colors, and a deep atmosphere. From there, I connected the music, the African-inspired visual language, and the landscape into one cohesive world.";

const PROCESS = [
  {
    label: "Exploration",
    note: "I researched African safari landscapes, red sunsets, and visual references that matched the feeling of the track.",
    image: "/media/salif/exploration-moodboard.jpg",
    alt: "Exploration moodboard for Salif Keita track cover",
  },
  {
    label: "Color & Typography",
    note: "The palette came directly from the deep red African sunset, paired with typography that supported the African atmosphere.",
    image: "/media/salif/color-typography.jpg",
    alt: "Color and typography board for Salif Keita project",
  },
];

function ZachSkyVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const armed = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || video.error) {
      setFailed(true);
      return;
    }

    const reveal = () => setReady(true);
    const arm = () => {
      if (armed.current) return;
      if (typeof video.requestVideoFrameCallback === "function") {
        armed.current = true;
        video.requestVideoFrameCallback(() => reveal());
        return;
      }
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        armed.current = true;
        reveal();
      }
    };

    arm();
    video.addEventListener("loadeddata", arm);
    video.addEventListener("canplay", arm);
    video.addEventListener("playing", arm);
    const onError = () => setFailed(true);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadeddata", arm);
      video.removeEventListener("canplay", arm);
      video.removeEventListener("playing", arm);
      video.removeEventListener("error", onError);
    };
  }, []);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className={ready ? "zach-sky-video is-ready" : "zach-sky-video"}
      src="/media/salif/safari-sunset-loop.mp4"
      poster="/media/salif/safari-sunset-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onCanPlay={(event) => {
        const video = event.currentTarget;
        video.muted = true;
        if (video.paused) video.play().catch(() => undefined);
      }}
    />
  );
}

export default function ZachCaseStudy({ project }: { project: Project }) {
  return (
    <CaseStudyFrame>
      <section className="zach-hero" aria-label="Salif Keita, Zach">
        <div className="zach-sky" aria-hidden="true">
          <img
            className="zach-sky-photo"
            src="/media/salif/safari-sunset-poster.jpg"
            alt=""
            width={1024}
            height={576}
            fetchPriority="high"
            decoding="async"
          />
          <ZachSkyVideo />
          <span className="zach-sky-shade" />
          <span className="zach-haze" />
        </div>

        <SalifVinylVideo />

        <div className="zach-hero-layout">
          <div className="zach-hero-copy">
            <Reveal>
              <ul className="zach-tags">
                {HERO_TAGS.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Reveal>
            <div className="zach-hero-names">
              <MaskedReveal as="h1" className="zach-title">
                Salif Keita
              </MaskedReveal>
              <Reveal delay={70}>
                <p className="zach-title-sub">Zach</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CaseStudyOverview
        intro={TRACK_DESIGN_INTRO}
        meta={[
          { label: "Role", value: "Art Direction & Cover Design" },
          { label: "Year", value: project.year },
          { label: "Category", value: "Music Visual Identity" },
          { label: "Deliverables", value: "Cover Art / Poster / Social Media / Merch / Spotify Assets" },
        ]}
      />
      <CaseStudyText title="Goal">
        The goal was to translate the feeling of the track into a visual experience that feels like a natural extension of the music.
      </CaseStudyText>
      <CaseStudyText title="Constraints">
        Keep the African influence clear while making sure the key details still work at small sizes, such as Spotify and in-car displays.
      </CaseStudyText>
      <CaseStudyCreativeDirection>
        The direction came from the track&apos;s African sound. I imagined a woman overlooking the safari at a deep red sunset, and built the visual world around that feeling.
      </CaseStudyCreativeDirection>
      <CaseStudyProcess
        intro="I started by listening to the track several times and letting the music shape the visual direction. From there, I researched African safari imagery, explored compositions, and refined the color, typography, and character."
        steps={PROCESS}
      />
      <CaseStudyFinalWork
        intro="The final direction expanded beyond the cover into a wider visual identity, including merchandise, artist posters, vinyl and CD mockups, stickers, tags, and Spotify applications."
        image={project.longImage}
        alt="Final Salif Keita and Zach cover presentation"
      />
      <CaseStudyText title="Outcome">
        The client was very happy with the result and released the track on SoundCloud. The visual direction also received positive feedback from his colleagues, some of whom reached out to me directly after seeing the work. He especially liked how the project expanded beyond the cover into a complete visual world.
      </CaseStudyText>
      <CaseStudyClientFeedback testimonial={ZACH_CLIENT_FEEDBACK} />
      <CaseStudyClose reflection="This project showed me how music can be translated into a visual experience that carries the same emotion. Following the client's request to listen first helped me trust the feeling of the track and turn it into a strong visual direction, especially through color." />
    </CaseStudyFrame>
  );
}
