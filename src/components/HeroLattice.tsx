"use client";

import { useEffect, useRef } from "react";
import s from "./Hero.module.css";

/**
 * The hero's depth: the khatam star, extruded and scattered on a lattice in
 * real space. Same construction as the flat SVG lattice elsewhere on the site,
 * so the geometry reads as one system — this one just has thickness and light.
 *
 * Everything is one InstancedMesh, so the whole field is a single draw call.
 * It only mounts where it earns its cost: a fine pointer, a wide viewport, and
 * motion allowed. The CSS lattice stays behind it as the fallback.
 */
/**
 * Turned off for now — flip this to true to bring the field back. Everything
 * below is left intact; with it false nothing mounts and three is never even
 * fetched, since the import() below never runs.
 * Typed as boolean so the rest does not narrow to unreachable code.
 */
const ENABLED: boolean = false;

export default function HeroLattice() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ENABLED) return;
    const el = host.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (coarse || window.innerWidth < 900) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // Loaded on demand so three never lands in the initial bundle.
    import("three").then((THREE) => {
      if (disposed) return;

      const NAVY = 0x003a64;
      const NAVY_DEEP = 0x00223d;
      const AMBER = 0xf8b700;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(NAVY_DEEP, 9, 34);

      const camera = new THREE.PerspectiveCamera(
        38,
        el.clientWidth / el.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 0, 26);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setClearAlpha(0);
      el.appendChild(renderer.domElement);

      /* --- the 8-point star, built the same way as Girih.tsx --- */
      const INNER = 0.76537;
      const shape = new THREE.Shape();
      for (let i = 0; i < 16; i++) {
        const a = (i * 22.5 * Math.PI) / 180;
        const r = i % 2 === 0 ? 1 : INNER;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.06,
        bevelSegments: 2,
        curveSegments: 1,
      });
      geometry.center();

      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff, // tinted per instance
        roughness: 0.44,
        metalness: 0.32,
        flatShading: false,
      });

      /* --- scatter on a khatam lattice, with depth --- */
      type Star = { x: number; y: number; z: number; s: number; spin: number; rate: number };
      const stars: Star[] = [];
      const STEP = 3.6;
      for (let gx = -7; gx <= 7; gx++) {
        for (let gy = -5; gy <= 5; gy++) {
          // the lattice alternates full nodes and half-step nodes
          for (const half of [0, 1]) {
            const x = gx * STEP + half * STEP * 0.5;
            const y = gy * STEP + half * STEP * 0.5;
            if (Math.abs(x) > 26 || Math.abs(y) > 17) continue;
            const jitter = Math.sin(gx * 12.9898 + gy * 78.233 + half * 3.7) * 43758.5453;
            const rnd = jitter - Math.floor(jitter);
            stars.push({
              x,
              y,
              z: -5 - rnd * 24,
              s: 0.42 + rnd * 0.58,
              spin: rnd * Math.PI * 2,
              rate: 0.05 + rnd * 0.11,
            });
          }
        }
      }

      const mesh = new THREE.InstancedMesh(geometry, material, stars.length);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      const navy = new THREE.Color(NAVY);
      const amber = new THREE.Color(AMBER);
      const deep = new THREE.Color(NAVY_DEEP);
      stars.forEach((star, i) => {
        // a handful of amber stars, the rest navy fading back into the ground
        const depth = Math.min(1, (-star.z - 5) / 24);
        const c =
          i % 9 === 4
            ? amber.clone().lerp(deep, 0.1 + depth * 0.45)
            : navy.clone().lerp(deep, 0.18 + depth * 0.6);
        mesh.setColorAt(i, c);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      scene.add(mesh);

      /* --- light: an amber key from the upper right, cool navy fill --- */
      scene.add(new THREE.AmbientLight(0x9fb8cc, 1.15));
      const key = new THREE.DirectionalLight(AMBER, 2.6);
      key.position.set(7, 8, 9);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x2b7bc0, 1.5);
      fill.position.set(-8, -4, 6);
      scene.add(fill);

      const group = new THREE.Group();
      scene.add(group);
      group.add(mesh);

      const dummy = new THREE.Object3D();
      const write = (t: number) => {
        stars.forEach((star, i) => {
          dummy.position.set(star.x, star.y, star.z);
          dummy.rotation.set(0, 0, star.spin + t * star.rate);
          dummy.scale.setScalar(star.s);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      };

      /* --- pointer parallax, eased --- */
      const target = { x: 0, y: 0 };
      const eased = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const onResize = () => {
        if (!el.clientWidth) return;
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener("resize", onResize);

      /* --- only run while the hero is on screen --- */
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        threshold: 0,
      });
      io.observe(el);

      let raf = 0;
      const start = performance.now();
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const t = (performance.now() - start) / 1000;

        eased.x += (target.x - eased.x) * 0.045;
        eased.y += (target.y - eased.y) * 0.045;

        group.rotation.y = eased.x * 0.16 + Math.sin(t * 0.06) * 0.05;
        group.rotation.x = -eased.y * 0.12 + Math.cos(t * 0.05) * 0.035;
        group.position.x = -eased.x * 1.1;
        group.position.y = eased.y * 0.8;

        write(t);
        renderer.render(scene, camera);
      };

      if (reduced) {
        write(0);
        renderer.render(scene, camera);
      } else {
        el.dataset.live = "true";
        frame();
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  if (!ENABLED) return null;

  return <div ref={host} className={s.lattice3d} aria-hidden="true" />;
}
