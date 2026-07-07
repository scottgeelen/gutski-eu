import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GUTSKI — Skipullies & après-ski-truien",
    short_name: "GUTSKI",
    description: "Custom skipullies en après-ski-truien bedrukken voor clubs, vriendengroepen en bedrijven.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A1322",
    theme_color: "#0A1322",
    lang: "nl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
