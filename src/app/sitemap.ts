import type { MetadataRoute } from "next";
import { vehicles } from "@/data/vehicles";

const base = "https://achraf-location.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/vehicules",
    "/experiences",
    "/comparer",
    "/recommandation",
    "/espace-client",
    "/reservation",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const vehicleRoutes = vehicles.map((v) => ({
    url: `${base}/vehicules/${v.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
