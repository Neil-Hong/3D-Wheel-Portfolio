"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/projects";
import type { ProgressStore } from "@/lib/progress-store";
import type { Project } from "@/types";

const PANEL_ARC = 0.55;
const MOBILE_PANEL_ARC = 0.34;
const PANEL_SEGMENTS = 36;
const WHEEL_STEP = 0.65;
const MOBILE_WHEEL_STEP = 0.4;
const VISIBLE_OFFSET = 2.35;

projects.forEach((project) => {
  useTexture.preload(project.image);
});

interface ProjectWheel3DProps {
  progress: ProgressStore;
  activeIndex: number;
}

interface CurvedPanelProps {
  project: Project;
  index: number;
  progress: ProgressStore;
  geometry: THREE.BufferGeometry;
  wheelRadius: number;
  wheelStep: number;
}

/**
 * Builds one curved panel centred at angle 0 on a circle of `radius` whose
 * centre sits at (0, 0, radius). Panels are then placed on the wheel by
 * rotating around that centre, so the geometry never has to be rebuilt
 * while scrolling.
 */
function createWheelPanel(width: number, radius: number, panelArc: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= PANEL_SEGMENTS; row += 1) {
    const v = row / PANEL_SEGMENTS;
    const theta = (v - 0.5) * panelArc;
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
  geometry,
  wheelRadius,
  wheelStep,
}: CurvedPanelProps) {
  const pivotRef = useRef<THREE.Group>(null);
  const sourceTexture = useTexture(project.image);
  const colorTexture = useMemo(() => {
    const texture = sourceTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [sourceTexture]);

  useEffect(() => () => colorTexture.dispose(), [colorTexture]);

  // Rotate the panel around the wheel centre instead of rebuilding geometry.
  // A panel at angle θ on the original arc equals the angle-0 panel rotated
  // by -θ around the x-axis through (0, 0, radius).
  useFrame(() => {
    const pivot = pivotRef.current;
    if (!pivot) {
      return;
    }

    const offset = index - progress.get();
    pivot.visible = Math.abs(offset) < VISIBLE_OFFSET;
    pivot.rotation.x = -offset * wheelStep;
  });

  return (
    <group ref={pivotRef} position={[0, 0, wheelRadius]}>
      <mesh geometry={geometry} position={[0, 0, -wheelRadius]}>
        <meshBasicMaterial
          map={colorTexture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ProjectWheelScene({ progress, activeIndex }: ProjectWheel3DProps) {
  const viewport = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const isMobile = size.width < 768;
  const wheelStep = isMobile ? MOBILE_WHEEL_STEP : WHEEL_STEP;
  const wheelRadius = viewport.height * (isMobile ? 1.22 : 1.38);
  const width = viewport.width * (isMobile ? 0.92 : 0.72);
  const panelArc = Math.min(
    isMobile ? MOBILE_PANEL_ARC : PANEL_ARC,
    wheelStep - (isMobile ? 0.04 : 0.06),
  );

  // One shared geometry for every panel; only rebuilt on resize.
  const geometry = useMemo(
    () => createWheelPanel(width, wheelRadius, panelArc),
    [panelArc, wheelRadius, width]
  );

  useEffect(() => () => geometry?.dispose(), [geometry]);

  // frameloop="demand": render a frame only when scroll progress changes.
  useEffect(() => progress.subscribe(() => invalidate()), [invalidate, progress]);

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
            geometry={geometry}
            wheelRadius={wheelRadius}
            wheelStep={wheelStep}
          />
        ) : null,
      )}
    </group>
  );
}

export default function ProjectWheel3D({
  progress,
  activeIndex,
}: ProjectWheel3DProps) {
  return (
    <Canvas
      dpr={[1, 1.35]}
      frameloop="demand"
      camera={{ position: [0, 0, 7.6], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true }}
      className="project-wheel-canvas absolute inset-0"
    >
      <ProjectWheelScene progress={progress} activeIndex={activeIndex} />
      <Preload all />
    </Canvas>
  );
}
