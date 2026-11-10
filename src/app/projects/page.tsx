import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";

const description =
  "Selected Web3, full-stack and 3D projects by Neil Hong, from hackathon winners to client websites.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Neil Hong",
    description,
    siteName: "Neil Hong",
    type: "website",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectGrid />;
}
