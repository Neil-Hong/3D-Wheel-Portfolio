"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";

interface WebGLBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface WebGLBoundaryState {
  failed: boolean;
}

/** Catches render/effect errors from the WebGL scene (e.g. context creation). */
class WebGLErrorBoundary extends Component<
  WebGLBoundaryProps,
  WebGLBoundaryState
> {
  state: WebGLBoundaryState = { failed: false };

  static getDerivedStateFromError(): WebGLBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("WebGL scene failed, showing static fallback.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

let webglSupport: boolean | undefined;

function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

/**
 * Renders `children` only when WebGL is available and keeps rendering
 * `fallback` if the scene throws. During SSR and hydration the children are
 * assumed supported (they are client-only and render nothing on the server).
 */
export default function WebGLBoundary({ children, fallback }: WebGLBoundaryProps) {
  const supported = useSyncExternalStore(noopSubscribe, detectWebGL, () => true);

  if (!supported) {
    return fallback;
  }

  return <WebGLErrorBoundary fallback={fallback}>{children}</WebGLErrorBoundary>;
}
