import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import Handbag from './Handbag';

export default function ProductScene({ color, zipper, variant, scale = 1, hovered, transitioning = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0.05, 2.3], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0b0a09']} />
      <fog attach="fog" args={['#0b0a09', 8, 26]} />
      <ambientLight intensity={0.78} />
      <hemisphereLight args={['#fff8ed', '#17120d', 0.65]} />
      <directionalLight
        castShadow
        position={[2.5, 4, 2.5]}
        intensity={2.8}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
      />
      <directionalLight position={[-3, -1.5, -3]} intensity={1.15} color="#c7d5e8" />
      <spotLight position={[0, 5, 3]} angle={0.4} penumbra={0.7} intensity={1.5} color="#fff8ed" castShadow />
      <pointLight position={[-2.2, 0.4, 2]} intensity={1.4} distance={6} color="#b89a67" />

      <group position={[0, 0.3, 0]}>
        <Handbag color={color} zipper={zipper} variant={variant} scale={scale} hovered={hovered} />
      </group>

      <ContactShadows position={[0, -0.7, 0]} opacity={0.3} scale={22} blur={2.6} far={2.5} resolution={512} />
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
