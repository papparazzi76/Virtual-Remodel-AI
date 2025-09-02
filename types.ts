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
  | 'Dramatic & Dim';

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

export type RemodelMode = 'style' | 'custom' | 'inpainting';

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