import { useMemo } from 'react';
import type { Wall } from '../types';

type Props = {
  wall: Wall;
  thickness: number;
  height: number;
  color: string;
  /** When true the wall is hidden (used for cutaway / floorplan modes). */
  hidden?: boolean;
};

/**
 * A wall is rendered along its local X axis, centered on the wall line.
 * Openings produce gaps (with optional lintel/sill blocks above & below).
 * Glass panes are rendered for windows.
 */
export default function Wall3D({ wall, thickness, height, color, hidden }: Props) {
  const geometry = useMemo(() => {
    const dx = wall.end[0] - wall.start[0];
    const dz = wall.end[1] - wall.start[1];
    const length = Math.hypot(dx, dz);
    const angle = Math.atan2(dz, dx);
    const cx = (wall.start[0] + wall.end[0]) / 2;
    const cz = (wall.start[1] + wall.end[1]) / 2;

    // Build list of solid X-intervals along wall, accounting for openings.
    const openings = [...wall.openings].sort((a, b) => a.position - b.position);
    type Slab = { x0: number; x1: number; y0: number; y1: number };
    const slabs: Slab[] = [];
    let cursor = 0;
    for (const op of openings) {
      const x0 = op.position - op.width / 2;
      const x1 = op.position + op.width / 2;
      if (x0 > cursor) {
        slabs.push({ x0: cursor, x1: x0, y0: 0, y1: height });
      }
      if (op.sill > 0) {
        slabs.push({ x0, x1, y0: 0, y1: op.sill });
      }
      const top = op.sill + op.height;
      if (top < height) {
        slabs.push({ x0, x1, y0: top, y1: height });
      }
      cursor = Math.max(cursor, x1);
    }
    if (cursor < length) {
      slabs.push({ x0: cursor, x1: length, y0: 0, y1: height });
    }

    return { length, angle, cx, cz, slabs, openings };
  }, [wall, height]);

  if (hidden) return null;

  return (
    <group position={[geometry.cx, 0, geometry.cz]} rotation={[0, -geometry.angle, 0]}>
      {geometry.slabs.map((s, i) => {
        const w = s.x1 - s.x0;
        const h = s.y1 - s.y0;
        if (w <= 0 || h <= 0) return null;
        const localX = (s.x0 + s.x1) / 2 - geometry.length / 2;
        const localY = (s.y0 + s.y1) / 2;
        return (
          <mesh key={i} position={[localX, localY, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, thickness]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        );
      })}
      {geometry.openings.map((op) => {
        const localX = op.position - geometry.length / 2;
        if (op.kind === 'window') {
          return (
            <group key={op.id} position={[localX, op.sill + op.height / 2, 0]}>
              {/* Frame */}
              <mesh>
                <boxGeometry args={[op.width, op.height, thickness * 1.05]} />
                <meshStandardMaterial color="#222" wireframe />
              </mesh>
              {/* Glass */}
              <mesh>
                <boxGeometry args={[op.width - 0.06, op.height - 0.06, 0.03]} />
                <meshPhysicalMaterial
                  color="#bcd5e6"
                  transparent
                  opacity={0.28}
                  roughness={0.05}
                  metalness={0}
                  transmission={0.85}
                  ior={1.45}
                />
              </mesh>
              {/* Sill */}
              <mesh position={[0, -op.height / 2 - 0.03, 0]}>
                <boxGeometry args={[op.width + 0.1, 0.05, thickness * 1.3]} />
                <meshStandardMaterial color="#efefef" roughness={0.6} />
              </mesh>
            </group>
          );
        }
        // Door — frame only (open doorway)
        return (
          <group key={op.id} position={[localX, op.height / 2, 0]}>
            {/* Frame top */}
            <mesh position={[0, op.height / 2 - 0.04, 0]}>
              <boxGeometry args={[op.width + 0.1, 0.08, thickness * 1.05]} />
              <meshStandardMaterial color="#9b8a6f" roughness={0.7} />
            </mesh>
            {/* Frame sides */}
            <mesh position={[-op.width / 2 - 0.03, 0, 0]}>
              <boxGeometry args={[0.06, op.height, thickness * 1.05]} />
              <meshStandardMaterial color="#9b8a6f" roughness={0.7} />
            </mesh>
            <mesh position={[op.width / 2 + 0.03, 0, 0]}>
              <boxGeometry args={[0.06, op.height, thickness * 1.05]} />
              <meshStandardMaterial color="#9b8a6f" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
