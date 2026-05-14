import { useRef, useState } from 'react';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { FurnitureItem } from '../types';

type Props = {
  item: FurnitureItem;
  selected: boolean;
  onSelect: () => void;
  onMove: (pos: [number, number]) => void;
  onRotate: (rot: number) => void;
  showLabels: boolean;
  editable: boolean;
};

/**
 * Returns the group of meshes that visually represents a piece of furniture.
 * All meshes sit on the floor (y=0) and are centered on the local origin.
 */
function FurnitureMesh({ item }: { item: FurnitureItem }) {
  const [w, d] = item.size;
  const baseColor = item.color ?? '#888';
  switch (item.kind) {
    case 'sofa':
      return (
        <group>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[w, 0.5, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.6, -d / 2 + 0.12]} castShadow>
            <boxGeometry args={[w, 0.7, 0.25]} />
            <meshStandardMaterial color={baseColor} roughness={0.9} />
          </mesh>
          <mesh position={[-w / 2 + 0.12, 0.55, 0]} castShadow>
            <boxGeometry args={[0.22, 0.6, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.9} />
          </mesh>
          <mesh position={[w / 2 - 0.12, 0.55, 0]} castShadow>
            <boxGeometry args={[0.22, 0.6, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.9} />
          </mesh>
        </group>
      );
    case 'armchair':
      return (
        <group>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[w, 0.45, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.55, -d / 2 + 0.1]} castShadow>
            <boxGeometry args={[w, 0.65, 0.2]} />
            <meshStandardMaterial color={baseColor} roughness={0.9} />
          </mesh>
        </group>
      );
    case 'coffeeTable':
      return (
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[w, 0.05, d]} />
          <meshStandardMaterial color={baseColor} roughness={0.5} />
        </mesh>
      );
    case 'diningTable':
      return (
        <group>
          <mesh position={[0, 0.74, 0]} castShadow>
            <boxGeometry args={[w, 0.05, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.5} />
          </mesh>
          {[
            [-w / 2 + 0.1, -d / 2 + 0.1],
            [w / 2 - 0.1, -d / 2 + 0.1],
            [-w / 2 + 0.1, d / 2 - 0.1],
            [w / 2 - 0.1, d / 2 - 0.1],
          ].map(([lx, lz], i) => (
            <mesh key={i} position={[lx, 0.36, lz]} castShadow>
              <boxGeometry args={[0.08, 0.72, 0.08]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
          ))}
        </group>
      );
    case 'chair':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[w, 0.04, d]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh position={[0, 0.7, -d / 2 + 0.04]} castShadow>
            <boxGeometry args={[w, 0.5, 0.05]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        </group>
      );
    case 'rug':
      return (
        <mesh position={[0, 0.012, 0]} receiveShadow>
          <boxGeometry args={[w, 0.02, d]} />
          <meshStandardMaterial color={baseColor} roughness={1} />
        </mesh>
      );
    case 'kitchenCounter':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.9, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <boxGeometry args={[w + 0.02, 0.04, d + 0.02]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      );
    case 'kitchenIsland':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.9, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <boxGeometry args={[w + 0.05, 0.04, d + 0.05]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.3} />
          </mesh>
        </group>
      );
    case 'fridge':
      return (
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[w, 1.8, d]} />
          <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.5} />
        </mesh>
      );
    case 'stove':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[w, 0.9, d]} />
            <meshStandardMaterial color={baseColor} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.91, 0]}>
            <boxGeometry args={[w - 0.05, 0.02, d - 0.05]} />
            <meshStandardMaterial color="#111" roughness={0.2} />
          </mesh>
        </group>
      );
    case 'toilet':
      return (
        <group>
          <mesh position={[0, 0.2, 0.05]} castShadow>
            <boxGeometry args={[w * 0.9, 0.4, d * 0.6]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh position={[0, 0.55, -d / 2 + 0.08]} castShadow>
            <boxGeometry args={[w * 0.9, 0.7, 0.15]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        </group>
      );
    case 'sink':
      return (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[w * 0.8, 0.5, d * 0.7]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        </group>
      );
    case 'shower':
      return (
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[w, 0.1, d]} />
          <meshStandardMaterial color="#cfd6da" roughness={0.3} />
        </mesh>
      );
    case 'wardrobe':
      return (
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[w, 2.1, d]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
      );
    case 'desk':
      return (
        <group>
          <mesh position={[0, 0.74, 0]} castShadow>
            <boxGeometry args={[w, 0.05, d]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh position={[-w / 2 + 0.1, 0.36, 0]} castShadow>
            <boxGeometry args={[0.06, 0.72, d - 0.04]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh position={[w / 2 - 0.1, 0.36, 0]} castShadow>
            <boxGeometry args={[0.06, 0.72, d - 0.04]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        </group>
      );
    case 'tv':
      return (
        <group>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[w, 0.7, 0.05]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 1.0, 0.026]}>
            <boxGeometry args={[w - 0.05, 0.65, 0.005]} />
            <meshStandardMaterial color="#3a4a66" emissive="#1a2a44" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );
    case 'plant':
      return (
        <group>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[Math.min(w, d) / 2.5, Math.min(w, d) / 3, 0.35, 16]} />
            <meshStandardMaterial color="#9a6a4a" />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow>
            <sphereGeometry args={[Math.min(w, d) / 1.8, 16, 16]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
        </group>
      );
    case 'bed':
      return (
        <group>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[w, 0.5, d]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh position={[0, 0.7, -d / 2 + 0.08]} castShadow>
            <boxGeometry args={[w, 0.6, 0.1]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </group>
      );
    case 'stairs': {
      const steps = 8;
      const stepDepth = d / steps;
      const totalRise = 1.5;
      return (
        <group>
          {Array.from({ length: steps }).map((_, i) => (
            <mesh
              key={i}
              position={[0, ((i + 1) / steps) * totalRise * 0.5, -d / 2 + stepDepth * (i + 0.5)]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[w, ((i + 1) / steps) * totalRise, stepDepth]} />
              <meshStandardMaterial color={baseColor} roughness={0.8} />
            </mesh>
          ))}
        </group>
      );
    }
    default:
      return (
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[w, 0.6, d]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
      );
  }
}

export default function Furniture3D({
  item,
  selected,
  onSelect,
  onMove,
  onRotate,
  showLabels,
  editable,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);
  const { camera, gl } = useThree();

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!editable) return;
    e.stopPropagation();
    onSelect();
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    e.stopPropagation();
    setDragging(false);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    e.stopPropagation();
    const ndc = new THREE.Vector2(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, hit);
    if (hit) onMove([hit.x, hit.z]);
  };

  return (
    <group
      ref={groupRef}
      position={[item.position[0], 0, item.position[1]]}
      rotation={[0, item.rotation, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onContextMenu={(e: ThreeEvent<MouseEvent>) => {
        if (!editable) return;
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        onRotate(item.rotation + Math.PI / 12);
      }}
    >
      <FurnitureMesh item={item} />
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(item.size[0], item.size[1]) * 0.6, Math.max(item.size[0], item.size[1]) * 0.7, 32]} />
          <meshBasicMaterial color="#ffcc33" transparent opacity={0.9} />
        </mesh>
      )}
      {showLabels && item.label && (
        <Html
          position={[0, 0.9, 0]}
          center
          style={{
            background: 'rgba(20,20,20,0.78)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 11,
            fontFamily: 'system-ui',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </Html>
      )}
    </group>
  );
}
