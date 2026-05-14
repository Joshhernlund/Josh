import { useCallback, useMemo, useState } from 'react';
import './index.css';
import Scene3D, { type ViewMode } from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import { FLOOR_PLAN } from './floorPlan';
import type { FloorPlan, FurnitureItem, FurnitureKind, Vec2 } from './types';

const DEFAULT_SIZE: Record<FurnitureKind, Vec2> = {
  sofa: [2.2, 0.9],
  armchair: [0.9, 0.9],
  coffeeTable: [1.1, 0.6],
  diningTable: [1.6, 0.95],
  chair: [0.45, 0.45],
  bed: [1.6, 2.0],
  wardrobe: [1.4, 0.6],
  desk: [1.3, 0.6],
  rug: [2.0, 1.4],
  plant: [0.5, 0.5],
  tv: [1.4, 0.1],
  kitchenCounter: [1.8, 0.6],
  kitchenIsland: [1.6, 0.7],
  fridge: [0.7, 0.7],
  stove: [0.6, 0.6],
  toilet: [0.4, 0.6],
  sink: [0.55, 0.4],
  shower: [0.9, 0.9],
  stairs: [2.6, 0.9],
};

const DEFAULT_COLOR: Record<FurnitureKind, string> = {
  sofa: '#6b88a8',
  armchair: '#a07060',
  coffeeTable: '#7a5a3c',
  diningTable: '#8b6a48',
  chair: '#5b4632',
  bed: '#e0d2bc',
  wardrobe: '#8b6a48',
  desk: '#8b6a48',
  rug: '#c8a87a',
  plant: '#3b6b3b',
  tv: '#111',
  kitchenCounter: '#e9ddc8',
  kitchenIsland: '#d9c7a3',
  fridge: '#dcdcdc',
  stove: '#3a3a3a',
  toilet: '#fff',
  sink: '#fff',
  shower: '#cfd6da',
  stairs: '#a8866a',
};

function polygonArea(poly: Vec2[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, z1] = poly[i];
    const [x2, z2] = poly[(i + 1) % poly.length];
    a += x1 * z2 - x2 * z1;
  }
  return Math.abs(a) / 2;
}

export default function App() {
  const [plan, setPlan] = useState<FloorPlan>(FLOOR_PLAN);
  const [view, setView] = useState<ViewMode>('orbit');
  const [showRoof, setShowRoof] = useState(false);
  const [showShell, setShowShell] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [editable, setEditable] = useState(true);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const selectedFurniture = useMemo(
    () => plan.furniture.find((f) => f.id === selectedFurnitureId) ?? null,
    [plan.furniture, selectedFurnitureId],
  );

  const selectedRoom = useMemo(() => {
    const r = plan.rooms.find((rm) => rm.id === selectedRoomId);
    if (!r) return null;
    return { id: r.id, name: r.name, area: polygonArea(r.polygon) };
  }, [plan.rooms, selectedRoomId]);

  const moveFurniture = useCallback((id: string, pos: Vec2) => {
    setPlan((p) => ({
      ...p,
      furniture: p.furniture.map((f) => (f.id === id ? { ...f, position: pos } : f)),
    }));
  }, []);

  const rotateFurniture = useCallback((id: string, rotation: number) => {
    setPlan((p) => ({
      ...p,
      furniture: p.furniture.map((f) => (f.id === id ? { ...f, rotation } : f)),
    }));
  }, []);

  const resizeFurniture = useCallback(
    (axis: 0 | 1, delta: number) => {
      if (!selectedFurniture) return;
      setPlan((p) => ({
        ...p,
        furniture: p.furniture.map((f) => {
          if (f.id !== selectedFurniture.id) return f;
          const size: Vec2 = [f.size[0], f.size[1]];
          size[axis] = Math.max(0.2, Math.round((size[axis] + delta) * 100) / 100);
          return { ...f, size };
        }),
      }));
    },
    [selectedFurniture],
  );

  const colorFurniture = useCallback(
    (color: string) => {
      if (!selectedFurniture) return;
      setPlan((p) => ({
        ...p,
        furniture: p.furniture.map((f) =>
          f.id === selectedFurniture.id ? { ...f, color } : f,
        ),
      }));
    },
    [selectedFurniture],
  );

  const duplicate = useCallback(() => {
    if (!selectedFurniture) return;
    const id = `${selectedFurniture.kind}-${Date.now()}`;
    setPlan((p) => ({
      ...p,
      furniture: [
        ...p.furniture,
        {
          ...selectedFurniture,
          id,
          position: [selectedFurniture.position[0] + 0.6, selectedFurniture.position[1] + 0.6],
        },
      ],
    }));
    setSelectedFurnitureId(id);
  }, [selectedFurniture]);

  const remove = useCallback(() => {
    if (!selectedFurniture) return;
    const id = selectedFurniture.id;
    setPlan((p) => ({ ...p, furniture: p.furniture.filter((f) => f.id !== id) }));
    setSelectedFurnitureId(null);
  }, [selectedFurniture]);

  const addFurniture = useCallback((kind: FurnitureKind) => {
    const id = `${kind}-${Date.now()}`;
    const item: FurnitureItem = {
      id,
      kind,
      label: kind.charAt(0).toUpperCase() + kind.slice(1),
      position: [6.5, 3.5],
      rotation: 0,
      size: DEFAULT_SIZE[kind],
      color: DEFAULT_COLOR[kind],
    };
    setPlan((p) => ({ ...p, furniture: [...p.furniture, item] }));
    setSelectedFurnitureId(id);
  }, []);

  const reset = useCallback(() => {
    setPlan(FLOOR_PLAN);
    setSelectedFurnitureId(null);
    setSelectedRoomId(null);
  }, []);

  const rotateLeft = useCallback(() => {
    if (!selectedFurniture) return;
    rotateFurniture(selectedFurniture.id, selectedFurniture.rotation - Math.PI / 12);
  }, [selectedFurniture, rotateFurniture]);

  const rotateRight = useCallback(() => {
    if (!selectedFurniture) return;
    rotateFurniture(selectedFurniture.id, selectedFurniture.rotation + Math.PI / 12);
  }, [selectedFurniture, rotateFurniture]);

  return (
    <div className="app">
      <ControlPanel
        view={view}
        setView={setView}
        showRoof={showRoof}
        setShowRoof={setShowRoof}
        showShell={showShell}
        setShowShell={setShowShell}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        showFurniture={showFurniture}
        setShowFurniture={setShowFurniture}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        editable={editable}
        setEditable={setEditable}
        selectedFurniture={selectedFurniture}
        selectedRoom={selectedRoom}
        onAddFurniture={addFurniture}
        onDuplicate={duplicate}
        onDelete={remove}
        onRotateLeft={rotateLeft}
        onRotateRight={rotateRight}
        onResize={resizeFurniture}
        onColor={colorFurniture}
        onReset={reset}
        plan={plan}
      />
      <main className="scene">
        <Scene3D
          plan={plan}
          view={view}
          showRoof={showRoof}
          showShell={showShell}
          showLabels={showLabels}
          showFurniture={showFurniture}
          showGrid={showGrid}
          selectedFurniture={selectedFurnitureId}
          selectedRoom={selectedRoomId}
          onSelectFurniture={setSelectedFurnitureId}
          onSelectRoom={setSelectedRoomId}
          onMoveFurniture={moveFurniture}
          onRotateFurniture={rotateFurniture}
          editable={editable}
        />
      </main>
    </div>
  );
}
