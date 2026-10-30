import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '../../utils/gsapConfig';
import { Sparkles, RotateCw } from 'lucide-react';

interface ModelProps {
  modelUrl: string;
}

// Subcomponent to load GLTF/GLB models dynamically
const ExternalGltfModel: React.FC<ModelProps> = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !prefersReducedMotion()) {
      meshRef.current.rotation.y += delta * 0.55;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={1.8} position={[0, -0.4, 0]} />;
};

// 1. Procedural Haute Joaillerie 22K Gold & Diamond Solitaire Ring
const ProceduralRing: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !prefersReducedMotion()) {
      groupRef.current.rotation.y += delta * 0.52;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0015) * 0.08;
    }
  });

  // Noble 22K Gold Material
  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E5C158'),
    emissive: new THREE.Color('#382806'),
    metalness: 0.96,
    roughness: 0.15,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    reflectivity: 0.95,
  });

  // Brilliant-Cut Solitaire Diamond Material (Real Diamond IOR 2.417)
  const diamondMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    metalness: 0.05,
    roughness: 0.04,
    transmission: 0.92,
    thickness: 1.5,
    ior: 2.417,
    dispersion: 0.044,
    specularIntensity: 1.0,
    transparent: true,
    opacity: 0.98,
  });

  const prongPositions: [number, number, number][] = [
    [0.22, 1.62, 0.22],
    [-0.22, 1.62, 0.22],
    [0.22, 1.62, -0.22],
    [-0.22, 1.62, -0.22],
  ];

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Main 22K Gold Torus Ring Band */}
      <mesh material={goldMaterial}>
        <torusGeometry args={[1.45, 0.22, 32, 80]} />
      </mesh>

      {/* Raised Crown Bezel Setting */}
      <mesh position={[0, 1.48, 0]} material={goldMaterial}>
        <cylinderGeometry args={[0.42, 0.28, 0.35, 24]} />
      </mesh>

      {/* Four Gold Prongs */}
      {prongPositions.map((pos, idx) => (
        <mesh key={idx} position={pos} material={goldMaterial}>
          <cylinderGeometry args={[0.04, 0.05, 0.42, 12]} />
        </mesh>
      ))}

      {/* Solitaire Brilliant Diamond Gemstone */}
      <mesh position={[0, 1.76, 0]} rotation={[0.4, 0.2, 0]} material={diamondMaterial}>
        <octahedronGeometry args={[0.48, 2]} />
      </mesh>
    </group>
  );
};

// 2. Procedural Haute Horlogerie 18K Rose Gold Chronometer Watch
const ProceduralWatch: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const secondHandRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !prefersReducedMotion()) {
      groupRef.current.rotation.y += delta * 0.45;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0012) * 0.06;
    }
    if (secondHandRef.current) {
      secondHandRef.current.rotation.z -= delta * 1.0;
    }
  });

  // 18K Rose Gold Material
  const roseGoldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#D89D78'),
    emissive: new THREE.Color('#3A180E'),
    metalness: 0.94,
    roughness: 0.18,
    clearcoat: 0.5,
  });

  // Sapphire Glass Crystal
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    metalness: 0.02,
    roughness: 0.02,
    transmission: 0.96,
    thickness: 0.8,
    ior: 1.77, // Sapphire glass IOR
    transparent: true,
    opacity: 0.35,
  });

  // Guilloche Dial Material
  const dialMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0E0D0B'),
    roughness: 0.35,
    metalness: 0.6,
  });

  // Saddle-Stitched Espresso Alligator Leather Strap Material
  const leatherMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2A1810'),
    roughness: 0.72,
    metalness: 0.1,
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.3, -0.4, 0]}>
      {/* Watch Case */}
      <mesh material={roseGoldMaterial}>
        <cylinderGeometry args={[1.5, 1.5, 0.32, 48]} />
      </mesh>

      {/* Fluted Gold Bezel */}
      <mesh position={[0, 0.16, 0]} material={roseGoldMaterial}>
        <torusGeometry args={[1.48, 0.08, 16, 48]} />
      </mesh>

      {/* Dark Guilloche Dial Face */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]} material={dialMaterial}>
        <circleGeometry args={[1.38, 48]} />
      </mesh>

      {/* Sapphire Crystal Cover */}
      <mesh position={[0, 0.22, 0]} material={glassMaterial}>
        <cylinderGeometry args={[1.42, 1.42, 0.05, 48]} />
      </mesh>

      {/* Gold Crown Winder */}
      <mesh position={[1.56, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={roseGoldMaterial}>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 20]} />
      </mesh>

      {/* Gold Hour & Minute Hands */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0.8]} material={roseGoldMaterial}>
        <boxGeometry args={[0.05, 0.95, 0.02]} />
      </mesh>

      {/* Moving Second Hand */}
      <mesh ref={secondHandRef} position={[0, 0.185, 0]} rotation={[-Math.PI / 2, 0, 0]} material={roseGoldMaterial}>
        <boxGeometry args={[0.02, 1.15, 0.01]} />
      </mesh>

      {/* Top Leather Strap */}
      <mesh position={[0, 1.7, -0.05]} rotation={[-0.15, 0, 0]} material={leatherMaterial}>
        <boxGeometry args={[1.15, 1.6, 0.14]} />
      </mesh>

      {/* Bottom Leather Strap */}
      <mesh position={[0, -1.7, -0.05]} rotation={[0.15, 0, 0]} material={leatherMaterial}>
        <boxGeometry args={[1.15, 1.6, 0.14]} />
      </mesh>
    </group>
  );
};

export interface Jewelry3DViewerProps {
  modelUrl?: string;
  pieceType?: 'ring' | 'watch' | 'pendant';
  fallbackImageUrl?: string;
  fallbackAlt?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  height?: string | number;
}

/**
 * Jewelry3DViewer
 * Interactive WebGL / Three.js 3D jewelry showcase with OrbitControls,
 * physically based noble gold, diamond, sapphire glass, and leather materials,
 * studio lighting, contact shadows, and accessible fallback.
 */
export const Jewelry3DViewer: React.FC<Jewelry3DViewerProps> = ({
  modelUrl,
  pieceType = 'ring',
  fallbackImageUrl = '/images/hero/hero-cinematic.jpg',
  fallbackAlt = 'Atelier Fine Creations Haute Joaillerie Showcase',
  autoRotate = true,
  autoRotateSpeed = 1.8,
  height = '380px',
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!isClient || !hasWebGL) {
    return (
      <div
        style={{
          width: '100%',
          height,
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-obsidian-card)',
          border: '1px solid var(--color-obsidian-border)',
        }}
      >
        <img
          src={fallbackImageUrl}
          alt={fallbackAlt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            backgroundColor: 'rgba(12, 11, 9, 0.85)',
            border: '1px solid rgba(196, 154, 90, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-champagne-light)',
            fontSize: '0.72rem',
          }}
        >
          <Sparkles size={12} />
          <span>Atelier Photographic Vault View</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: '#070605',
        border: '1px solid var(--color-obsidian-border)',
        boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.85)',
        touchAction: 'pan-y', // Never block vertical page scroll
      }}
    >
      <Canvas
        camera={{ position: [0, 1.2, 4.6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      >
        {/* Studio 3-Point Lighting Rig */}
        <ambientLight intensity={0.75} color="#FFE8C2" />
        <directionalLight position={[5, 8, 6]} intensity={2.4} color="#FFF5E4" castShadow />
        <directionalLight position={[-6, 4, -5]} intensity={1.8} color="#C49A5A" />
        <pointLight position={[0, -2, 4]} intensity={0.9} color="#FFFFFF" />

        <Suspense fallback={null}>
          {modelUrl ? (
            <ExternalGltfModel modelUrl={modelUrl} />
          ) : pieceType === 'watch' ? (
            <ProceduralWatch />
          ) : (
            <ProceduralRing />
          )}

          {/* Restrained Contact Shadow Floor */}
          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.65}
            scale={4.8}
            blur={2.4}
            far={3}
            color="#000000"
          />

          {/* Damped, touch-safe OrbitControls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate && !isInteracting && !prefersReducedMotion()}
            autoRotateSpeed={autoRotateSpeed}
            enableDamping
            dampingFactor={0.06}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Suspense>
      </Canvas>

      {/* Floating 3D Interaction Badge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(12, 11, 9, 0.75)',
          border: '1px solid rgba(196, 154, 90, 0.3)',
          color: 'var(--color-champagne-light)',
          fontSize: '0.72rem',
          pointerEvents: 'none',
          backdropFilter: 'blur(8px)',
        }}
      >
        <RotateCw size={12} className={isInteracting ? '' : 'spin-slow'} />
        <span>Drag to rotate • 360° Atelier 3D View</span>
      </div>

      {/* Subtle Bottom Gold Specular Reflection Line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(196, 154, 90, 0.5) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
