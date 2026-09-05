import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const puffGeo = new THREE.SphereGeometry(1, 10, 10);
const sleeveGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.72, 14);
const zipperGeo = new THREE.BoxGeometry(0.07, 1, 0.02);

const FABRIC = (c) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(c),
    emissive: new THREE.Color(c).multiplyScalar(0.08),
    emissiveIntensity: 0.0,
    roughness: 0.78,
    metalness: 0.06,
  });
const METAL = (c) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(c),
    emissive: new THREE.Color(c).multiplyScalar(0.18),
    roughness: 0.18,
    metalness: 0.95,
  });

function Puffs({ fabricMat, tW, tH, tD, face }) {
  const cols = face === 'front' ? 3 : 2;
  const rows = face === 'front' ? 6 : 5;
  const positions = useMemo(() => {
    const arr = [];
    const r = 0.048;
    const insetX = tW / 2 - 0.12;
    const insetY = tH / 2 - 0.18;
    const spanX = insetX * 2;
    const spanY = insetY * 2;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = -insetX + (i / (cols - 1)) * spanX;
        const y = -insetY + (j / (rows - 1)) * spanY;
        const z = face === 'front' ? tD / 2 + r + 0.002 : -(tD / 2 + r + 0.002);
        arr.push([x, y, z]);
      }
    }
    return arr;
  }, [cols, rows, tW, tH, tD, face]);

  return (
    <group>
      {positions.map((p, i) => (
        <mesh
          key={i}
          position={p}
          scale={[0.92, 1.25, 0.55]}
          geometry={puffGeo}
          material={fabricMat}
        />
      ))}
    </group>
  );
}

export default function PufferJacket({
  color = '#1e3a8a',
  zipper = '#b89a67',
  variant = 'jacket',
  scale = 1,
  hovered = false,
}) {
  const group = useRef();
  const fabricMat = useMemo(() => FABRIC(color), [color]);
  const metalMat = useMemo(() => METAL(zipper), [zipper]);
  const targetColor = useRef(new THREE.Color(color));

  const cfg = useMemo(() => {
    if (variant === 'vest') return { tW: 0.82, tH: 1.0, tD: 0.26, hoodR: 0.48, sleeve: false };
    if (variant === 'coat') return { tW: 0.88, tH: 1.52, tD: 0.36, hoodR: 0.66, sleeve: true };
    return { tW: 0.76, tH: 1.06, tD: 0.32, hoodR: 0.52, sleeve: true };
  }, [variant]);

  const hoodGeo = useMemo(
    () => new THREE.SphereGeometry(cfg.hoodR, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    [cfg.hoodR]
  );

  useFrame((_, dt) => {
    targetColor.current.set(color);
    fabricMat.color.lerp(targetColor.current, 1 - Math.pow(0.05, dt));
    fabricMat.emissive.lerp(targetColor.current, 0.04);
    fabricMat.emissiveIntensity = THREE.MathUtils.damp(fabricMat.emissiveIntensity, hovered ? 0.55 : 0.0, 6, dt);
    metalMat.emissiveIntensity = THREE.MathUtils.damp(metalMat.emissiveIntensity, hovered ? 0.7 : 0.25, 6, dt);

    if (group.current) {
      const t = performance.now() * 0.002;
      const breath = 1 + Math.sin(t * 1.3) * 0.004;
      group.current.scale.setScalar(scale * breath);
    }
  });

  return (
    <group ref={group} scale={scale} position={[0, -0.08, 0]}>
      {/* Torso */}
      <RoundedBox
        args={[cfg.tW, cfg.tH, cfg.tD]}
        radius={0.16}
        smoothness={6}
        material={fabricMat}
        castShadow
        receiveShadow
      />

      {/* Quilted puff padding */}
      <Puffs fabricMat={fabricMat} tW={cfg.tW} tH={cfg.tH} tD={cfg.tD} face="front" />
      <Puffs fabricMat={fabricMat} tW={cfg.tW} tH={cfg.tH} tD={cfg.tD} face="back" />

      {/* Center front zipper */}
      <mesh geometry={zipperGeo} material={metalMat} position={[0, 0, cfg.tD / 2 + 0.002]} />
      <mesh geometry={zipperGeo} material={metalMat} position={[0, 0, -(cfg.tD / 2 + 0.002)]} />
      {/* zipper pull */}
      <mesh geometry={puffGeo} material={metalMat} position={[0, -0.28, cfg.tD / 2 + 0.003]} scale={0.16} />

      {/* Hood */}
      <group position={[0, cfg.tH / 2 + cfg.hoodR * 0.32, -cfg.tW * 0.12]}>
        <mesh geometry={hoodGeo} material={fabricMat} scale={[1.15, 1.0, 0.6]} castShadow receiveShadow />
        {/* hood rim accent */}
        <mesh
          geometry={hoodGeo}
          material={metalMat}
          position={[0, 0, -0.02]}
          scale={[1.22, 1.05, 0.65]}
        />
      </group>

      {/* Sleeves (jacket & coat) */}
      {cfg.sleeve && (
        <>
          <mesh
            geometry={sleeveGeo}
            material={fabricMat}
            position={[-(cfg.tW / 2 + 0.42), cfg.tH * 0.26, 0]}
            rotation={[0, 0, -Math.PI / 2.6]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={sleeveGeo}
            material={fabricMat}
            position={[cfg.tW / 2 + 0.42, cfg.tH * 0.26, 0]}
            rotation={[0, 0, Math.PI / 2.6]}
            castShadow
            receiveShadow
          />
          <mesh geometry={puffGeo} material={fabricMat} position={[-(cfg.tW / 2 + 0.56), cfg.tH * 0.26, 0]} scale={0.38} />
          <mesh geometry={puffGeo} material={fabricMat} position={[cfg.tW / 2 + 0.56, cfg.tH * 0.26, 0]} scale={0.38} />
        </>
      )}
    </group>
  );
}
