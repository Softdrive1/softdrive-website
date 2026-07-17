"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* "Arcade Machine" by Erdem Dağdelen
   (https://sketchfab.com/3d-models/arcade-machine-69409b165c2c418c8f78a5b32cec5c02),
   CC BY 4.0.
   ⚠️ The playable screen is the material named "material", NOT "game" ("game"
   is a small prop on the control panel). The screen is a flat quad in world
   space — x ±58.43, y 268.79→362.65, z 13.52→−8.12 — i.e. tilted back 13°.
   The camera sits on the screen's NORMAL axis (looking down those 13°), so
   the screen projects as an exact axis-aligned rectangle and SCREEN_RECT
   below is derived from the numbers, not eyeballed. The math only holds
   while the shared container's CSS aspect-ratio equals ASPECT and nothing
   in the scene moves — hence: fixed camera, no idle animation. */

// Screen-plane basis, from the quad's vertices
const U = new THREE.Vector3(0, 93.86, -21.64).normalize(); // up along the screen
const N = new THREE.Vector3(0, 21.64, 93.86).normalize(); // out of the screen
const CENTER = new THREE.Vector3(0, 315.72, 2.7); // screen center (world)
const HALF_W = 58.43;
const HALF_H = 48.16;

const FOV = 20; // long lens — keeps the forward-jutting marquee/panel inside frame
const DIST = 879; // camera distance along N; VIS_H spans marquee → control panel
const FRAME_UP = 31.1; // frame center, world units up the screen plane from CENTER
export const ASPECT = 0.84; // container width / height — must match the CSS

const VIS_H = 2 * DIST * Math.tan((FOV * Math.PI) / 360); // ≈310 world units
const VIS_W = VIS_H * ASPECT;

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

/* Where the screen quad lands inside the container, as CSS percentages. */
export const SCREEN_RECT = {
  left: pct(0.5 - HALF_W / VIS_W),
  width: pct((2 * HALF_W) / VIS_W),
  top: pct(0.5 - (HALF_H - FRAME_UP) / VIS_H),
  height: pct((2 * HALF_H) / VIS_H),
};

/* Marquee front face (x ±108, y ≈445–487, z ≈53–73) projected under the same
   camera — it juts toward the viewer, so this box is projected + hand-trimmed
   rather than exact. Keystone across it is ~1%, invisible for a logo. */
export const MARQUEE_RECT = {
  left: "14%",
  width: "72%",
  top: "6.5%",
  height: "13.5%",
};

const LOOK_AT = CENTER.clone().addScaledVector(U, FRAME_UP);
const CAMERA_POS = LOOK_AT.clone().addScaledVector(N, DIST);

// Same mobile GPU precaution as the synth scene.
const DPR: [number, number] =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches
    ? [1, 1.5]
    : [1, 2];

function CabinetModel() {
  const { scene } = useGLTF("/models/arcade.glb");
  // No <Center>, no fit-scaling: all camera/overlay math is in the model's
  // own world units, so the scene must stay at identity.
  return <primitive object={scene} />;
}

function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.up.copy(U);
    camera.position.copy(CAMERA_POS);
    camera.lookAt(LOOK_AT);
  }, [camera, size]);
  return null;
}

/* Same rationale as SynthScene: preventDefault lets the browser restore a
   lost WebGL context; the always-on frameloop repaints on its own. */
function ContextLossGuard() {
  const { gl } = useThree();
  useEffect(() => {
    const onLost = (e: Event) => e.preventDefault();
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl]);
  return null;
}

export default function ArcadeCabinet() {
  return (
    <Canvas
      camera={{ position: CAMERA_POS.toArray(), fov: FOV, near: 100, far: 3000 }}
      gl={{ antialias: true, alpha: true }}
      dpr={DPR}
      // pure decoration — never intercept game pointers or page scroll
      style={{ pointerEvents: "none" }}
    >
      <ContextLossGuard />
      <CameraRig />
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 6, 6]} intensity={1.8} />
      <Suspense fallback={null}>
        <CabinetModel />
      </Suspense>
    </Canvas>
  );
}
