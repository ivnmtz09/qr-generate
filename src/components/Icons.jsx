export function StarIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 0c.9 7.1 4.9 11.1 12 12-7.1.9-11.1 4.9-12 12-.9-7.1-4.9-11.1-12-12C7.1 11.1 11.1 7.1 12 0Z" />
    </svg>
  )
}

export function ArrowDownIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 3v17" />
      <path d="m5 13 7 7 7-7" />
    </svg>
  )
}

export function ArrowUpRightIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M6 18 18 6" />
      <path d="M7 6h11v11" />
    </svg>
  )
}

export function DownloadIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M12 3v12" />
      <path d="m6 10 6 6 6-6" />
      <path d="M4 20h16" />
    </svg>
  )
}

export function CheckIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m5 12 5 5L20 6" />
    </svg>
  )
}

export function XIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function ImageIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" />
      <circle cx="8.5" cy="9" r="1.8" fill="currentColor" stroke="none" />
      <path d="m4 17 4.5-4.5 4 4 3-3L20 18" />
    </svg>
  )
}

export function LinkIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
    </svg>
  )
}

export function SlidersIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M3 6h10M17 6h4M3 12h3M11 12h10M3 18h13M20 18h1" />
      <rect x="13" y="3" width="4" height="6" fill="currentColor" stroke="none" />
      <rect x="7" y="9" width="4" height="6" fill="currentColor" stroke="none" />
      <rect x="16" y="15" width="4" height="6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FileIcon({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M5 2h9l5 5v15H5V2Z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  )
}

export function QrMark({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M3 3h9v9H3V3Zm2.5 2.5v4h4v-4h-4ZM20 3h9v9h-9V3Zm2.5 2.5v4h4v-4h-4ZM3 20h9v9H3v-9Zm2.5 2.5v4h4v-4h-4Z" />
      <path d="M15 3h3v3h-3zM15 9h3v3h-3zM2 15h3v3H2zM8 15h3v3H8zM14 15h4v4h-4zM20 15h3v3h-3zM26 15h4v3h-4zM15 22h3v4h-3zM20 20h3v3h-3zM25 22h4v3h-4zM20 26h4v3h-4zM26 27h3v2h-3z" />
    </svg>
  )
}

export function GhostQr({ className = '', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="6" />
      <rect x="13" y="13" width="6" height="6" fill="currentColor" />
      <rect x="68" y="4" width="24" height="24" stroke="currentColor" strokeWidth="6" />
      <rect x="77" y="13" width="6" height="6" fill="currentColor" />
      <rect x="4" y="68" width="24" height="24" stroke="currentColor" strokeWidth="6" />
      <rect x="13" y="77" width="6" height="6" fill="currentColor" />
      <path
        d="M36 4h6v6h-6zM46 4h4v4h-4zM54 4h4v8h-4zM36 14h10v4H36zM50 16h6v4h-6zM60 6h4v4h-4zM36 36h6v6h-6zM46 36h10v4H46zM60 34h4v10h-4zM68 36h6v6h-6zM80 34h10v4H80zM36 48h4v10h-4zM44 46h8v4h-8zM56 44h6v8h-6zM66 46h8v4h-8zM78 44h4v10h-4zM86 44h4v4h-4zM36 62h6v6h-6zM46 60h4v10h-4zM54 58h8v4h-8zM66 58h6v8h-6zM76 58h4v4h-4zM84 56h6v10h-6zM40 74h8v4h-8zM52 72h4v10h-4zM60 74h10v4H60zM74 74h6v6h-6zM84 74h6v6h-6zM46 84h8v4h-8zM60 84h6v4h-6zM72 84h4v4h-4zM84 84h6v4h-6z"
        fill="currentColor"
      />
    </svg>
  )
}
