import {
  testimonialInitials,
  type Testimonial,
} from "@/lib/testimonials";

function TestimonialAvatar({
  name,
  image,
  initials,
}: {
  name: string;
  image?: string;
  initials?: string;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="size-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
      />
    );
  }
  const custom = initials?.trim();
  const label = custom || testimonialInitials(name);
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-medium tracking-wide text-foreground/85 ring-1 ring-white/10${custom ? "" : " uppercase"}`}
    >
      {label}
    </span>
  );
}

export function TestimonialQuoteText({ item }: { item: Testimonial }) {
  return (
    <blockquote dir="rtl" className="mb-auto text-right text-[0.9375rem] leading-relaxed text-foreground/92">
      {item.text}
    </blockquote>
  );
}

export function TestimonialQuoteAuthor({ item }: { item: Testimonial }) {
  return (
    <div className="feedback-card-divider mt-6 pt-5" dir="rtl">
      <div className="flex items-center gap-3 text-right">
        <TestimonialAvatar name={item.name} image={item.image} initials={item.initials} />
        <div>
          <div className="text-sm font-medium text-foreground">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.title}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialCard({
  item,
  active = true,
  className = "",
}: {
  item: Testimonial;
  active?: boolean;
  className?: string;
}) {
  return (
    <article className={className}>
      <div
        className={`feedback-card-panel flex h-full min-h-[17.5rem] flex-col rounded-2xl border p-6 md:min-h-[18.5rem] md:p-7 ${
          active ? "feedback-card-panel--active" : ""
        }`}
      >
        <span className="feedback-quote-mark" aria-hidden="true">
          ”
        </span>
        <TestimonialQuoteText item={item} />
        <TestimonialQuoteAuthor item={item} />
      </div>
    </article>
  );
}
