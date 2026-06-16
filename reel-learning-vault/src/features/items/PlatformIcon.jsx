import { Instagram, Youtube, Linkedin, Twitter, Facebook, Globe } from 'lucide-react';
import { platformById } from '../../lib/constants.js';

const ICONS = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  other: Globe,
};

// Small rounded platform chip tinted with the brand colour of the platform.
export default function PlatformIcon({ platform, className = 'h-8 w-8' }) {
  const meta = platformById(platform);
  const Icon = ICONS[platform] || Globe;
  return (
    <span
      className={`flex items-center justify-center rounded-lg ${className}`}
      style={{ backgroundColor: `${meta.color}1A`, color: meta.color }}
      title={meta.label}
      aria-label={meta.label}
    >
      <Icon className="h-[55%] w-[55%]" />
    </span>
  );
}
