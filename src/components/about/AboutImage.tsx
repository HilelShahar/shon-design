import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

type AboutImageProps = {
  /** Path under /public, e.g. "/about/pokemon-shelf.jpg". */
  src: string;
  alt: string;
  /** CSS aspect-ratio of the frame, e.g. "4 / 5". The photo is cropped to it. */
  ratio: string;
  sizes: string;
  className?: string;
};

/**
 * A named photo slot. When the file exists in /public it renders as a plain,
 * cropped photograph; until then it renders a quiet, clearly labelled slot so
 * the layout can be reviewed without inventing imagery. The check runs on the
 * server, so a new photo appears on the next request (dev) or build (prod).
 */
export default function AboutImage({ src, alt, ratio, sizes, className = "" }: AboutImageProps) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", src));

  if (!exists) {
    return (
      <div
        className={`about-photo about-photo-slot ${className}`}
        style={{ aspectRatio: ratio }}
        data-slot={src}
        role="img"
        aria-label={`Photo placeholder: ${alt}`}
      >
        <span className="about-photo-slot-text">
          <span>Photo slot</span>
          <code>{src}</code>
        </span>
      </div>
    );
  }

  return (
    <div className={`about-photo ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} quality={88} className="object-cover" />
    </div>
  );
}
