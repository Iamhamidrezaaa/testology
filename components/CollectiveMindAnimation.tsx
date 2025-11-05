"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CollectiveMindAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // نورپردازی و رنگ
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(0, 0, 10);
    scene.add(light);

    // ذرات (neurons)
    const particles = new THREE.Group();
    for (let i = 0; i < 200; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 0.06 + 0.02, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          `hsl(${Math.random() * 60 + 190}, 70%, ${Math.random() * 40 + 50}%)`
        ),
        emissive: 0x111111,
        metalness: 0.3,
        roughness: 0.4,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      particles.add(sphere);
    }
    scene.add(particles);

    // خطوط ارتباطی بین نورون‌ها
    const connections = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5),
        new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5),
      ]);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 60 + 200}, 70%, 70%)`),
        transparent: true,
        opacity: 0.4,
      });
      const line = new THREE.Line(geometry, material);
      connections.add(line);
    }
    scene.add(connections);

    camera.position.z = 10;
    let frame = 0;

    const animate = () => {
      frame += 0.005;
      particles.rotation.y += 0.002;
      connections.rotation.y -= 0.001;
      particles.children.forEach((p, i) => {
        p.position.y += Math.sin(frame + i) * 0.001;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-sky-900 shadow-lg" />
  );
}


