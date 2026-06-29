"use client";

import { useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

const PANEL_ARC = 0.55;
const MOBILE_PANEL_ARC = 0.34;
const PANEL_SEGMENTS = 36;
const WHEEL_STEP = 0.65;
const MOBILE_WHEEL_STEP = 0.4;

projects.forEach((project) => {
  useTexture.preload(project.image);
});

interface ProjectWheel3DProps {
  progress: number;
}

interface CurvedPanelProps {
  project: Project;
  index: number;
  progress: number;
  viewportWidth: number;
  viewportHeight: number;
  isMobile: boolean;
}

function createWheelPanel(
  width: number,
  radius: number,
  centerAngle: number,
  panelArc: number
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= PANEL_SEGMENTS; row += 1) {
    const v = row / PANEL_SEGMENTS;
    const theta = centerAngle + (v - 0.5) * panelArc;
    const y = -Math.sin(theta) * radius;
    const z = (1 - Math.cos(theta)) * radius;

    for (let column = 0; column <= 1; column += 1) {
      const u = column;
      positions.push((u - 0.5) * width, y, z);
      uvs.push(u, 1 - v);
    }
  }

  for (let row = 0; row < PANEL_SEGMENTS; row += 1) {
    const base = row * 2;
    indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function CurvedProjectPanel({
  project,
  index,
  progress,
  viewportWidth,
  viewportHeight,
  isMobile,
}: CurvedPanelProps) {
  const sourceTexture = useTexture(project.image);
  const colorTexture = useMemo(() => {
    const texture = sourceTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [sourceTexture]);

  useEffect(() => () => colorTexture.dispose(), [colorTexture]);
  const offset = index - progress;
  const wheelStep = isMobile ? MOBILE_WHEEL_STEP : WHEEL_STEP;
  const centerAngle = offset * wheelStep;
  const wheelRadius = viewportHeight * (isMobile ? 1.22 : 1.38);
  const visible = Math.abs(offset) < 2.35;
  const width = viewportWidth * (isMobile ? 0.92 : 0.72);
  const panelArc = Math.min(
    isMobile ? MOBILE_PANEL_ARC : PANEL_ARC,
    wheelStep - (isMobile ? 0.04 : 0.06),
  );

  const geometry = useMemo(
    () => (visible ? createWheelPanel(width, wheelRadius, centerAngle, panelArc) : null),
    [centerAngle, panelArc, visible, wheelRadius, width]
  );

  useEffect(() => () => geometry?.dispose(), [geometry]);

  if (!geometry) {
    return null;
  }

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        map={colorTexture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function ProjectWheelScene({ progress }: ProjectWheel3DProps) {
  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const isMobile = size.width < 768;
  const activeIndex = Math.round(progress);
  return (
    <group
      position={[0, 0, -0.42]}
      rotation={[0, 0, THREE.MathUtils.degToRad(7)]}
    >
      {projects.map((project, index) =>
        Math.abs(index - activeIndex) <= 2 ? (
          <CurvedProjectPanel
            key={project.slug}
            project={project}
            index={index}
            progress={progress}
            viewportWidth={viewport.width}
            viewportHeight={viewport.height}
            isMobile={isMobile}
          />
        ) : null,
      )}
    </group>
  );
}

export default function ProjectWheel3D({ progress }: ProjectWheel3DProps) {
  return (
    <Canvas
      dpr={[1, 1.35]}
      frameloop="demand"
      camera={{ position: [0, 0, 7.6], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true }}
      className="project-wheel-canvas absolute inset-0"
    >
      <ProjectWheelScene progress={progress} />
      <Preload all />
    </Canvas>
  );
}
