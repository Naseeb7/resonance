import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resonance",
    short_name: "Resonance",
    description:
      "A calm daily speech therapy experience focused on articulation confidence, guided practice, and supportive progression.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eef3f3",
    theme_color: "#eef3f3",
    orientation: "portrait",
    lang: "en-US",
    categories: ["health", "medical", "education"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
