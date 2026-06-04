import tier1Icon from '../assets/tier1_icon.png'
import tier2Icon from '../assets/tier2_icon.png'
import tier3Icon from '../assets/tier3_icon.png'
import tier4Icon from '../assets/tier4_icon.png'
import tier5Icon from '../assets/tier5_icon.png'
import tier6Icon from '../assets/tier6_icon.png'
import tier7Icon from '../assets/tier7_icon.png'
import { maxTier, tierNames } from './tierConfig.js'

export { maxTier, tierNames }

export const tierIcons = {
  1: tier1Icon,
  2: tier2Icon,
  3: tier3Icon,
  4: tier4Icon,
  5: tier5Icon,
  6: tier6Icon,
  7: tier7Icon,
}

export function getTierName(tier) {
  return tierNames[tier] ?? tierNames[1]
}

export function getTierIcon(tier) {
  return tierIcons[tier] ?? tierIcons[1]
}
