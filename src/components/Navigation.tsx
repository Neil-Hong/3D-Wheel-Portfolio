import Link from "next/link";
import { navigation } from "@/data/projects";

export default function Navigation() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 mix-blend-difference">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start px-5 py-5 text-[13px] leading-none text-white md:px-8 md:py-7">
        <Link
          href="/"
          className="w-fit transition-opacity duration-300 hover:opacity-50"
        >
          Andreas Antonsson
        </Link>

        <div className="flex items-center gap-5">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-opacity duration-300 hover:opacity-50"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <a
          href="mailto:andreas@unna.studio"
          className="justify-self-end transition-opacity duration-300 hover:opacity-50"
        >
          Available for work
        </a>
      </div>
    </nav>
  );
}
