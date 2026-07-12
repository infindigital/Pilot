"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GPU ember particle field rendered behind the content. Additive-blended
 * points that rise, flicker, and recycle. Kept deliberately light
 * (count scales down on small screens) to protect 60fps.
 */
function Embers({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.15 + Math.random() * 0.5;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, seeds };
  }, [count]);

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,200,120,1)");
    g.addColorStop(0.3, "rgba(255,120,40,0.8)");
    g.addColorStop(1, "rgba(255,80,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.getElapsedTime();
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * 0.016;
      arr[i * 3] += Math.sin(t * 0.5 + seeds[i]) * 0.004;
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y = Math.sin(t * 0.05) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

export default function EmberField({
  className = "",
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 120;
    const base = window.innerWidth < 768 ? 70 : 180;
    return Math.round(base * density);
  }, [density]);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <Embers count={count} />
      </Canvas>
    </div>
  );
}
