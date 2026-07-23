import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base(props: IconProps, paths: ReactNode) {
  const { size = 18, className, ...rest } = props
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths}
    </svg>
  )
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconBuilding(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 20V7.5L12 3l8 4.5V20" {...stroke} />
      <path d="M9 20v-5h6v5" {...stroke} />
      <path d="M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01" {...stroke} />
    </>,
  )
}

export function IconBriefcase(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" {...stroke} />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...stroke} />
      <path d="M3 13h18" {...stroke} />
    </>,
  )
}

export function IconUsers(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="9" cy="8" r="3" {...stroke} />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" {...stroke} />
      <circle cx="17" cy="9" r="2.5" {...stroke} />
      <path d="M16 19a4.5 4.5 0 0 1 4.5-4.2" {...stroke} />
    </>,
  )
}

export function IconUser(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="8" r="3.5" {...stroke} />
      <path d="M5 19.5a7 7 0 0 1 14 0" {...stroke} />
    </>,
  )
}

export function IconMail(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" {...stroke} />
      <path d="M4 8l8 5.5L20 8" {...stroke} />
    </>,
  )
}

export function IconPhone(props: IconProps) {
  return base(
    props,
    <>
      <path
        d="M8.5 3.5h3l1.2 3.2-1.8 1.2a12 12 0 0 0 5.2 5.2l1.2-1.8 3.2 1.2v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 7.7a2 2 0 0 1 2-2.2z"
        {...stroke}
      />
    </>,
  )
}

export function IconCalendar(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" {...stroke} />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" {...stroke} />
      <path d="M8 14h.01M12 14h.01M16 14h.01" {...stroke} />
    </>,
  )
}

export function IconClipboard(props: IconProps) {
  return base(
    props,
    <>
      <rect x="6" y="4.5" width="12" height="16" rx="2" {...stroke} />
      <path d="M9 4.5a3 3 0 0 0 6 0" {...stroke} />
      <path d="M9 11h6M9 14.5h6" {...stroke} />
    </>,
  )
}

export function IconPen(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 20l4.2-1.1L19 8.1a2.1 2.1 0 0 0-3-3L5.2 15.9 4 20z" {...stroke} />
      <path d="M13.5 6.5l3 3" {...stroke} />
    </>,
  )
}

export function IconLock(props: IconProps) {
  return base(
    props,
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" {...stroke} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" {...stroke} />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </>,
  )
}

export function IconKey(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="8" cy="14" r="3.5" {...stroke} />
      <path d="M11 12.5 20.5 3M17 3.5l3 3" {...stroke} />
    </>,
  )
}

export function IconSend(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 11.5 20 4l-5.5 16-3.2-6.3L4 11.5z" {...stroke} />
      <path d="M11.3 13.7 20 4" {...stroke} />
    </>,
  )
}

export function IconReset(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.6" {...stroke} />
      <path d="M4 4v5h5" {...stroke} />
    </>,
  )
}

export function IconCheck(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M8 12.5 10.8 15.2 16 9.5" {...stroke} />
    </>,
  )
}

export function IconDoor(props: IconProps) {
  return base(
    props,
    <>
      <path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4H14v16H6.5A1.5 1.5 0 0 1 5 18.5" {...stroke} />
      <path d="M14 4h3.5A1.5 1.5 0 0 1 19 5.5V20" {...stroke} />
      <circle cx="11.2" cy="12" r="0.8" fill="currentColor" />
    </>,
  )
}

/** Marca / logo Península */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="46" height="46" rx="12" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path
        d="M10 34V16.5L24 9l14 7.5V34"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 34v-8h10v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="20" r="2.2" fill="currentColor" opacity="0.9" />
      <path
        d="M8 38h32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}
