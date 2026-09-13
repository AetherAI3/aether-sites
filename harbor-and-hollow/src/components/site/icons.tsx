/* Custom thin-line brand icons. One stroke weight, drawn for this site. */

interface IconProps {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function NeroliBlossom({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="1.8" />
      <path d="M12 10.2c0-2.6-1.2-4.7-1.2-6.2 0-.9.5-1.5 1.2-1.5s1.2.6 1.2 1.5c0 1.5-1.2 3.6-1.2 6.2Z" />
      <path d="M13.7 11.1c2.2-1.3 4.6-1.5 5.9-.8.8.4 1 1.2.7 1.8-.4.6-1.2.8-2 .5-1.4-.4-3.2-1-4.6-1.5Z" />
      <path d="M13.1 13.6c2.2 1.3 3.5 3.3 3.5 4.8 0 .9-.6 1.4-1.3 1.3-.7 0-1.2-.7-1.4-1.5-.3-1.5-.6-3.1-.8-4.6Z" />
      <path d="M10.9 13.6c-2.2 1.3-3.5 3.3-3.5 4.8 0 .9.6 1.4 1.3 1.3.7 0 1.2-.7 1.4-1.5.3-1.5.6-3.1.8-4.6Z" />
      <path d="M10.3 11.1c-2.2-1.3-4.6-1.5-5.9-.8-.8.4-1 1.2-.7 1.8.4.6 1.2.8 2 .5 1.4-.4 3.2-1 4.6-1.5Z" />
    </svg>
  );
}

export function WaterRipple({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M3 9.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 14.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
    </svg>
  );
}

export function CedarBranch({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 21V4" />
      <path d="M12 7 8.2 4.4M12 7l3.8-2.6" />
      <path d="M12 11 7.2 7.9M12 11l4.8-3.1" />
      <path d="M12 15.4 6.4 11.6M12 15.4l5.6-3.8" />
      <path d="M12 20 5.8 15.6M12 20l6.2-4.4" />
    </svg>
  );
}

export function HarborHorizon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M3 15h18" />
      <path d="M6 18.5h12" />
      <path d="M14.5 15c0-4.4-1-7.6-1-9.6 0-.9.5-1.4 1.2-1.4" />
      <path d="M14.7 4c2.9 1.9 4.8 6.2 5 11" />
      <path d="M9 15c0-2.4.6-4.4 1.8-5.8" />
    </svg>
  );
}
