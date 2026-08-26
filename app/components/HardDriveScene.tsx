"use client";

import { useRef, useEffect, useMemo, Suspense, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

/* ── Scroll-reactive + drag-rotatable hard drive ─────── */

// Shared drag state, written by the DOM pointer handlers in HardDriveSection
// and consumed here each frame. Kept out of the r3f tree so the scene never
// mutates the canvas element (React Compiler forbids mutating useThree's gl).
export type DragControl = { dragging: boolean; pendingY: number; manualX: number };

function HardDriveModel({ controlRef }: { controlRef: RefObject<DragControl> }) {
  const { scene } = useGLTF("/models/softdrive.glb");
  const groupRef = useRef<THREE.Group>(null);
  const scrollVelRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const wasDraggingRef = useRef(false);
  const lastFlickRef = useRef(0);

  // Auto-scale so the model fills ~3 world units regardless of source size
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 3 / maxDim : 1;
  }, [scene]);

  useEffect(() => {
    const onScroll = () => {
      const dy = window.scrollY - lastScrollYRef.current;
      scrollVelRef.current += dy * 0.0008;
      lastScrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const c = controlRef.current;

    if (c.dragging) {
      // Direct manual control: apply this frame's accumulated drag, remember it
      // as the flick velocity, and hold the idle spin.
      g.rotation.y += c.pendingY;
      lastFlickRef.current = c.pendingY;
      c.pendingY = 0;
      g.rotation.x = c.manualX;
    } else {
      // Just released → hand the flick to the decaying spin below.
      if (wasDraggingRef.current) {
        scrollVelRef.current = lastFlickRef.current;
        lastFlickRef.current = 0;
      }
      // Idle auto-rotation
      g.rotation.y += delta * 0.28;
      // X tilt eases back toward the scroll-driven tilt
      const targetX = lastScrollYRef.current * 0.0002;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.04);
      c.manualX = g.rotation.x; // keep synced so the next drag starts from here
    }

    // Scroll- and flick-velocity boost (decays naturally)
    g.rotation.y += scrollVelRef.current;
    scrollVelRef.current *= 0.86;

    wasDraggingRef.current = c.dragging;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Center>
        <primitive object={scene} scale={scale} />
      </Center>
    </group>
  );
}

/* ── Wireframe box shown while GLB loads ─────────────── */

function LoadingBox() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.6;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 0.5, 1.4]} />
      <meshStandardMaterial color="#7EC8E3" wireframe opacity={0.5} transparent />
    </mesh>
  );
}

/* ── Canvas export ───────────────────────────────────── */

export default function HardDriveScene({
  controlRef,
}: {
  controlRef: RefObject<DragControl>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.25, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      {/* Studio lighting — clean premium look */}
      <ambientLight intensity={1.4} />
      <directionalLight position={[6, 8, 4]} intensity={2.2} />
      <directionalLight position={[-5, 3, -3]} intensity={0.7} color="#B8DFF0" />
      <pointLight position={[0, 4, 3]} intensity={1} color="#ffffff" />
      <pointLight position={[2, -2, 2]} intensity={0.4} color="#7EC8E3" />

      <Suspense fallback={<LoadingBox />}>
        <HardDriveModel controlRef={controlRef} />
      </Suspense>
    </Canvas>
  );
}
