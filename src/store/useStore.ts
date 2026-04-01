import { create } from 'zustand';

export interface Point {
  x: number;
  y: number;
  id: string;
}

export interface Furniture {
  name: string;
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

export const PRESETS: Record<string, Partial<Furniture>> = {
  'custom': { name: 'カスタム' },
  'bed': { name: 'シングルベッド', width: 1.0, height: 0.45, depth: 2.0, color: '#3b82f6' },
  'refrigerator': { name: '冷蔵庫', width: 0.6, height: 1.8, depth: 0.7, color: '#94a3b8' },
  'sofa': { name: '3人掛けソファ', width: 2.1, height: 0.8, depth: 0.9, color: '#f59e0b' },
  'washing-machine': { name: 'ドラム式洗濯機', width: 0.6, height: 1.0, depth: 0.7, color: '#10b981' },
};

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
    name: 'カスタム',
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
