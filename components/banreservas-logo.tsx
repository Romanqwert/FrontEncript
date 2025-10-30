export function BanreservasLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <rect x="20" y="20" width="60" height="60" rx="8" fill="currentColor" />
      <text x="50" y="65" fontSize="48" fontWeight="bold" textAnchor="middle" fill="white" fontFamily="sans-serif">
        R
      </text>
    </svg>
  )
}
