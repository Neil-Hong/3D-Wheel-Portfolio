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
  awards?: string[];
  color: string;
  detailTheme: ProjectDetailTheme;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ProjectIndicator {
  slug: string;
  title: string;
  index: number;
}
