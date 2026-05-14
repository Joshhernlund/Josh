export type Vec2 = [number, number];

export type Opening = {
  id: string;
  kind: 'door' | 'window';
  /** Distance from wall start, in meters, to the center of the opening */
  position: number;
  width: number;
  height: number;
  /** Bottom of opening above floor (meters). 0 for doors. */
  sill: number;
};

export type Wall = {
  id: string;
  start: Vec2;
  end: Vec2;
  /** Exterior walls are rendered slightly thicker. */
  exterior?: boolean;
  openings: Opening[];
};

export type Room = {
  id: string;
  name: string;
  /** Polygon footprint in plan coordinates. */
  polygon: Vec2[];
  color: string;
};

export type FurnitureKind =
  | 'bed'
  | 'sofa'
  | 'armchair'
  | 'diningTable'
  | 'coffeeTable'
  | 'chair'
  | 'rug'
  | 'kitchenIsland'
  | 'kitchenCounter'
  | 'fridge'
  | 'stove'
  | 'toilet'
  | 'sink'
  | 'shower'
  | 'wardrobe'
  | 'desk'
  | 'tv'
  | 'plant'
  | 'stairs';

export type FurnitureItem = {
  id: string;
  kind: FurnitureKind;
  label?: string;
  /** Center position in plan coordinates (meters). */
  position: Vec2;
  /** Rotation around vertical axis in radians. */
  rotation: number;
  /** Length (along local x), depth (along local z) in meters. */
  size: Vec2;
  color?: string;
};

export type FloorPlan = {
  /** Wall height in meters. */
  wallHeight: number;
  /** Exterior wall thickness in meters. */
  exteriorThickness: number;
  /** Interior wall thickness in meters. */
  interiorThickness: number;
  /** Outline of the building floor slab. */
  outline: Vec2[];
  rooms: Room[];
  walls: Wall[];
  furniture: FurnitureItem[];
};
