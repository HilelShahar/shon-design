import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
  INSTAGRAM_HREF,
  LINKEDIN_HREF,
  WHATSAPP_HREF,
} from "@/lib/social";

const defaultLinkClass =
  "inline-flex items-center justify-center text-muted-foreground transition-[color,opacity,transform] duration-200 ease-out hover:text-foreground hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:stroke-current";

type SocialIconLinksProps = {
  iconSize?: number;
  iconStroke?: number;
  className?: string;
  linkClassName?: string;
};

export default function SocialIconLinks({
  iconSize = 24,
  iconStroke = 1.5,
  className = "",
  linkClassName = defaultLinkClass,
}: SocialIconLinksProps) {
  const iconProps = {
    size: iconSize,
    width: iconSize,
    height: iconSize,
    stroke: iconStroke,
    color: "currentColor",
    className: "block shrink-0 pointer-events-none",
    style: { width: iconSize, height: iconSize, color: "currentColor" } as const,
  };

  return (
    <div className={className}>
      <a
        href={INSTAGRAM_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Shon's Design on Instagram"
        className={linkClassName}
      >
        <IconBrandInstagram {...iconProps} />
      </a>
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Shon on WhatsApp"
        className={linkClassName}
      >
        <IconBrandWhatsapp {...iconProps} />
      </a>
      <a
        href={LINKEDIN_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Shon Simhon on LinkedIn"
        className={linkClassName}
      >
        <IconBrandLinkedin {...iconProps} />
      </a>
    </div>
  );
}
