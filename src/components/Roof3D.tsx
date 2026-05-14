import * as THREE from 'three';
import { useMemo } from 'react';
import type { Vec2 } from '../types';

type Props = {
  outline: Vec2[];
  wallHeight: number;
};

export default function Roof3D({ outline, wallHeight }: Props) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    outline.forEach(([x, z], i) => {
      if (i === 0) shape.moveTo(x, z);
      else shape.lineTo(x, z);
    });
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.25, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [outline]);

  return (
    <mesh geometry={geometry} position={[0, wallHeight, 0]} castShadow>
      <meshStandardMaterial color="#7d6a4a" roughness={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}
