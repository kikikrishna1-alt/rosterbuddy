"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/team", label: "Team", icon: "👥" },
  { href: "/start-sit", label: "Start/Sit", icon: "⚖️" },
  { href: "/waivers", label: "Waivers", icon: "🔎" },
  { href: "/learn", label: "Learn", icon: "🎓" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-navy-950/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold transition-colors ${
                active ? "text-lime" : "text-white/45"
              }`}
            >
              <span className={`text-lg leading-none ${active ? "scale-110" : ""} transition-transform`}>
                {item.icon}
              </span>
              {item.label}
              <span
                className={`mt-0.5 h-1 w-1 rounded-full ${active ? "bg-lime" : "bg-transparent"}`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
