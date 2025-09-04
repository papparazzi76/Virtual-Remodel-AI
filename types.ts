export enum RemodelingType {
  WithoutFurniture = 'without-furniture',
  WithFurniture = 'with-furniture',
}

export type DecorStyle =
  | 'Modern'
  | 'Contemporary'
  | 'Minimalist'
  | 'Scandinavian'
  | 'Rustic'
  | 'Industrial'
  | 'Boho Chic'
  | 'Modern Luxury'
  | 'Classic Luxury';

export type Material =
  | 'White Paint'
  | 'Light Wood'
  | 'Dark Wood'
  | 'Polished Concrete'
  | 'Marble Tile'
  | 'Exposed Brick'
  | 'Modern Tile';

export type Lighting =
  | 'Bright & Airy'
  | 'Warm & Cozy'
  | 'Cool & Modern'
  | 'Dramatic & Dim'
  | 'Golden Hour'
  | 'Studio Light'
  | 'Night Time'
  | 'Overcast';

export type RoomType =
  | 'Master Bedroom'
  | 'Single Bedroom'
  | 'Youth Bedroom'
  | 'Powder Room'
  | 'Full Bathroom'
  | 'Kitchen'
  | 'Living Room'
  | 'Family Room'
  | 'Terrace'
  | 'Garden'
  | 'Garage';

export type CustomItemCategory =
  | 'Wall Material'
  | 'Floor Material'
  | 'Door'
  | 'Window'
  | 'Furniture'
  | 'Appliance';

export interface CustomItem {
  id: string;
  name: string;
  category: CustomItemCategory;
  dataUrl: string;
  mimeType: string;
}

export interface PermanentItem {
  id:string;
  labelKey: string;
  category: CustomItemCategory;
  src: string;
}

export type RemodelMode = 'style' | 'custom' | 'inpainting' | 'material';

// --- New Types for Material by Piece ---
export type TilingPattern = 'grid' | 'brick_50' | 'brick_custom' | 'diagonal_45';
export type AnchorPoint = 'top-left' | 'center';
export type EdgeHandling = 'clip' | 'extend';
export type TargetSurface = 'Walls' | 'Floor';
export type MaterialFinish = 'glossy' | 'matte';
export type TargetWall = 'left' | 'right' | 'front' | 'all';


// --- New Types for Authentication ---
export type UserRole = 'Guest' | 'Paid' | 'Admin';

export interface User {
  id: string;
  email: string;
  // NOTE: In a real app, never store the password hash on the client.
  // This is only for the purpose of this frontend-only simulation.
  passwordHash: string; 
  role: UserRole;
  credits: number;
}