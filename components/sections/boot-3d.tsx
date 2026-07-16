"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/balon-energia.glb");

const ACID = new THREE.Color("#e8ff00");

function RotatingArt() {
  const { scene } = useGLTF("/balon-energia.glb");
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  // Tinte de marca: todo el arte en amarillo ácido con un leve autobrillo,
  // como la bota original — la pieza lee como un neón sobre el negro.
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (!mat) return;
        // El modelo trae una lámina de "cristal oscuro" por encima que
        // apaga todo el arte: fuera
        const nombre = (mat.name || "").toLowerCase();
        if (nombre.includes("glass") || nombre.includes("translucent")) {
          mat.visible = false;
          return;
        }
        if (!mat.color) return;
        // Los colores por vértice del original ensucian el tinte de marca
        mat.vertexColors = false;
        // El export trae capas con opacidad 0-20% (arte en "cristales"):
        // sin esto el modelo entero se ve fantasma
        mat.transparent = false;
        mat.opacity = 1;
        mat.depthWrite = true;
        mat.color.copy(ACID);
        // Relieve plano al que apenas le llega la luz: el neón sale del
        // autobrillo, no de los focos
        mat.emissive = ACID.clone();
        mat.emissiveIntensity = 0.35;
        mat.metalness = 0.1;
        mat.roughness = 0.5;
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // La pieza es un relieve casi plano: nada de giros completos (se vería
  // de canto). Balanceo suave + parallax con el ratón.
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    t.current += delta;
    const sway = Math.sin(t.current * 0.45) * 0.28;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, sway + mouse.current.x * 0.18, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouse.current.y * 0.14, 0.05);
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
