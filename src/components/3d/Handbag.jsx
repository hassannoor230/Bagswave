import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 16);
const discGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.018, 24);
const puffGeo = new THREE.SphereGeometry(1, 8, 8);

function makeHandle(p1, p2, lift = 0.16, tube = 0.038, segs = 24) {
  const c1 = new THREE.Vector3(p1.x, p1.y + lift, p1.z);
  const c2 = new THREE.Vector3(p2.x, p2.y + lift, p2.z);
  const curve = new THREE.CubicBezierCurve3(p1, c1, c2, p2);
  return new THREE.TubeGeometry(curve, segs, tube, 8, false);
}

const LEATHER = (c) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(c),
    emissive: new THREE.Color(c).multiplyScalar(0.07),
    emissiveIntensity: 0,
    roughness: 0.72,
    metalness: 0.22,
  });
const METAL = (c) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(c),
    emissive: new THREE.Color(c).multiplyScalar(0.2),
    roughness: 0.2,
    metalness: 0.95,
  });

export default function Handbag({
  color = '#111827',
  zipper = '#b89a67',
  variant = 'tophandle',
  scale = 1,
  hovered = false,
}) {
  const group = useRef();
  const leatherMat = useMemo(() => LEATHER(color), [color]);
  const metalMat = useMemo(() => METAL(zipper), [zipper]);
  const targetColor = useRef(new THREE.Color(color));

  const cfg = useMemo(() => {
    if (variant === 'crossbody')
      return { bw: 0.58, bh: 0.62, bd: 0.22, flap: true, strap: true, handleLift: 0.12 };
    return { bw: 0.64, bh: 0.78, bd: 0.25, flap: false, strap: false, handleLift: 0.16 };
  }, [variant]);

  const handleGeo = useMemo(() => {
    const p1 = new THREE.Vector3(-cfg.bw / 2 + 0.08, cfg.bh / 2, cfg.bd / 2 + 0.002);
    const p2 = new THREE.Vector3(cfg.bw / 2 - 0.08, cfg.bh / 2, cfg.bd / 2 + 0.002);
    return makeHandle(p1, p2, cfg.handleLift, 0.04);
  }, [cfg]);

  const flapGeo = useMemo(() => new THREE.PlaneGeometry(cfg.bw * 0.92, 0.22), [cfg]);

  const strapGeo = useMemo(() => {
    const p1 = new THREE.Vector3(cfg.bw / 2 - 0.04, cfg.bh / 2 - 0.06, cfg.bd / 2);
    const p2 = new THREE.Vector3(cfg.bw / 2 - 0.04, -cfg.bh / 2 + 0.1, -cfg.bd / 2 - 0.02);
    return makeHandle(p1, p2, cfg.bw * 0.42, 0.028, 30);
  }, [cfg]);

  useFrame((_, dt) => {
    targetColor.current.set(color);
    leatherMat.color.lerp(targetColor.current, 1 - Math.pow(0.05, dt));
    leatherMat.emissive.lerp(targetColor.current, 0.03);
    leatherMat.emissiveIntensity = THREE.MathUtils.damp(leatherMat.emissiveIntensity, hovered ? 0.5 : 0, 6, dt);
    metalMat.emissiveIntensity = THREE.MathUtils.damp(metalMat.emissiveIntensity, hovered ? 0.8 : 0.2, 6, dt);
    if (group.current) {
      const t = performance.now() * 0.0018;
      group.current.scale.setScalar(scale * (1 + Math.sin(t * 1.1) * 0.003));
    }
  });

  return (
    <group ref={group} scale={scale} position={[0, 0.05, 0]}>
      {/* Body */}
      <RoundedBox
        args={[cfg.bw, cfg.bh, cfg.bd]}
        radius={0.06}
        smoothness={5}
        material={leatherMat}
        castShadow
        receiveShadow
      />

      {/* Top handle */}
      <mesh geometry={handleGeo} material={metalMat} castShadow receiveShadow />

      {/* Center clasp hardware */}
      <mesh
        geometry={barGeo}
        material={metalMat}
        position={[0, -0.06, cfg.bd / 2 + 0.01]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      />
      <mesh geometry={discGeo} material={metalMat} position={[0, -0.04, cfg.bd / 2 + 0.015]} castShadow receiveShadow />

      {/* Shoulder strap (crossbody) */}
      {cfg.strap && <mesh geometry={strapGeo} material={metalMat} castShadow receiveShadow />}

      {/* Front flap (crossbody) */}
      {cfg.flap && (
        <group position={[0, cfg.bh / 2 - 0.02, 0]}>
          <mesh
            geometry={flapGeo}
            material={leatherMat}
            position={[0, 0.11, cfg.bd / 2 - 0.005]}
            rotation={[-0.62, 0, 0]}
            castShadow
            receiveShadow
          />
          <mesh geometry={discGeo} material={metalMat} position={[0, 0.16, cfg.bd / 2 + 0.01]} scale={0.8} castShadow receiveShadow />
          <mesh geometry={discGeo} material={metalMat} position={[0, 0.16, cfg.bd / 2 + 0.022]} scale={0.5} castShadow receiveShadow />
        </group>
      )}

      {/* Brand rivets (top-handle) */}
      {!cfg.flap && (
        <>
          <mesh geometry={puffGeo} material={metalMat} position={[-cfg.bw / 2 + 0.06, 0.02, cfg.bd / 2 + 0.008]} scale={0.022} />
          <mesh geometry={puffGeo} material={metalMat} position={[cfg.bw / 2 - 0.06, 0.02, cfg.bd / 2 + 0.008]} scale={0.022} />
        </>
      )}
    </group>
  );
}
