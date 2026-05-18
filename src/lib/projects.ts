import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type GalleryShot = {
  src: string;
  alt: string;
  layout: "wide" | "portrait";
};

export type Project = {
  slug: string;
  order: number;
  name: string;
  nameHtml?: string;
  titleBg: string;
  location: string;
  locationFull: string;
  year: string;
  yearFull: string;
  programme: string;
  area: string;
  status: string;
  theme: "dark" | "light";
  ctaLabel: string;
  preview: string;
  gallery: GalleryShot[];
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export function getProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      ...(data as Omit<Project, "body">),
      body: content.trim(),
    } as Project;
  });
  return projects.sort((a, b) => a.order - b.order);
}
