import { getTierIcon, getTierName, maxTier } from '../data/tiers'

export function TierBadge({ tier, size = 'medium' }) {
  const displayTier = Math.min(Math.max(Number(tier) || 1, 1), maxTier)

  return (
    <div className={`tier-badge ${size}`}>
      <img alt={`Tier ${displayTier} ${getTierName(displayTier)}`} src={getTierIcon(displayTier)} />
      <div>
        <span>Tier {displayTier}</span>
        <strong>{getTierName(displayTier)}</strong>
      </div>
    </div>
  )
}
