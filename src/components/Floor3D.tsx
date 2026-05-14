import * as THREE from 'three';
import { useMemo } from 'react';
import type { Room, Vec2 } from '../types';

type Props = {
  outline: Vec2[];
  rooms: Room[];
  selectedRoom?: string | null;
  onSelectRoom?: (id: string | null) => void;
};

function polygonShape(points: Vec2[]): THREE.Shape {
  const shape = new THREE.Shape();
  points.forEach(([x, z], i) => {
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  });
  shape.closePath();
  return shape;
}

export default function Floor3D({ outline, rooms, selectedRoom, onSelectRoom }: Props) {
  const slabGeo = useMemo(() => {
    const shape = polygonShape(outline);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2); // shape is in XY → rotate so it lies on XZ
    geo.translate(0, -0.15, 0);
    return geo;
  }, [outline]);

  const roomGeos = useMemo(() => {
    return rooms.map((r) => {
      const shape = polygonShape(r.polygon);
      const geo = new THREE.ShapeGeometry(shape);
      geo.rotateX(-Math.PI / 2);
      return { id: r.id, name: r.name, color: r.color, geo };
    });
  }, [rooms]);

  return (
    <group>
      {/* Foundation slab */}
      <mesh geometry={slabGeo} receiveShadow>
        <meshStandardMaterial color="#3a3a3a" roughness={1} />
      </mesh>
      {/* Room floors */}
      {roomGeos.map((r) => (
        <mesh
          key={r.id}
          geometry={r.geo}
          position={[0, 0.005, 0]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onSelectRoom?.(selectedRoom === r.id ? null : r.id);
          }}
        >
          <meshStandardMaterial
            color={r.color}
            roughness={0.85}
            emissive={selectedRoom === r.id ? '#000' : '#000'}
            emissiveIntensity={selectedRoom === r.id ? 0.25 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}
