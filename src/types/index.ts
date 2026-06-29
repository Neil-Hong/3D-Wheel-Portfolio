export type ProjectGalleryLayout = "centered" | "alternating";

export interface ProjectDetailTheme {
  background: string;
  foreground: string;
  galleryLayout: ProjectGalleryLayout;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  description: string;
  image: string;
  images: string[];
  role: string[];
  detailTheme: ProjectDetailTheme;
}
