"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/balon-energia.glb");

const ACID = new THREE.Color("#e8ff00");
const BLANCO = new THREE.Color("#f0f0ee");

function RotatingArt() {
  const { scene } = useGLTF("/balon-energia.glb");
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  // Tinte de marca: todo el arte en amarillo ácido con un leve autobrillo,
  // como la bota original — la pieza lee como un neón sobre el negro.
  // Se hace en useMemo (durante el render) para que <Center> y <Bounds>
  // midan la escena YA sin el campo: con visible=false u ocultado en un
  // efecto, el auto-encuadre seguiría contando las piezas gigantes.
  useMemo(() => {
    const size = new THREE.Vector3();
    const gigantes: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      // La escena trae el campo y dos láminas de miles de unidades; los
      // jugadores, el balón y los fragmentos miden ~200. Solo queremos
      // a los jugadores.
      mesh.geometry.computeBoundingBox();
      mesh.geometry.boundingBox!.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 500) {
        gigantes.push(mesh);
        return;
      }
      // El balón son las piezas pequeñas (~23 unidades): va en blanco
      const tono = maxDim < 40 ? BLANCO : ACID;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (!mat || !mat.color) return;
        // Los colores por vértice del original ensucian el tinte de marca
        mat.vertexColors = false;
        // El export trae capas con opacidad 0-20% (arte en "cristales"):
        // sin esto los jugadores se ven fantasma
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
        mat.color.copy(tono);
        mat.emissive = tono.clone();
        mat.emissiveIntensity = 0.25;
        mat.metalness = 0.15;
        mat.roughness = 0.55;
        mat.needsUpdate = true;
      });
    });
    gigantes.forEach((m) => m.removeFromParent());
  }, [scene]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Los jugadores giran en continuo (como la bota original) + parallax
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
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // The render loop only runs while the hero is actually on screen;
  // past the fold the GPU goes idle instead of spinning art nobody sees.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.3, 3], fov: 35 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
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
            <RotatingArt />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}
