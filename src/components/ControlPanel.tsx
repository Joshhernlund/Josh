import type { FloorPlan, FurnitureItem, FurnitureKind } from '../types';
import type { ViewMode } from './Scene3D';

type Props = {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  showRoof: boolean;
  setShowRoof: (b: boolean) => void;
  showShell: boolean;
  setShowShell: (b: boolean) => void;
  showLabels: boolean;
  setShowLabels: (b: boolean) => void;
  showFurniture: boolean;
  setShowFurniture: (b: boolean) => void;
  showGrid: boolean;
  setShowGrid: (b: boolean) => void;
  editable: boolean;
  setEditable: (b: boolean) => void;
  selectedFurniture: FurnitureItem | null;
  selectedRoom: { id: string; name: string; area: number } | null;
  onAddFurniture: (kind: FurnitureKind) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onResize: (axis: 0 | 1, delta: number) => void;
  onColor: (color: string) => void;
  onReset: () => void;
  plan: FloorPlan;
};

const FURNITURE_PALETTE: { kind: FurnitureKind; label: string }[] = [
  { kind: 'sofa', label: 'Sofa' },
  { kind: 'armchair', label: 'Armchair' },
  { kind: 'coffeeTable', label: 'Coffee Table' },
  { kind: 'diningTable', label: 'Dining Table' },
  { kind: 'chair', label: 'Chair' },
  { kind: 'bed', label: 'Bed' },
  { kind: 'wardrobe', label: 'Wardrobe' },
  { kind: 'desk', label: 'Desk' },
  { kind: 'rug', label: 'Rug' },
  { kind: 'plant', label: 'Plant' },
  { kind: 'tv', label: 'TV' },
  { kind: 'kitchenCounter', label: 'Counter' },
  { kind: 'kitchenIsland', label: 'Island' },
  { kind: 'fridge', label: 'Fridge' },
  { kind: 'stove', label: 'Stove' },
];

const COLOR_SWATCHES = [
  '#5a7fa6',
  '#7d8f74',
  '#a07060',
  '#c8a87a',
  '#8b6a48',
  '#3a3a3a',
  '#dcdcdc',
  '#d99a72',
  '#6b8e6b',
  '#5e4b6e',
];

export default function ControlPanel(props: Props) {
  const {
    view,
    setView,
    showRoof,
    setShowRoof,
    showShell,
    setShowShell,
    showLabels,
    setShowLabels,
    showFurniture,
    setShowFurniture,
    showGrid,
    setShowGrid,
    editable,
    setEditable,
    selectedFurniture,
    selectedRoom,
    onAddFurniture,
    onDuplicate,
    onDelete,
    onRotateLeft,
    onRotateRight,
    onResize,
    onColor,
    onReset,
    plan,
  } = props;

  const totalArea = plan.rooms
    .filter((r) => r.id !== 'porch')
    .reduce((sum, r) => {
      let a = 0;
      for (let i = 0; i < r.polygon.length; i++) {
        const [x1, z1] = r.polygon[i];
        const [x2, z2] = r.polygon[(i + 1) % r.polygon.length];
        a += x1 * z2 - x2 * z1;
      }
      return sum + Math.abs(a) / 2;
    }, 0);

  return (
    <aside className="panel">
      <header className="panel-header">
        <h1>Floor Planner</h1>
        <p className="subtitle">PLAN BV — befintlig situation</p>
        <p className="meta">
          {totalArea.toFixed(1)} m² interior · {plan.rooms.length - 1} rooms · {plan.furniture.length} items
        </p>
      </header>

      <section className="section">
        <h2>View</h2>
        <div className="seg">
          <button className={view === 'orbit' ? 'on' : ''} onClick={() => setView('orbit')}>
            3D
          </button>
          <button className={view === 'top' ? 'on' : ''} onClick={() => setView('top')}>
            Top
          </button>
          <button className={view === 'walk' ? 'on' : ''} onClick={() => setView('walk')}>
            Walk
          </button>
        </div>
        {view === 'walk' && (
          <p className="hint">
            Click scene to capture mouse · WASD to move · Shift to run · Esc to release
          </p>
        )}
      </section>

      <section className="section">
        <h2>Display</h2>
        <label className="row">
          <input type="checkbox" checked={showShell} onChange={(e) => setShowShell(e.target.checked)} />
          Walls
        </label>
        <label className="row">
          <input type="checkbox" checked={showRoof} onChange={(e) => setShowRoof(e.target.checked)} />
          Roof
        </label>
        <label className="row">
          <input type="checkbox" checked={showFurniture} onChange={(e) => setShowFurniture(e.target.checked)} />
          Furniture
        </label>
        <label className="row">
          <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
          Room labels
        </label>
        <label className="row">
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Grid (1m)
        </label>
        <label className="row">
          <input type="checkbox" checked={editable} onChange={(e) => setEditable(e.target.checked)} />
          Edit mode
        </label>
      </section>

      {selectedRoom && (
        <section className="section">
          <h2>Selected room</h2>
          <div className="card">
            <div className="card-title">{selectedRoom.name}</div>
            <div className="card-meta">{selectedRoom.area.toFixed(2)} m²</div>
          </div>
        </section>
      )}

      {selectedFurniture && (
        <section className="section">
          <h2>{selectedFurniture.label ?? selectedFurniture.kind}</h2>
          <div className="card">
            <div className="card-meta">
              x: {selectedFurniture.position[0].toFixed(2)}m · z:{' '}
              {selectedFurniture.position[1].toFixed(2)}m
            </div>
            <div className="card-meta">
              {selectedFurniture.size[0].toFixed(2)}m × {selectedFurniture.size[1].toFixed(2)}m
            </div>
          </div>
          <div className="seg">
            <button onClick={onRotateLeft}>↺ 15°</button>
            <button onClick={onRotateRight}>↻ 15°</button>
          </div>
          <div className="seg">
            <button onClick={() => onResize(0, -0.1)}>W −</button>
            <button onClick={() => onResize(0, 0.1)}>W +</button>
            <button onClick={() => onResize(1, -0.1)}>D −</button>
            <button onClick={() => onResize(1, 0.1)}>D +</button>
          </div>
          <div className="swatches">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                className="swatch"
                title={c}
                style={{ background: c }}
                onClick={() => onColor(c)}
              />
            ))}
          </div>
          <div className="seg">
            <button onClick={onDuplicate}>Duplicate</button>
            <button className="danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </section>
      )}

      <section className="section">
        <h2>Add furniture</h2>
        <div className="grid">
          {FURNITURE_PALETTE.map((p) => (
            <button key={p.kind} className="palette-btn" onClick={() => onAddFurniture(p.kind)}>
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <button className="reset-btn" onClick={onReset}>
          Reset to original plan
        </button>
      </section>

      <footer className="footer">
        <p>
          Drag furniture in 3D / Top view · Right-click rotates · Click a room to highlight ·
          Scroll to zoom · Right-drag to pan.
        </p>
      </footer>
    </aside>
  );
}
