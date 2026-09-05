import { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import PufferJacket from './PufferJacket';

function SceneContent({ color, zipper, variant, scale, hovered }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#ffffff', '#0b0a09', 0.45]} />
      <directionalLight
        castShadow
        position={[2.5, 4, 2.5]}
        intensity={2.4}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
      />
      <directionalLight position={[-3, -1.5, -3]} intensity={0.6} color="#7c3aed" />
      <spotLight
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={0.7}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />

      <group position={[0, 0.25, 0]}>
        <PufferJacket color={color} zipper={zipper} variant={variant} scale={scale} hovered={hovered} />
      </group>

      <ContactShadows
        position={[0, -0.7, 0]}
        opacity={0.28}
        scale={22}
        blur={2.6}
        far={2.5}
        resolution={512}
      />
    </>
  );
}

const SceneContentMemo = memo(SceneContent);
SceneContentMemo.displayName = 'SceneContent';

export default function PufferScene({ color, zipper, variant, scale = 1, hovered, transitioning = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 2.4], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0b0a09']} />
      <fog attach="fog" args={['#0b0a09', 8, 26]} />
      <SceneContentMemo color={color} zipper={zipper} variant={variant} scale={scale} hovered={hovered} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={hovered ? 0.2 : 0.45}
        enableZoom={false}
        enablePan={false}
        enableRotate={!transitioning}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
