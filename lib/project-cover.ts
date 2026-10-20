import type { Project } from "@/lib/dummy-data";

export function getProjectCover(project: Pick<Project, "imageUrl" | "galleryImages">) {
  return project.imageUrl || project.galleryImages?.[0] || null;
}

export function getProjectPlaceholderClass(domain: string | null) {
  switch (domain) {
    case "Oil & Gas":
      return "bg-gradient-to-br from-[#13291d] via-[#31553c] to-[#637d61]";
    case "Geothermal":
      return "bg-gradient-to-br from-[#7c2d12] via-[#c65f2b] to-[#f2b27d]";
    case "Mining":
      return "bg-gradient-to-br from-[#3d261b] via-[#765039] to-[#b18a65]";
    case "Hydrogeology":
      return "bg-gradient-to-br from-[#123b5d] via-[#28739a] to-[#8cc8d8]";
    case "Engineering Geophysics":
      return "bg-gradient-to-br from-[#35205c] via-[#66439a] to-[#b296d2]";
    default:
      return "bg-gradient-to-br from-[#374151] via-[#6b7280] to-[#d1d5db]";
  }
}
