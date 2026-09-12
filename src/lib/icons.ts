import {
  Baby,
  Flower2,
  Plane,
  UserCog,
  Wifi,
  UserPlus,
  ShieldCheck,
  MapPinned,
  PackagePlus,
  Moon,
  Building2,
  Mountain,
  Heart,
  Briefcase,
  Users,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Baby,
  Flower2,
  Plane,
  UserCog,
  Wifi,
  UserPlus,
  ShieldCheck,
  MapPinned,
  PackagePlus,
  Moon,
  Building2,
  Mountain,
  Heart,
  Briefcase,
  Users,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Baby;
}
