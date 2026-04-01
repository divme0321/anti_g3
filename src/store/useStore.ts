import { create } from 'zustand';

export interface Point {
  x: number;
  y: number;
  id: string;
}

export interface Furniture {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

interface AppState {
  // Mode: EDIT (drawing layout) or SIMULATE (moving furniture)
  mode: 'EDIT' | 'SIMULATE';
  setMode: (mode: 'EDIT' | 'SIMULATE') => void;

  // Layout points (2D coordinates)
  points: Point[];
  addPoint: (x: number, y: number) => void;
  removePoint: (id: string) => void;
  updatePoint: (id: string, x: number, y: number) => void;
  clearPoints: () => void;

  // Furniture state
  furniture: Furniture;
  updateFurniture: (updates: Partial<Furniture>) => void;

  // Simulation state
  isColliding: boolean;
  setIsColliding: (status: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  mode: 'EDIT',
  setMode: (mode) => set({ mode }),

  points: [
    { x: -5, y: -5, id: '1' },
    { x: 5, y: -5, id: '2' },
    { x: 5, y: 5, id: '3' },
    { x: -5, y: 5, id: '4' },
    { x: -5, y: -5, id: '5' }, // Close loop for default
  ],
  addPoint: (x, y) => set((state) => ({ 
    points: [...state.points, { x, y, id: Math.random().toString(36).substr(2, 9) }] 
  })),
  removePoint: (id) => set((state) => ({ 
    points: state.points.filter((p) => p.id !== id) 
  })),
  updatePoint: (id, x, y) => set((state) => ({
    points: state.points.map((p) => p.id === id ? { ...p, x, y } : p)
  })),
  clearPoints: () => set({ points: [] }),

  furniture: {
    width: 2.0,
    height: 1.8,
    depth: 0.8,
    position: [0, 0.9, 0],
    rotation: [0, 0, 0],
    color: '#3b82f6',
  },
  updateFurniture: (updates) => set((state) => ({ 
    furniture: { ...state.furniture, ...updates } 
  })),

  isColliding: false,
  setIsColliding: (isColliding) => set({ isColliding }),
}));
