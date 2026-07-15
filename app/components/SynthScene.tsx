"use client";

import { useRef, useMemo, useEffect, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { playKey } from "./synthAudio";

/* "Chunky Synth" by MrEliptik (https://skfb.ly/6UGXN), CC BY 4.0.
   The 12 keys are separate nodes named White / White.001 … and
   Black / Black.001 … (black numbering is non-contiguous — match by
   prefix, never by exact list). Key geometry is baked in model space
   (node transforms are identity), so left-to-right order comes from
   bounding-box centers, not node positions.
   ⚠️ GLTFLoader strips dots from node names (sanitizeNodeName), so
   "White.001" arrives as "White001" — match both spellings. */
const KEY_NAME = /^(White|Black)\.?\d*$/;

const CAMERA_POS = new THREE.Vector3(0, 2, 5.6);
const CAMERA_FOV = 38;

const PRESS_DEPTH = 0.05; // model units straight down
const PRESS_TILT = 0.03; // rad — hinge dips the key front a bit more
const RELEASE_RATE = 14; // 1/s exponential spring-back (~100ms)

function SynthModel() {
  const { scene } = useGLTF("/models/ChunkySynth.glb");
  const bobRef = useRef<THREE.Group>(null);
  const keyMapRef = useRef(new Map<THREE.Mesh, number>());
  const pressedRef = useRef(new Map<THREE.Mesh, number>());
  const cursorOnRef = useRef(false);
  const { size } = useThree();

  // Fit the keyboard (long axis = model Z) to the visible width at the
  // origin plane — on narrow screens it nearly fills the frame so keys
  // stay comfortably tappable.
  const scale = useMemo(() => {
    // Transient 0-sized measurements during mount/resize churn make the
    // aspect (and thus the scale) explode to Infinity/NaN — the model then
    // renders as flat color bands ("stripes" bug) or vanishes for a frame.
    // Render at neutral scale instead; the next size event corrects it.
    if (!(size.width > 0) || !(size.height > 0)) return 1;
    const box = new THREE.Box3().setFromObject(scene);
    const length = box.getSize(new THREE.Vector3()).z || 1;
    const aspect = size.width / size.height;
    const dist = CAMERA_POS.length();
    const visibleWidth =
      2 * dist * Math.tan((CAMERA_FOV * Math.PI) / 360) * aspect;
    const fill = aspect < 0.9 ? 0.95 : 0.62;
    // Clamp hard: at scale ≤ 2 the model's half-length stays inside the
    // camera distance, so a bad measurement can never put the camera
    // inside the model (which renders as full-width color bands).
    const s = THREE.MathUtils.clamp((visibleWidth * fill) / length, 0.05, 2);
    // TODO temporary debug logging for the stripes bug — remove when solved
    console.log(
      `[synth] scale=${s.toFixed(3)} size=${size.width}x${size.height} len=${length.toFixed(2)}`
    );
    return s;
  }, [scene, size]);

  // Repaint mislabeled factory materials: "Black.001" is the pink edge/side
  // trim (node "Side.002") → dark brown; "Black" is the baby-blue main body
  // (node "Support") → lighter warm Juno-60 brown.
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        const m = mat as THREE.MeshStandardMaterial;
        if (!m.color) continue;
        if (m.name === "Black.001") m.color.set("#503a2a");
        else if (m.name === "Black") m.color.set("#6e4f3a");
      }
    });
  }, [scene]);

  // Collect the 12 key meshes and map them to key 1…12 by world X.
  useEffect(() => {
    const entries: { mesh: THREE.Mesh; x: number }[] = [];
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !KEY_NAME.test(mesh.name)) return;
      mesh.updateWorldMatrix(true, false);
      mesh.geometry.computeBoundingBox();
      const center = mesh.geometry
        .boundingBox!.getCenter(new THREE.Vector3())
        .applyMatrix4(mesh.matrixWorld);
      entries.push({ mesh, x: center.x });
    });
    entries.sort((a, b) => a.x - b.x);
    const map = new Map<THREE.Mesh, number>();
    entries.forEach(({ mesh }, i) => map.set(mesh, i + 1));
    keyMapRef.current = map;
  }, [scene]);

  useFrame((state, delta) => {
    // Idle: gentle float, no rotation
    if (bobRef.current) {
      bobRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.1) * 0.055;
    }
    // Pressed keys spring back
    pressedRef.current.forEach((amount, mesh) => {
      const next = amount < 0.01 ? 0 : amount * Math.exp(-RELEASE_RATE * delta);
      mesh.position.y = -PRESS_DEPTH * next;
      mesh.rotation.z = -PRESS_TILT * next;
      if (next === 0) pressedRef.current.delete(mesh);
      else pressedRef.current.set(mesh, next);
    });
  });

  const keyFromEvent = useCallback(
    (e: ThreeEvent<PointerEvent>): THREE.Mesh | null => {
      let obj: THREE.Object3D | null = e.object;
      while (obj) {
        if (KEY_NAME.test(obj.name)) return obj as THREE.Mesh;
        obj = obj.parent;
      }
      return null;
    },
    []
  );

  const setCursor = useCallback((on: boolean) => {
    if (cursorOnRef.current === on) return;
    cursorOnRef.current = on;
    document.body.style.cursor = on ? "pointer" : "";
  }, []);

  useEffect(() => () => setCursor(false), [setCursor]);

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const mesh = keyFromEvent(e);
      if (!mesh) return;
      e.stopPropagation();
      const key = keyMapRef.current.get(mesh);
      if (key) playKey(key);
      pressedRef.current.set(mesh, 1);
    },
    [keyFromEvent]
  );

  return (
    <group ref={bobRef}>
      <Center>
        <group rotation-y={-Math.PI / 2} scale={scale}>
          <primitive
            object={scene}
            onPointerDown={onPointerDown}
            onPointerMove={(e: ThreeEvent<PointerEvent>) =>
              setCursor(keyFromEvent(e) !== null)
            }
            onPointerOut={() => setCursor(false)}
          />
        </group>
      </Center>
    </group>
  );
}

function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.copy(CAMERA_POS);
    camera.lookAt(0, -0.1, 0);
  }, [camera, size]);
  return null;
}

/* preventDefault on context loss is required for the browser to restore
   the WebGL context; the always-running frameloop then repaints on its own.
   NOTE: the frameloop is deliberately NOT paused offscreen — any pause
   lets the browser discard the canvas texture mid-scroll, which shows up
   as flat colored stripes (no way to recomposite without a fresh frame). */
function ContextLossGuard() {
  const { gl } = useThree();
  useEffect(() => {
    const onLost = (e: Event) => e.preventDefault();
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    // TODO temporary debug logging for the stripes bug — remove when solved.
    // Logs whenever the drawing buffer or CSS size of the canvas changes.
    let prev = "";
    let raf = 0;
    const watch = () => {
      const cur = `buffer=${canvas.width}x${canvas.height} css=${canvas.clientWidth}x${canvas.clientHeight}`;
      if (cur !== prev) {
        prev = cur;
        console.log(`[synth] ${cur}`);
      }
      raf = requestAnimationFrame(watch);
    };
    raf = requestAnimationFrame(watch);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      cancelAnimationFrame(raf);
    };
  }, [gl]);
  return null;
}

/* Wireframe placeholder while the GLB loads */
function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[3.6, 0.5, 1.6]} />
      <meshStandardMaterial color="#7EC8E3" wireframe opacity={0.5} transparent />
    </mesh>
  );
}

export default function SynthScene() {
  return (
    <Canvas
      camera={{ position: CAMERA_POS.toArray(), fov: CAMERA_FOV }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      // keep vertical page scrolling alive on touch devices
      style={{ touchAction: "pan-y" }}
    >
      <ContextLossGuard />
      <ambientLight intensity={1.35} />
      <directionalLight position={[4, 7, 5]} intensity={2.3} />

      <Suspense fallback={<LoadingBox />}>
        <CameraRig />
        <SynthModel />
      </Suspense>
    </Canvas>
  );
}
