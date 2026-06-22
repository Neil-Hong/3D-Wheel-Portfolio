"use client";

import { ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(0.35);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
