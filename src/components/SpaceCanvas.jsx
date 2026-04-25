import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Float, PerspectiveCamera, Html, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

const PLANETS = [
  { id: 'hub', name: 'Hub Alpha', pos: [0, 0, 0], size: 2.5, color: '#00f3ff', description: 'Central Command' },
  { id: 'moon', name: 'Moon Base', pos: [8, 0, -2], size: 0.8, color: '#f3f4f6', description: 'Starter Zone' },
  { id: 'mars', name: 'Mars Frontier', pos: [-12, 1, 5], size: 1.2, color: '#ff4d4d', description: 'Combat Sector' },
  { id: 'saturn', name: 'Saturn Rings', pos: [15, -2, 12], size: 1.8, color: '#ffd280', description: 'Gravity Challenge' },
  { id: 'blackhole', name: 'Black Hole', pos: [0, -15, -20], size: 3.5, color: '#9d00ff', description: 'ELITE ZONE' },
];

const MovingShip = () => {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * 0.2;
    ref.current.position.set(Math.cos(t) * 20, 5, Math.sin(t) * 20);
    ref.current.rotation.y = -t + Math.PI / 2;
  });

  return (
    <group ref={ref}>
      <mesh>
        <coneGeometry args={[0.2, 0.8, 4]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
      </mesh>
      <pointLight intensity={0.5} color="#00f3ff" />
    </group>
  );
};

const AsteroidBelt = ({ count = 300 }) => {
  const points = React.useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 25 + Math.random() * 10;
        p.push(new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 5, Math.sin(angle) * radius));
    }
    return p;
  }, [count]);

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
            <sphereGeometry args={[0.05 + Math.random() * 0.1, 4, 4]} />
            <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  );
};

const OrbitPath = ({ radius }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
};

const Planet = ({ id, name, position, size, color, description, isSelected, onSelect }) => {
  const { isPlanetLocked, planetGates } = useGameStore();
  const locked = isPlanetLocked(id);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  return (
    <group position={position}>
      <Float speed={locked ? 0.3 : 1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={meshRef}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (!locked) onSelect(id);
          }}
          onPointerOver={() => !locked && setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial 
            color={locked ? '#1a1a1a' : color} 
            emissive={locked ? '#000000' : color}
            emissiveIntensity={hovered || isSelected ? 1.2 : 0.4}
            metalness={0.9}
            roughness={0.1}
          />
          
          {/* Atmosphere Glow */}
          <mesh scale={1.2}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshBasicMaterial color={color} transparent opacity={hovered ? 0.15 : 0.05} side={THREE.BackSide} />
          </mesh>

          {/* Scanning Ring */}
          {(hovered || isSelected) && !locked && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size + 0.2, size + 0.25, 64]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
          )}
        </mesh>
      </Float>

      {/* Label */}
      <Html position={[0, size + 1.2, 0]} center style={{ pointerEvents: 'none' }}>
        <div className={`transition-all duration-700 flex flex-col items-center ${hovered || isSelected ? 'opacity-100 scale-100' : 'opacity-20 scale-90'}`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`h-[1px] w-8 bg-gradient-to-r from-transparent ${locked ? 'to-gray-500' : 'to-neon-cyan'}`} />
            <div className={`font-orbitron text-[11px] tracking-[0.4em] font-black uppercase whitespace-nowrap ${locked ? 'text-gray-500' : 'text-white'}`}>
              {locked ? `Restricted_${id}` : name}
            </div>
            <div className={`h-[1px] w-8 bg-gradient-to-l from-transparent ${locked ? 'to-gray-500' : 'to-neon-cyan'}`} />
          </div>
          
          {(hovered || isSelected) && !locked && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex flex-col items-center shadow-2xl"
            >
              <div className="text-[8px] text-neon-cyan font-black uppercase tracking-widest mb-1">{description}</div>
              <div className="text-[7px] text-gray-500 font-mono italic flex items-center space-x-2">
                <span className="w-1 h-1 bg-neon-cyan rounded-full animate-ping" />
                <span>Scanning_Sector... OK</span>
              </div>
            </motion.div>
          )}

          {locked && hovered && (
            <div className="bg-red-950/80 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-lg flex items-center space-x-3">
              <Lock className="w-3 h-3 text-red-500" />
              <span className="text-[8px] text-white font-black uppercase tracking-wider">Level {useGameStore.getState().planetGates[id]} Required</span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

const CameraController = ({ selectedPlanetId }) => {
  const { camera, controls } = useThree();
  
  useFrame((state) => {
    if (!selectedPlanetId) return;
    
    const targetPlanet = PLANETS.find(p => p.id === selectedPlanetId);
    if (!targetPlanet) return;

    // Smoothed transition targets
    const targetPos = new THREE.Vector3(...targetPlanet.pos);
    const offset = new THREE.Vector3(0, targetPlanet.size * 2, targetPlanet.size * 5);
    const cameraTarget = targetPos.clone().add(offset);

    // Lerp camera position
    state.camera.position.lerp(cameraTarget, 0.05);
    
    // Smoothly look at the target planet
    if (controls) {
      controls.target.lerp(targetPos, 0.05);
      controls.update();
    }
  });

  return null;
};

const SpaceCanvas = () => {
  const { selectedPlanet, setSelectedPlanet } = useGameStore();

  return (
    <div className="fixed inset-0 bg-[#02000a] z-0">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 20, 40]} fov={50} />
        
        <Suspense fallback={null}>
          <Stars radius={150} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
          
          <ambientLight intensity={0.1} />
          <pointLight position={[20, 20, 20]} intensity={2} color="#00f3ff" />
          <pointLight position={[-20, -20, -20]} intensity={1} color="#9d00ff" />
          
          <fog attach="fog" args={['#02000a', 20, 100]} />

          <MovingShip />
          <AsteroidBelt />

          {PLANETS.map((planet) => (
            <React.Fragment key={planet.id}>
              {planet.id !== 'hub' && planet.id !== 'blackhole' && (
                <OrbitPath radius={Math.sqrt(planet.pos[0]**2 + planet.pos[2]**2)} />
              )}
              <Planet 
                {...planet} 
                position={planet.pos}
                isSelected={selectedPlanet === planet.id}
                onSelect={(id) => setSelectedPlanet(id)}
              />
            </React.Fragment>
          ))}

          <CameraController selectedPlanetId={selectedPlanet} />
          
          <OrbitControls 
            makeDefault
            enablePan={false} 
            maxDistance={80} 
            minDistance={4}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SpaceCanvas;
