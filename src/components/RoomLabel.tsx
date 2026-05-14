import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import type { Room } from '../types';

function centroid(poly: [number, number][]): [number, number] {
  let cx = 0;
  let cz = 0;
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, z1] = poly[i];
    const [x2, z2] = poly[(i + 1) % poly.length];
    const cross = x1 * z2 - x2 * z1;
    area += cross;
    cx += (x1 + x2) * cross;
    cz += (z1 + z2) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    let mx = 0;
    let mz = 0;
    poly.forEach(([x, z]) => {
      mx += x;
      mz += z;
    });
    return [mx / poly.length, mz / poly.length];
  }
  return [cx / (6 * area), cz / (6 * area)];
}

function polygonArea(poly: [number, number][]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, z1] = poly[i];
    const [x2, z2] = poly[(i + 1) % poly.length];
    a += x1 * z2 - x2 * z1;
  }
  return Math.abs(a) / 2;
}

export default function RoomLabel({ room }: { room: Room }) {
  const { center, area } = useMemo(() => {
    return { center: centroid(room.polygon), area: polygonArea(room.polygon) };
  }, [room]);

  return (
    <Html
      position={[center[0], 0.05, center[1]]}
      center
      style={{
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255,255,255,0.85)',
        color: '#222',
        padding: '4px 8px',
        borderRadius: 6,
        fontFamily: 'system-ui',
        fontSize: 12,
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ fontWeight: 600 }}>{room.name}</div>
      <div style={{ fontSize: 10, opacity: 0.7 }}>{area.toFixed(1)} m²</div>
    </Html>
  );
}
