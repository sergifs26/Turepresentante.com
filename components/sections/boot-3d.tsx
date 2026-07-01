"use client";

import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/bota.glb");

const ACID = new THREE.Color("#e8ff00");

function RotatingBoot() {
  const { scene } = useGLTF("/bota.glb");
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Tint every material toward acid — keeps the scanned geometry/normals/detail,
  // multiplies the texture by the brand color so the boot reads as neon yellow.
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (!mat || !mat.color) return;
        mat.color.copy(ACID);
        mat.emissive = ACID.clone().multiplyScalar(0.15);
        mat.metalness = 0.15;
        mat.roughness = 0.55;
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.35;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouse.current.y * 0.22, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -mouse.current.x * 0.08, 0.05);
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default function Boot3D() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 3], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      {/* Neutral lights give realistic form; the acid color lives in the material */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-5, 2, -3]} intensity={0.9} />
      {/* White rim from behind for a crisp highlighted edge */}
      <spotLight position={[0, 3, -5]} angle={0.8} penumbra={1} intensity={18} color="#ffffff" />

      <Suspense fallback={null}>
        <Bounds fit clip margin={1.15}>
          <RotatingBoot />
        </Bounds>
      </Suspense>
    </Canvas>
  );
}
