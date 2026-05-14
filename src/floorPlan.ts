import type { FloorPlan } from './types';

/**
 * Floor plan reconstructed from the hand-drawn "PLAN BV, BEF. SITUATION" (26.02.22, scale 1:100).
 * Coordinates are in meters. Origin is the front-left outside corner of the porch.
 * +X runs to the right (east), +Z runs to the back (north).
 *
 * Approximate building envelope: 13m wide x 6m deep, with a 2.0m x 1.5m
 * entry porch projecting forward of the middle bay.
 */

const W = 13.0; // overall width
const D = 6.0; // depth of main rectangle (back of house)
const PORCH_FRONT = 0.0;
const MAIN_FRONT = 1.5; // main rectangle starts 1.5m behind the porch
const PORCH_W = 2.0;
const PORCH_LEFT = 5.5;
const PORCH_RIGHT = PORCH_LEFT + PORCH_W; // 7.5

// Interior dividers
const LEFT_WALL_X = 5.5; // left of middle bay
const RIGHT_WALL_X = 8.5; // right of middle bay (right room starts here)
const KITCHEN_BACK_Z = MAIN_FRONT + 3.5; // 5.0 — staircase / kitchen back wall
const KITCHEN_FRONT_Z = MAIN_FRONT + 1.6; // 3.1 — kitchen sits between bathroom and stairs
const BATH_RIGHT_X = 7.0; // bathroom takes left side of vestibule strip

export const FLOOR_PLAN: FloorPlan = {
  wallHeight: 2.6,
  exteriorThickness: 0.32,
  interiorThickness: 0.14,

  // Building outline: main rectangle plus front porch bump-out.
  // Counter-clockwise so the floor faces up.
  outline: [
    [0, MAIN_FRONT],
    [PORCH_LEFT, MAIN_FRONT],
    [PORCH_LEFT, PORCH_FRONT],
    [PORCH_RIGHT, PORCH_FRONT],
    [PORCH_RIGHT, MAIN_FRONT],
    [W, MAIN_FRONT],
    [W, MAIN_FRONT + D],
    [0, MAIN_FRONT + D],
  ],

  rooms: [
    {
      id: 'living',
      name: 'Living Room',
      color: '#f5e7c8',
      polygon: [
        [0, MAIN_FRONT],
        [LEFT_WALL_X, MAIN_FRONT],
        [LEFT_WALL_X, MAIN_FRONT + D],
        [0, MAIN_FRONT + D],
      ],
    },
    {
      id: 'sunroom',
      name: 'Sun Room',
      color: '#e2efe1',
      polygon: [
        [RIGHT_WALL_X, MAIN_FRONT],
        [W, MAIN_FRONT],
        [W, MAIN_FRONT + D],
        [RIGHT_WALL_X, MAIN_FRONT + D],
      ],
    },
    {
      id: 'stairs',
      name: 'Stairs',
      color: '#dfe6ef',
      polygon: [
        [LEFT_WALL_X, KITCHEN_BACK_Z],
        [RIGHT_WALL_X, KITCHEN_BACK_Z],
        [RIGHT_WALL_X, MAIN_FRONT + D],
        [LEFT_WALL_X, MAIN_FRONT + D],
      ],
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      color: '#fbe9d8',
      polygon: [
        [LEFT_WALL_X, KITCHEN_FRONT_Z],
        [RIGHT_WALL_X, KITCHEN_FRONT_Z],
        [RIGHT_WALL_X, KITCHEN_BACK_Z],
        [LEFT_WALL_X, KITCHEN_BACK_Z],
      ],
    },
    {
      id: 'bath',
      name: 'WC',
      color: '#dbe9f4',
      polygon: [
        [LEFT_WALL_X, MAIN_FRONT],
        [BATH_RIGHT_X, MAIN_FRONT],
        [BATH_RIGHT_X, KITCHEN_FRONT_Z],
        [LEFT_WALL_X, KITCHEN_FRONT_Z],
      ],
    },
    {
      id: 'entry',
      name: 'Entry',
      color: '#efe4f2',
      polygon: [
        [BATH_RIGHT_X, MAIN_FRONT],
        [RIGHT_WALL_X, MAIN_FRONT],
        [RIGHT_WALL_X, KITCHEN_FRONT_Z],
        [BATH_RIGHT_X, KITCHEN_FRONT_Z],
      ],
    },
    {
      id: 'porch',
      name: 'Porch',
      color: '#eadcc6',
      polygon: [
        [PORCH_LEFT, PORCH_FRONT],
        [PORCH_RIGHT, PORCH_FRONT],
        [PORCH_RIGHT, MAIN_FRONT],
        [PORCH_LEFT, MAIN_FRONT],
      ],
    },
  ],

  walls: [
    // --- Exterior perimeter (counter-clockwise) ---
    // Left wall of main rectangle (front porch level to back)
    {
      id: 'ext-left',
      exterior: true,
      start: [0, MAIN_FRONT],
      end: [0, MAIN_FRONT + D],
      openings: [
        { id: 'w-left-1', kind: 'window', position: 1.3, width: 1.2, height: 1.3, sill: 0.9 },
        { id: 'w-left-2', kind: 'window', position: 3.4, width: 1.2, height: 1.3, sill: 0.9 },
        { id: 'w-left-3', kind: 'window', position: 5.2, width: 0.9, height: 1.3, sill: 0.9 },
      ],
    },
    // Back wall (top of plan)
    {
      id: 'ext-back',
      exterior: true,
      start: [0, MAIN_FRONT + D],
      end: [W, MAIN_FRONT + D],
      openings: [
        { id: 'w-back-1', kind: 'window', position: 2.0, width: 1.2, height: 1.3, sill: 0.9 },
        { id: 'w-back-2', kind: 'window', position: 4.0, width: 1.2, height: 1.3, sill: 0.9 },
        { id: 'w-back-3', kind: 'window', position: 9.5, width: 1.2, height: 1.3, sill: 0.9 },
        { id: 'w-back-4', kind: 'window', position: 11.3, width: 1.2, height: 1.3, sill: 0.9 },
      ],
    },
    // Right wall (sun room) — lots of glazing toward garden
    {
      id: 'ext-right',
      exterior: true,
      start: [W, MAIN_FRONT + D],
      end: [W, MAIN_FRONT],
      openings: [
        { id: 'w-right-1', kind: 'window', position: 1.0, width: 1.4, height: 2.0, sill: 0.3 },
        { id: 'w-right-2', kind: 'window', position: 3.0, width: 1.4, height: 2.0, sill: 0.3 },
        { id: 'w-right-3', kind: 'door', position: 5.0, width: 1.0, height: 2.1, sill: 0 },
      ],
    },
    // Front wall right of porch (under sunroom)
    {
      id: 'ext-front-right',
      exterior: true,
      start: [W, MAIN_FRONT],
      end: [PORCH_RIGHT, MAIN_FRONT],
      openings: [
        { id: 'w-fr-1', kind: 'window', position: 2.0, width: 1.4, height: 1.3, sill: 0.9 },
        { id: 'w-fr-2', kind: 'window', position: 4.0, width: 1.4, height: 1.3, sill: 0.9 },
      ],
    },
    // Porch right side
    {
      id: 'ext-porch-right',
      exterior: true,
      start: [PORCH_RIGHT, MAIN_FRONT],
      end: [PORCH_RIGHT, PORCH_FRONT],
      openings: [],
    },
    // Porch front
    {
      id: 'ext-porch-front',
      exterior: true,
      start: [PORCH_RIGHT, PORCH_FRONT],
      end: [PORCH_LEFT, PORCH_FRONT],
      openings: [
        // Front entry door
        { id: 'front-door', kind: 'door', position: 1.0, width: 0.95, height: 2.1, sill: 0 },
      ],
    },
    // Porch left side
    {
      id: 'ext-porch-left',
      exterior: true,
      start: [PORCH_LEFT, PORCH_FRONT],
      end: [PORCH_LEFT, MAIN_FRONT],
      openings: [],
    },
    // Front wall left of porch (under living room)
    {
      id: 'ext-front-left',
      exterior: true,
      start: [PORCH_LEFT, MAIN_FRONT],
      end: [0, MAIN_FRONT],
      openings: [
        { id: 'w-fl-1', kind: 'window', position: 2.0, width: 1.2, height: 1.3, sill: 0.9 },
        { id: 'w-fl-2', kind: 'window', position: 4.0, width: 1.2, height: 1.3, sill: 0.9 },
      ],
    },

    // --- Interior partitions ---
    // Wall between living room and middle bay
    {
      id: 'int-left-divider',
      start: [LEFT_WALL_X, MAIN_FRONT],
      end: [LEFT_WALL_X, MAIN_FRONT + D],
      openings: [
        { id: 'd-living', kind: 'door', position: 4.5, width: 0.9, height: 2.05, sill: 0 },
      ],
    },
    // Wall between middle bay and sun room
    {
      id: 'int-right-divider',
      start: [RIGHT_WALL_X, MAIN_FRONT],
      end: [RIGHT_WALL_X, MAIN_FRONT + D],
      openings: [
        { id: 'd-sun', kind: 'door', position: 2.2, width: 1.0, height: 2.05, sill: 0 },
      ],
    },
    // Stairs front wall
    {
      id: 'int-stairs-front',
      start: [LEFT_WALL_X, KITCHEN_BACK_Z],
      end: [RIGHT_WALL_X, KITCHEN_BACK_Z],
      openings: [
        { id: 'd-stairs', kind: 'door', position: 2.2, width: 0.9, height: 2.05, sill: 0 },
      ],
    },
    // Kitchen / bath divider (kitchen front wall above bathroom)
    {
      id: 'int-kitchen-front',
      start: [LEFT_WALL_X, KITCHEN_FRONT_Z],
      end: [RIGHT_WALL_X, KITCHEN_FRONT_Z],
      openings: [
        { id: 'd-kitchen', kind: 'door', position: 2.2, width: 0.9, height: 2.05, sill: 0 },
      ],
    },
    // Bathroom / entry partition
    {
      id: 'int-bath-entry',
      start: [BATH_RIGHT_X, MAIN_FRONT],
      end: [BATH_RIGHT_X, KITCHEN_FRONT_Z],
      openings: [
        { id: 'd-bath', kind: 'door', position: 1.0, width: 0.75, height: 2.05, sill: 0 },
      ],
    },
  ],

  furniture: [
    // Living room
    {
      id: 'f-sofa-1',
      kind: 'sofa',
      label: 'Sofa',
      position: [1.4, 5.6],
      rotation: Math.PI / 2,
      size: [2.4, 0.95],
      color: '#5a7fa6',
    },
    {
      id: 'f-coffee',
      kind: 'coffeeTable',
      label: 'Coffee Table',
      position: [2.7, 5.6],
      rotation: 0,
      size: [1.1, 0.6],
      color: '#7a5a3c',
    },
    {
      id: 'f-armchair',
      kind: 'armchair',
      label: 'Armchair',
      position: [4.0, 4.2],
      rotation: -Math.PI / 2,
      size: [0.9, 0.9],
      color: '#7d8f74',
    },
    {
      id: 'f-tv',
      kind: 'tv',
      label: 'TV',
      position: [0.3, 5.6],
      rotation: Math.PI / 2,
      size: [1.4, 0.1],
      color: '#222',
    },
    {
      id: 'f-rug',
      kind: 'rug',
      label: 'Rug',
      position: [2.7, 5.4],
      rotation: 0,
      size: [3.0, 2.0],
      color: '#c8a87a',
    },
    {
      id: 'f-plant',
      kind: 'plant',
      label: 'Plant',
      position: [4.6, 7.0],
      rotation: 0,
      size: [0.6, 0.6],
      color: '#3b6b3b',
    },

    // Sun room
    {
      id: 'f-dining',
      kind: 'diningTable',
      label: 'Dining Table',
      position: [10.7, 4.5],
      rotation: 0,
      size: [1.8, 0.95],
      color: '#8b6a48',
    },
    {
      id: 'f-chair-1',
      kind: 'chair',
      label: 'Chair',
      position: [10.0, 4.5],
      rotation: -Math.PI / 2,
      size: [0.45, 0.45],
      color: '#5b4632',
    },
    {
      id: 'f-chair-2',
      kind: 'chair',
      label: 'Chair',
      position: [11.4, 4.5],
      rotation: Math.PI / 2,
      size: [0.45, 0.45],
      color: '#5b4632',
    },
    {
      id: 'f-chair-3',
      kind: 'chair',
      label: 'Chair',
      position: [10.7, 3.9],
      rotation: 0,
      size: [0.45, 0.45],
      color: '#5b4632',
    },
    {
      id: 'f-chair-4',
      kind: 'chair',
      label: 'Chair',
      position: [10.7, 5.1],
      rotation: Math.PI,
      size: [0.45, 0.45],
      color: '#5b4632',
    },
    {
      id: 'f-armchair-2',
      kind: 'armchair',
      label: 'Reading Chair',
      position: [12.0, 6.9],
      rotation: -Math.PI / 4,
      size: [0.9, 0.9],
      color: '#a07060',
    },

    // Kitchen
    {
      id: 'f-counter',
      kind: 'kitchenCounter',
      label: 'Counter',
      position: [(LEFT_WALL_X + RIGHT_WALL_X) / 2, KITCHEN_BACK_Z - 0.35],
      rotation: 0,
      size: [2.6, 0.6],
      color: '#e9ddc8',
    },
    {
      id: 'f-stove',
      kind: 'stove',
      label: 'Stove',
      position: [LEFT_WALL_X + 0.5, KITCHEN_BACK_Z - 0.35],
      rotation: 0,
      size: [0.6, 0.6],
      color: '#444',
    },
    {
      id: 'f-fridge',
      kind: 'fridge',
      label: 'Fridge',
      position: [RIGHT_WALL_X - 0.4, KITCHEN_BACK_Z - 0.4],
      rotation: 0,
      size: [0.7, 0.7],
      color: '#dcdcdc',
    },
    {
      id: 'f-island',
      kind: 'kitchenIsland',
      label: 'Island',
      position: [(LEFT_WALL_X + RIGHT_WALL_X) / 2, (KITCHEN_FRONT_Z + KITCHEN_BACK_Z) / 2],
      rotation: 0,
      size: [1.6, 0.7],
      color: '#d9c7a3',
    },

    // Bathroom
    {
      id: 'f-toilet',
      kind: 'toilet',
      label: 'Toilet',
      position: [LEFT_WALL_X + 0.4, MAIN_FRONT + 0.5],
      rotation: 0,
      size: [0.4, 0.6],
      color: '#fff',
    },
    {
      id: 'f-sink',
      kind: 'sink',
      label: 'Sink',
      position: [BATH_RIGHT_X - 0.3, MAIN_FRONT + 0.35],
      rotation: 0,
      size: [0.55, 0.4],
      color: '#fff',
    },

    // Stairs
    {
      id: 'f-stairs',
      kind: 'stairs',
      label: 'Stairs Up',
      position: [(LEFT_WALL_X + RIGHT_WALL_X) / 2, (KITCHEN_BACK_Z + MAIN_FRONT + D) / 2],
      rotation: 0,
      size: [2.6, 0.9],
      color: '#a8866a',
    },
  ],
};
