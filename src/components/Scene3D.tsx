import { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PointerLockControls,
  Sky,
  ContactShadows,
  Environment,
  Grid,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei';
import * as THREE from 'three';
import type { FloorPlan } from '../types';
import Wall3D from './Wall3D';
import Floor3D from './Floor3D';
import Furniture3D from './Furniture3D';
import Roof3D from './Roof3D';
import RoomLabel from './RoomLabel';

export type ViewMode = 'orbit' | 'top' | 'walk';

type Props = {
  plan: FloorPlan;
  view: ViewMode;
  showRoof: boolean;
  showLabels: boolean;
  showFurniture: boolean;
  showGrid: boolean;
  showShell: boolean;
  selectedFurniture: string | null;
  selectedRoom: string | null;
  onSelectFurniture: (id: string | null) => void;
  onSelectRoom: (id: string | null) => void;
  onMoveFurniture: (id: string, pos: [number, number]) => void;
  onRotateFurniture: (id: string, rot: number) => void;
  editable: boolean;
};

const PLAN_W = 13;
const PLAN_D = 7.5;

function ViewCamera({ view }: { view: ViewMode }) {
  const { camera } = useThree();
  const last = useRef<ViewMode>(view);
  useFrame(() => {
    if (last.current === view) return;
    last.current = view;
    if (view === 'top') {
      camera.position.set(PLAN_W / 2, 22, PLAN_D / 2 + 0.5);
      camera.up.set(0, 0, -1);
      camera.lookAt(PLAN_W / 2, 0, PLAN_D / 2);
    } else if (view === 'orbit') {
      camera.position.set(PLAN_W / 2 + 9, 11, PLAN_D + 8);
      camera.up.set(0, 1, 0);
      camera.lookAt(PLAN_W / 2, 1, PLAN_D / 2);
    } else if (view === 'walk') {
      camera.position.set(PLAN_W / 2, 1.65, PLAN_D / 2);
      camera.up.set(0, 1, 0);
      camera.lookAt(PLAN_W / 2 + 5, 1.65, PLAN_D / 2);
    }
  });
  return null;
}

function WalkController({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const moveDir = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!enabled) return;
    const k = keys;
    const down = (e: KeyboardEvent) => {
      k.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      k.current[e.code] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const speed = (keys.current['ShiftLeft'] || keys.current['ShiftRight']) ? 5 : 2.4;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    moveDir.current.set(0, 0, 0);
    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveDir.current.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveDir.current.sub(forward);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveDir.current.add(right);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveDir.current.sub(right);

    if (moveDir.current.lengthSq() > 0) {
      moveDir.current.normalize().multiplyScalar(speed * delta);
      camera.position.add(moveDir.current);
      camera.position.setY(1.65);
    }
  });
  return null;
}

export default function Scene3D(props: Props) {
  const {
    plan,
    view,
    showRoof,
    showLabels,
    showFurniture,
    showGrid,
    showShell,
    selectedFurniture,
    selectedRoom,
    onSelectFurniture,
    onSelectRoom,
    onMoveFurniture,
    onRotateFurniture,
    editable,
  } = props;

  return (
    <Canvas
      shadows
      camera={{ position: [PLAN_W / 2 + 9, 11, PLAN_D + 8], fov: 50, near: 0.1, far: 200 }}
      onPointerMissed={() => {
        onSelectFurniture(null);
        onSelectRoom(null);
      }}
    >
      <color attach="background" args={['#dde6ee']} />
      <Sky sunPosition={[12, 24, 8]} turbidity={6} rayleigh={1.2} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[15, 22, 6]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
      />
      <Environment preset="city" />

      {/* Ground plane around the house */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLAN_W / 2, -0.16, PLAN_D / 2]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#7e9967" roughness={1} />
      </mesh>

      {showGrid && (
        <Grid
          args={[40, 40]}
          position={[PLAN_W / 2, 0.001, PLAN_D / 2]}
          cellSize={1}
          cellThickness={0.4}
          sectionSize={5}
          sectionThickness={1}
          cellColor="#7c8a99"
          sectionColor="#4a5e75"
          fadeDistance={50}
          infiniteGrid={false}
        />
      )}

      <Floor3D
        outline={plan.outline}
        rooms={plan.rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={onSelectRoom}
      />

      <ContactShadows
        position={[PLAN_W / 2, 0.02, PLAN_D / 2]}
        scale={30}
        far={4}
        blur={2.5}
        opacity={0.35}
      />

      {showShell &&
        plan.walls.map((w) => (
          <Wall3D
            key={w.id}
            wall={w}
            height={plan.wallHeight}
            thickness={w.exterior ? plan.exteriorThickness : plan.interiorThickness}
            color={w.exterior ? '#f4ede0' : '#ece4d2'}
          />
        ))}

      {showRoof && showShell && (
        <Roof3D outline={plan.outline} wallHeight={plan.wallHeight + 0.02} />
      )}

      {showFurniture &&
        plan.furniture.map((f) => (
          <Furniture3D
            key={f.id}
            item={f}
            selected={selectedFurniture === f.id}
            onSelect={() => onSelectFurniture(f.id)}
            onMove={(pos) => onMoveFurniture(f.id, pos)}
            onRotate={(rot) => onRotateFurniture(f.id, rot)}
            showLabels={showLabels && selectedFurniture === f.id}
            editable={editable && view !== 'walk'}
          />
        ))}

      {showLabels && plan.rooms.map((r) => <RoomLabel key={r.id} room={r} />)}

      <ViewCamera view={view} />
      {view === 'walk' ? (
        <>
          <PointerLockControls />
          <WalkController enabled />
        </>
      ) : (
        <OrbitControls
          target={[PLAN_W / 2, 1, PLAN_D / 2]}
          enablePan
          enableRotate={view !== 'top'}
          maxPolarAngle={view === 'top' ? 0 : Math.PI / 2.1}
          minDistance={3}
          maxDistance={45}
        />
      )}

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#c44', '#4a4', '#46c']} labelColor="white" />
      </GizmoHelper>
    </Canvas>
  );
}
