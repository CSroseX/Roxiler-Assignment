export type UserRole = 'admin' | 'user' | 'store_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  avgRating?: number;
  ratingsCount?: number;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}