import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RosterBuddy — Fantasy Football Coach",
    short_name: "RosterBuddy",
    description: "Beginner-friendly fantasy football lineup, waiver, and learning companion.",
    start_url: "/",
    display: "standalone",
    background_color: "#060b14",
    theme_color: "#060b14",
    icons: [],
  };
}
